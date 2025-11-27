/**
 * Billing KPIs (Key Performance Indicators) for the admin dashboard
 */
export type BillingKpis = {
  mrr: number;              // Monthly Recurring Revenue in USD
  arr: number;              // Annual Recurring Revenue (MRR * 12)
  activeSubscribers: number; // Count of paying subscriptions
  arpu: number;             // Average Revenue Per User
  churnRate30d: number;     // 30-day churn rate (decimal, e.g., 0.025 = 2.5%)
};

/**
 * Plan type matching the frontend Plan enum
 */
export type Plan = "Free" | "Client Plus" | "Enterprise";

/**
 * Plan distribution bucket showing subscribers and MRR per plan
 */
export type PlanBucket = {
  plan: Plan;
  subscribers: number;
  mrr: number;
};

/**
 * Failed payment status
 */
export type FailedPaymentStatus = "Open" | "Retry Scheduled" | "Resolved" | "Canceled";

/**
 * Failed payment record
 */
export type FailedPayment = {
  id: string;              // Invoice or Payment Intent ID
  userEmail: string;       // Customer email
  plan: Plan;             // Subscription plan
  amount: number;         // Amount in USD (converted from cents)
  reason: string;         // Failure reason (e.g., "Card declined")
  attemptedAt: string;    // ISO timestamp of last attempt
  nextRetryAt?: string;   // ISO timestamp of next retry (if scheduled)
  status: FailedPaymentStatus;
  attempts: number;       // Number of payment attempts
};

/**
 * Stripe webhook event types we handle
 */
export type StripeWebhookEvent =
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.payment_failed"
  | "invoice.payment_succeeded";
