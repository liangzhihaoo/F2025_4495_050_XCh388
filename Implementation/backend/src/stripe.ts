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
