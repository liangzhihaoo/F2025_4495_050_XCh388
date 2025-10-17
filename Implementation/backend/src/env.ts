// All env parsing in one place to fail fast at boot.
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4001),
  ADMIN_API_KEY: z.string().min(8),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  STRIPE_SECRET_KEY: z.string().min(10),
  STRIPE_PRICE_CLIENT_PLUS: z.string().min(5),
  PLAN_FREE_UPLOAD_LIMIT: z.coerce.number().default(10),
  PLAN_PLUS_UPLOAD_LIMIT: z.coerce.number().default(200),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export const env: AppEnv = EnvSchema.parse({
  PORT: process.env.PORT,
  ADMIN_API_KEY: process.env.ADMIN_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PRICE_CLIENT_PLUS: process.env.STRIPE_PRICE_CLIENT_PLUS,
  PLAN_FREE_UPLOAD_LIMIT: process.env.PLAN_FREE_UPLOAD_LIMIT,
  PLAN_PLUS_UPLOAD_LIMIT: process.env.PLAN_PLUS_UPLOAD_LIMIT,
});
