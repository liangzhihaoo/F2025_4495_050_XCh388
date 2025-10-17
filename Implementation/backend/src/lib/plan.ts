// Centralize plan constants to avoid magic strings.
import { env } from "../env.js";

export const PLANS = {
  FREE: "free",
  PLUS: "client_plus",
} as const;

export function uploadLimitFor(plan: "free" | "client_plus") {
  return plan === PLANS.PLUS
    ? env.PLAN_PLUS_UPLOAD_LIMIT
    : env.PLAN_FREE_UPLOAD_LIMIT;
}
