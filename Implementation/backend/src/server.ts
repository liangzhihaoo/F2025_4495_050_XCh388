import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { adminAuth } from "./middleware/adminAuth.js";
import { adminRouter } from "./routes/admin.js";
import { webhooksRouter } from "./routes/webhooks.js";

const app = express();
app.use(cors());

// IMPORTANT: Mount webhooks BEFORE body parser
// Stripe webhooks need raw body for signature verification
app.use("/webhooks", webhooksRouter);

// Body parser for other routes
app.use(express.json());

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Protect all admin routes with a single shared secret (MVP)
app.use("/admin", adminAuth, adminRouter);

app.listen(env.PORT, () => {
  console.log(`Gluu Admin API listening on http://localhost:${env.PORT}`);
});
