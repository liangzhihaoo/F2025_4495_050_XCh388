import { Router } from "express";
import { z } from "zod";
import {
  getAppUser,
  updateUserPlanAndLimit,
  banUser,
  unbanUser,
  deleteAuthUser,
  deleteUserRow,
  deleteUserProducts,
  updateUserActiveStatus,
  supabase,
} from "../supabase.js";
import {
  ensureCustomer,
  upsertPlusSubscription,
  cancelAllSubsNow,
  pauseAllSubs,
  deleteCustomerIfPossible,
  resumeAllSubs,
  calculateMRR,
  getActiveSubscribers,
  calculateChurnRate,
  getFailedPayments,
  stripe,
} from "../stripe.js";
import { PLANS, uploadLimitFor } from "../lib/plan.js";
import { cache, CACHE_KEYS, CACHE_TTL } from "../lib/cache.js";
import type { BillingKpis, PlanBucket, FailedPayment } from "../types/billing.js";
import { env } from "../env.js";

export const adminRouter = Router();

/**
 * Change plan (upgrade/downgrade) without redirecting to Stripe pages.
 * - upgrade to client plus: ensure customer, ensure/default payment method, upsert subscription
 * - downgrade to free: cancel all active subscriptions immediately
 * Also updates Supabase users table.
 */
adminRouter.post("/users/:userId/plan", async (req, res) => {
  const Params = z.object({ userId: z.string().uuid() });
  const Body = z.object({ plan: z.enum([PLANS.FREE, PLANS.PLUS]) });
  try {
    const { userId } = Params.parse(req.params);
    const { plan } = Body.parse(req.body);

    const user = await getAppUser(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure Stripe customer if needed
    const customerId = await ensureCustomer({
      userId,
      email: user.email,
      existingCustomerId: user.stripe_customer_id,
    });

    if (plan === PLANS.PLUS) {
      // Upgrade: upsert sub (requires PM on file)
      try {
        await upsertPlusSubscription(customerId);
      } catch (e: any) {
        return res.status(409).json({
          error: "Upgrade failed",
          message: e?.message || "Unknown error",
          needs_payment_method: true,
        });
      }
      await resumeAllSubs(customerId); // make sure not paused
    } else {
      // Downgrade: cancel all subs immediately
      await cancelAllSubsNow(customerId);
    }

    await updateUserPlanAndLimit(
      userId,
      plan,
      uploadLimitFor(plan),
      customerId
    );

    return res.json({
      ok: true,
      userId,
      plan,
      upload_limit: uploadLimitFor(plan),
      stripe_customer_id: customerId,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Bad request" });
  }
});

/**
 * Deactivate account:
 * - Ban (set banned_until far future) to block login
 * - Pause all Stripe subscriptions to avoid further charges while deactivated
 * This is reversible (reactivation would clear the ban and resume subs; reactivation endpoint not included in MVP).
 */
adminRouter.post("/users/:userId/deactivate", async (req, res) => {
  const Params = z.object({ userId: z.string().uuid() });
  try {
    const { userId } = Params.parse(req.params);
    const user = await getAppUser(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const until = new Date("2999-01-01T00:00:00Z").toISOString();
    await banUser(userId, until);
    await updateUserActiveStatus(userId, false);

    if (user.stripe_customer_id) {
      await pauseAllSubs(user.stripe_customer_id);
    }

    return res.json({ ok: true, userId, status: "deactivated", is_active: false });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Bad request" });
  }
});

/**
 * Reactivate account:
 * - Clear ban to allow login
 * - Resume all Stripe subscriptions
 * - Set is_active to true
 */
adminRouter.post("/users/:userId/reactivate", async (req, res) => {
  const Params = z.object({ userId: z.string().uuid() });
  try {
    const { userId } = Params.parse(req.params);
    const user = await getAppUser(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await unbanUser(userId);
    await updateUserActiveStatus(userId, true);

    if (user.stripe_customer_id) {
      await resumeAllSubs(user.stripe_customer_id);
    }

    return res.json({ ok: true, userId, status: "reactivated", is_active: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Bad request" });
  }
});

/**
 * Delete account permanently:
 * - Cancel all Stripe subscriptions NOW and delete Stripe customer
 * - Delete user's products
 * - Delete users row
 * - Delete auth.users (removes login)
 */
adminRouter.delete("/users/:userId", async (req, res) => {
  const Params = z.object({ userId: z.string().uuid() });
  try {
    const { userId } = Params.parse(req.params);
    const user = await getAppUser(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.stripe_customer_id) {
      await cancelAllSubsNow(user.stripe_customer_id);
      await deleteCustomerIfPossible(user.stripe_customer_id);
    }

    await deleteUserProducts(userId);
    await deleteUserRow(userId);
    await deleteAuthUser(userId);

    return res.json({ ok: true, userId, deleted: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Bad request" });
  }
});

/**
 * Delete a product by ID
 */
adminRouter.delete("/products/:productId", async (req, res) => {
  const Params = z.object({ productId: z.string().uuid() });
  try {
    const { productId } = Params.parse(req.params);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true, productId, deleted: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Bad request" });
  }
});

/**
 * GET /admin/billing/metrics
 * Returns billing KPIs: MRR, ARR, Active Subscribers, ARPU, Churn Rate
 */
adminRouter.get("/billing/metrics", async (req, res) => {
  try {
    // Check cache first
    const cached = cache.get<BillingKpis>(CACHE_KEYS.BILLING_METRICS);
    if (cached) {
      return res.json(cached);
    }

    // Calculate metrics from Stripe
    const mrr = await calculateMRR();
    const activeSubscribers = await getActiveSubscribers();
    const churnRate30d = await calculateChurnRate();

    const arr = mrr * 12;
    const arpu = activeSubscribers > 0 ? mrr / activeSubscribers : 0;

    const metrics: BillingKpis = {
      mrr,
      arr,
      activeSubscribers,
      arpu,
      churnRate30d,
    };

    // Cache for 10 minutes
    cache.set(CACHE_KEYS.BILLING_METRICS, metrics, CACHE_TTL.BILLING_METRICS);

    return res.json(metrics);
  } catch (err: any) {
    console.error("Error calculating billing metrics:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/**
 * GET /admin/billing/plan-distribution
 * Returns subscriber count and MRR per plan (Free, Client Plus, Enterprise)
 */
adminRouter.get("/billing/plan-distribution", async (req, res) => {
  try {
    // Check cache first
    const cached = cache.get<PlanBucket[]>(CACHE_KEYS.PLAN_DISTRIBUTION);
    if (cached) {
      return res.json(cached);
    }

    const planBuckets: PlanBucket[] = [];

    // Get all active subscriptions and group by price ID
    let hasMore = true;
    let startingAfter: string | undefined = undefined;
    const subscriptionsByPrice: Map<string, { count: number; mrr: number }> = new Map();

    while (hasMore) {
      const response: any = await stripe.subscriptions.list({
        status: "active",
        limit: 100,
        ...(startingAfter && { starting_after: startingAfter }),
      });

      for (const sub of response.data) {
        for (const item of sub.items.data) {
          const priceId = item.price.id;
          const price = item.price;

          if (price.recurring) {
            // Normalize to monthly
            let mrr = (price.unit_amount || 0) * (item.quantity || 1) / 100;
            if (price.recurring.interval === "year") {
              mrr = mrr / 12;
            } else if (price.recurring.interval === "week") {
              mrr = mrr * 4.33;
            } else if (price.recurring.interval === "day") {
              mrr = mrr * 30.44;
            }

            const existing = subscriptionsByPrice.get(priceId) || { count: 0, mrr: 0 };
            subscriptionsByPrice.set(priceId, {
              count: existing.count + 1,
              mrr: existing.mrr + mrr,
            });
          }
        }
      }

      hasMore = response.has_more;
      if (hasMore && response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    // Map price IDs to plans
    const clientPlusData = subscriptionsByPrice.get(env.STRIPE_PRICE_CLIENT_PLUS);
    if (clientPlusData) {
      planBuckets.push({
        plan: "Client Plus",
        subscribers: clientPlusData.count,
        mrr: clientPlusData.mrr,
      });
    }

    if (env.STRIPE_PRICE_ENTERPRISE) {
      const enterpriseData = subscriptionsByPrice.get(env.STRIPE_PRICE_ENTERPRISE);
      if (enterpriseData) {
        planBuckets.push({
          plan: "Enterprise",
          subscribers: enterpriseData.count,
          mrr: enterpriseData.mrr,
        });
      }
    }

    // Get Free plan users from Supabase
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("plan", "Free");

    planBuckets.push({
      plan: "Free",
      subscribers: count || 0,
      mrr: 0,
    });

    // Cache for 10 minutes
    cache.set(CACHE_KEYS.PLAN_DISTRIBUTION, planBuckets, CACHE_TTL.PLAN_DISTRIBUTION);

    return res.json(planBuckets);
  } catch (err: any) {
    console.error("Error calculating plan distribution:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

/**
 * GET /admin/billing/failed-payments
 * Returns paginated list of failed payments with filters
 * Query params: page, pageSize, plan, status, userEmail
 */
adminRouter.get("/billing/failed-payments", async (req, res) => {
  try {
    const Query = z.object({
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(1).max(100).default(10),
      plan: z.enum(["Free", "Client Plus", "Enterprise"]).optional(),
      status: z.enum(["Open", "Retry Scheduled", "Resolved", "Canceled"]).optional(),
      userEmail: z.string().optional(),
    });

    const { page, pageSize, plan, status, userEmail } = Query.parse(req.query);

    // Check cache first (only for first page with no filters)
    const cacheKey = `${CACHE_KEYS.FAILED_PAYMENTS}:${page}:${pageSize}:${plan || ""}:${status || ""}:${userEmail || ""}`;
    const cached = cache.get<{ items: FailedPayment[]; total: number }>(cacheKey);
    if (cached) {
      return res.json({
        items: cached.items,
        total: cached.total,
        page,
        pageSize,
      });
    }

    // Get failed payments from Stripe
    const stripeFailedPayments = await getFailedPayments();

    // Get user data from Supabase to join email and plan
    const customerIds = [...new Set(stripeFailedPayments.map(fp => fp.customerId))];
    const { data: users } = await supabase
      .from("users")
      .select("stripe_customer_id, email, plan")
      .in("stripe_customer_id", customerIds);

    const userMap = new Map(users?.map(u => [u.stripe_customer_id, u]) || []);

    // Transform and filter
    let failedPayments: FailedPayment[] = stripeFailedPayments
      .map(fp => {
        const user = userMap.get(fp.customerId);
        return {
          id: fp.id,
          userEmail: user?.email || "Unknown",
          plan: (user?.plan || "Free") as any,
          amount: fp.amount,
          reason: fp.reason,
          attemptedAt: fp.attemptedAt,
          nextRetryAt: fp.nextRetryAt,
          status: fp.status as any,
          attempts: fp.attempts,
        };
      })
      .filter(fp => {
        if (plan && fp.plan !== plan) return false;
        if (status && fp.status !== status) return false;
        if (userEmail && !fp.userEmail.toLowerCase().includes(userEmail.toLowerCase())) return false;
        return true;
      });

    // Sort by attemptedAt desc
    failedPayments.sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime());

    const total = failedPayments.length;
    const start = (page - 1) * pageSize;
    const items = failedPayments.slice(start, start + pageSize);

    // Cache for 3 minutes
    cache.set(cacheKey, { items, total }, CACHE_TTL.FAILED_PAYMENTS);

    return res.json({ items, total, page, pageSize });
  } catch (err: any) {
    console.error("Error fetching failed payments:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});
