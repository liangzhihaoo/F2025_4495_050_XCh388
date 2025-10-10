import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import stripeWebhook from './src/webhooks/stripeWebhook.js';
import stripeRouter from './src/routes/stripe.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// 1) Webhook must use raw body and be registered before express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// 2) Use JSON parser and other middleware after webhook
app.use(express.json());
app.use(
  cors({
    origin: (process.env.CLIENT_URL || '').split(',').filter(Boolean).length
      ? process.env.CLIENT_URL.split(',').map((s) => s.trim())
      : ['http://localhost:5173'],
    credentials: true,
  })
);

// 3) Stripe routes
app.use('/api/stripe', stripeRouter);

// 4) Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Server started at http://localhost:' + PORT);
});
