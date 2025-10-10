import { stripe } from '../config/stripe.js';
import { supabaseAdmin } from '../config/supabase.js';

const ALLOWED_PRICE_IDS = (process.env.STRIPE_ALLOWED_PRICE_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Find or create a Stripe customer for a given userId or email
async function getOrCreateCustomer({ userId, email }) {
  if (!userId && !email) {
    throw new Error('userId or email required');
  }

  // Check if customer exists in Supabase
  let stripeCustomerId = null;
  if (userId) {
    const { data, error } = await supabaseAdmin
      .from('user_billing')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (data?.stripe_customer_id) stripeCustomerId = data.stripe_customer_id;
  }

  // If not found, create a new customer on Stripe
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: email || undefined,
      metadata: { userId: userId || '' },
    });
    stripeCustomerId = customer.id;

    // Upsert customer into Supabase
    const { error: upsertErr } = await supabaseAdmin
      .from('user_billing')
      .upsert(
        {
          user_id: userId || null,
          stripe_customer_id: stripeCustomerId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (upsertErr) throw upsertErr;
  }

  return stripeCustomerId;
}

// GET /api/stripe/config
export async function getStripeConfig(req, res) {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    allowedPriceIds: ALLOWED_PRICE_IDS,
  });
}

// POST /api/stripe/checkout
export async function createCheckoutSession(req, res) {
  try {
    const {
      userId,
      email,
      priceId,
      mode = 'subscription',
      successPath = '/billing/success',
      cancelPath = '/billing/cancel',
    } = req.body;

    if (!priceId) return res.status(400).json({ error: 'priceId required' });
    if (ALLOWED_PRICE_IDS.length && !ALLOWED_PRICE_IDS.includes(priceId)) {
      return res.status(400).json({ error: 'priceId not allowed' });
    }

    const customerId = await getOrCreateCustomer({ userId, email });

    const successUrl = `${process.env.FRONTEND_URL}${successPath}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL}${cancelPath}`;

    const session = await stripe.checkout.sessions.create({
      mode,
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: userId || '' },
      ...(mode === 'subscription'
        ? { subscription_data: { metadata: { userId: userId || '' } } }
        : {}),
      automatic_tax: { enabled: true },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('createCheckoutSession error', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

// POST /api/stripe/portal
export async function createPortalSession(req, res) {
  try {
    const { userId, returnPath = '/billing/portal-return' } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data, error } = await supabaseAdmin
      .from('user_billing')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (error || !data?.stripe_customer_id) {
      return res.status(404).json({ error: 'Stripe customer not found for user' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}${returnPath}`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('createPortalSession error', err);
    return res.status(500).json({ error: 'Failed to create portal session' });
  }
}
