// Stripe minimal helpers to upgrade/downgrade/pause/cancel.
import Stripe from "stripe";
import { env } from "./env.js";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function ensureCustomer(params: {
  userId: string;
  email: string;
  existingCustomerId?: string | null;
}) {
  if (params.existingCustomerId) {
    // Verify it exists; if not, create a new one.
    try {
      await stripe.customers.retrieve(params.existingCustomerId);
      return params.existingCustomerId;
    } catch {
      // fall-through to create
    }
  }
  const customer = await stripe.customers.create({
    email: params.email,
    metadata: { supabase_user_id: params.userId },
  });
  return customer.id;
}

type Sub = Stripe.Subscription;

function isActiveLike(s: Sub) {
  return !["canceled", "incomplete_expired"].includes(s.status);
}

export async function listAllSubs(customerId: string) {
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    limit: 100,
  });
  return subs.data;
}

export async function cancelAllSubsNow(customerId: string) {
  const subs = await listAllSubs(customerId);
  await Promise.all(
    subs.filter(isActiveLike).map((s) => stripe.subscriptions.cancel(s.id))
  );
}

export async function pauseAllSubs(customerId: string) {
  const subs = await listAllSubs(customerId);
  await Promise.all(
    subs.filter(isActiveLike).map((s) =>
      stripe.subscriptions.update(s.id, {
        pause_collection: { behavior: "keep_as_draft" },
      })
    )
  );
}

export async function resumeAllSubs(customerId: string) {
  const subs = await listAllSubs(customerId);
  await Promise.all(
    subs
      .filter((s) => s.pause_collection)
      .map((s) =>
        stripe.subscriptions.update(s.id, { pause_collection: "" as any })
      )
  );
}

export async function customerHasPaymentMethod(customerId: string) {
  const pms = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  return pms.data.length > 0;
}

export async function upsertPlusSubscription(customerId: string) {
  const priceId = env.STRIPE_PRICE_CLIENT_PLUS;
  const subs = await listAllSubs(customerId);
  const active = subs.find(isActiveLike);

  if (active) {
    const line = active.items.data[0];
    if (line?.price?.id === priceId) {
      // Already on Plus; just make sure it's not paused.
      if (active.pause_collection) {
        await stripe.subscriptions.update(active.id, {
          pause_collection: "" as any,
        });
      }
      return active.id;
    }
    // Update the existing subscription item to Plus price.
    const updated = await stripe.subscriptions.update(active.id, {
      items: [{ id: line.id, price: priceId }],
      proration_behavior: "create_prorations",
      pause_collection: "" as any,
    });
    return updated.id;
  }

  // No subscription yet — require a default payment method to avoid redirect.
  if (!(await customerHasPaymentMethod(customerId))) {
    throw new Error(
      "Customer has no payment method on file. Cannot upgrade without redirect."
    );
  }

  const created = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    // Keep it simple for MVP. If payment fails, Stripe will handle dunning.
    payment_behavior: "default_incomplete",
  });

  return created.id;
}

export async function deleteCustomerIfPossible(customerId: string) {
  try {
    await stripe.customers.del(customerId);
  } catch {
    // If not deletable (existing history), it's fine — subscriptions already canceled.
  }
}

/**
 * Normalize a subscription price to monthly recurring revenue
 */
function normalizeToMonthly(
  unitAmount: number,
  interval: string,
  intervalCount: number,
  quantity: number
): number {
  const baseAmount = (unitAmount * quantity) / 100; // Convert cents to dollars

  if (interval === "month") {
    return baseAmount / intervalCount;
  } else if (interval === "year") {
    return baseAmount / (intervalCount * 12);
  } else if (interval === "week") {
    return (baseAmount * 4.33) / intervalCount;
  } else if (interval === "day") {
    return (baseAmount * 30.44) / intervalCount;
  }

  return 0;
}

/**
 * Calculate total MRR from all active subscriptions
 */
export async function calculateMRR(): Promise<number> {
  let totalMRR = 0;
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  while (hasMore) {
    const response: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
      ...(startingAfter && { starting_after: startingAfter }),
    });

    for (const sub of response.data) {
      // Calculate MRR for each subscription item
      for (const item of sub.items.data) {
        const price = item.price;
        if (price.recurring) {
          const mrr = normalizeToMonthly(
            price.unit_amount || 0,
            price.recurring.interval,
            price.recurring.interval_count,
            item.quantity || 1
          );
          totalMRR += mrr;
        }
      }
    }

    hasMore = response.has_more;
    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return totalMRR;
}

/**
 * Get count of active subscribers (subscriptions with status active or past_due)
 */
export async function getActiveSubscribers(): Promise<number> {
  let count = 0;
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  while (hasMore) {
    const response: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
      ...(startingAfter && { starting_after: startingAfter }),
    });

    count += response.data.length;
    hasMore = response.has_more;
    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return count;
}

/**
 * Calculate 30-day churn rate
 * Formula: (subscriptions canceled in last 30 days) / (active subscribers 30 days ago)
 */
export async function calculateChurnRate(): Promise<number> {
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

  let canceledCount = 0;
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  // Get subscriptions canceled in the last 30 days
  while (hasMore) {
    const response: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list({
      status: "canceled",
      limit: 100,
      ...(startingAfter && { starting_after: startingAfter }),
    });

    for (const sub of response.data) {
      // Check if canceled in the last 30 days
      if (sub.canceled_at && sub.canceled_at >= thirtyDaysAgo) {
        canceledCount++;
      }
    }

    hasMore = response.has_more;
    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  // Get current active subscribers count
  const activeCount = await getActiveSubscribers();

  // If no active subscribers, return 0
  if (activeCount === 0) {
    return 0;
  }

  // Calculate churn rate
  // Note: This is a simplified calculation. Ideally we'd track subscriber count 30 days ago
  const churnRate = canceledCount / (activeCount + canceledCount);

  return churnRate;
}

/**
 * Get failed payments from Stripe invoices
 */
export async function getFailedPayments() {
  const failedPayments: Array<{
    id: string;
    customerId: string;
    amount: number;
    reason: string;
    attemptedAt: string;
    nextRetryAt?: string;
    status: string;
    attempts: number;
  }> = [];

  // Get uncollectible invoices (permanently failed)
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  while (hasMore) {
    const response: Stripe.ApiList<Stripe.Invoice> = await stripe.invoices.list({
      status: "uncollectible",
      limit: 100,
      ...(startingAfter && { starting_after: startingAfter }),
    });

    for (const invoice of response.data) {
      failedPayments.push({
        id: invoice.id,
        customerId: invoice.customer as string,
        amount: invoice.amount_due / 100, // Convert cents to dollars
        reason:
          invoice.last_finalization_error?.message || "Payment failed",
        attemptedAt: new Date(invoice.created * 1000).toISOString(),
        status: "Canceled",
        attempts: invoice.attempt_count || 0,
      });
    }

    hasMore = response.has_more;
    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  // Get open invoices that have been attempted (retry pending)
  hasMore = true;
  startingAfter = undefined;

  while (hasMore) {
    const response: Stripe.ApiList<Stripe.Invoice> = await stripe.invoices.list({
      status: "open",
      limit: 100,
      ...(startingAfter && { starting_after: startingAfter }),
    });

    for (const invoice of response.data) {
      // Only include if payment has been attempted and failed
      if (invoice.attempted && invoice.amount_remaining > 0) {
        failedPayments.push({
          id: invoice.id,
          customerId: invoice.customer as string,
          amount: invoice.amount_remaining / 100, // Convert cents to dollars
          reason:
            invoice.last_finalization_error?.message ||
            "Payment attempt failed",
          attemptedAt: new Date(invoice.created * 1000).toISOString(),
          nextRetryAt: invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000).toISOString()
            : undefined,
          status: invoice.next_payment_attempt
            ? "Retry Scheduled"
            : "Open",
          attempts: invoice.attempt_count || 0,
        });
      }
    }

    hasMore = response.has_more;
    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return failedPayments;
}
