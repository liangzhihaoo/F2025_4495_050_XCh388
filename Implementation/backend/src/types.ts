export type Plan = "free" | "client_plus";

export interface UsersRow {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  plan: Plan;
  upload_limit: number;
}
