import { Router, raw } from "express";
import Stripe from "stripe";
import { stripe } from "../stripe.js";
import { env } from "../env.js";
import { invalidateBillingCache, invalidateFailedPaymentsCache } from "../lib/cache.js";

export const webhooksRouter = Router();

/**
 * Stripe webhook endpoint
 * Handles subscription and invoice events to invalidate cache
 * NOTE: This endpoint should be mounted BEFORE body parser middleware
 * because Stripe requires raw body for signature verification
 */
webhooksRouter.post(
  "/stripe",
  raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      console.error("Webhook Error: No signature header");
      return res.status(400).send("No signature header");
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      console.warn("Webhook Warning: STRIPE_WEBHOOK_SECRET not configured, skipping verification");
      // In development, you might want to accept webhooks without verification
      // In production, this should return an error
      return res.json({ received: true });
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    console.log(`Received webhook event: ${event.type}`);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        console.log("Subscription event received, invalidating billing cache");
        invalidateBillingCache();
        break;

      case "invoice.payment_failed":
      case "invoice.payment_succeeded":
        console.log("Invoice payment event received, invalidating failed payments cache");
        invalidateFailedPaymentsCache();
        // Also invalidate billing cache since payment success/failure might affect MRR
        invalidateBillingCache();
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return res.json({ received: true });
  }
);
