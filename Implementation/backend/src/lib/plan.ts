// Centralize plan constants to avoid magic strings.
import { env } from "../env.js";

export const PLANS = {
  FREE: "Free",
  PLUS: "Client Plus",
} as const;

export function uploadLimitFor(plan: "Free" | "Client Plus") {
  return plan === PLANS.PLUS
    ? env.PLAN_PLUS_UPLOAD_LIMIT
    : env.PLAN_FREE_UPLOAD_LIMIT;
}
