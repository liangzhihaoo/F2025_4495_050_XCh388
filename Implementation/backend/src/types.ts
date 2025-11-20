export type Plan = "Free" | "Client Plus";

export interface UsersRow {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  plan: Plan;
  upload_limit: number;
  is_active: boolean;
}
