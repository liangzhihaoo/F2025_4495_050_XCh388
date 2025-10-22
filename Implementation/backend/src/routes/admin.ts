import { Router } from "express";
import { z } from "zod";
import {
  getAppUser,
  updateUserPlanAndLimit,
  banUser,
  deleteAuthUser,
  deleteUserRow,
  deleteUserProducts,
} from "../supabase.js";
import {
  ensureCustomer,
  upsertPlusSubscription,
  cancelAllSubsNow,
  pauseAllSubs,
  deleteCustomerIfPossible,
  resumeAllSubs,
} from "../stripe.js";
import { PLANS, uploadLimitFor } from "../lib/plan.js";

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

    if (user.stripe_customer_id) {
      await pauseAllSubs(user.stripe_customer_id);
    }

    return res.json({ ok: true, userId, status: "deactivated" });
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
