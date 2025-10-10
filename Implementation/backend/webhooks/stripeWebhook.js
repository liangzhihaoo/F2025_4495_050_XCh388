import { stripe } from '../config/stripe.js';
import { supabaseAdmin } from '../config/supabase.js';

// Upsert subscription data into Supabase based on Stripe subscription object
async function upsertBillingFromSubscription({ userId, customerId, subscription }) {
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.id || null;

  const payload = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_subscription_status: subscription.status,
    price_id: priceId,
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (userId) payload.user_id = userId;

  const { error } = await supabaseAdmin
    .from('user_billing')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) console.error('Supabase upsert error', error);
}

export default async function stripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session?.metadata?.userId || session?.subscription_metadata?.userId || null;
        const customerId = session.customer;

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await upsertBillingFromSubscription({ userId, customerId, subscription });
        } else if (session.mode === 'payment') {
          await supabaseAdmin
            .from('user_billing')
            .upsert(
              {
                user_id: userId || null,
                stripe_customer_id: customerId,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' }
            );
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer?.metadata?.userId || null;

        await upsertBillingFromSubscription({ userId, customerId, subscription });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.warn('Payment failed for customer', invoice.customer);
        break;
      }

      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error', err);
    res.status(500).send('Webhook handler failed');
  }
}
