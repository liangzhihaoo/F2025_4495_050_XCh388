// Minimal Supabase helpers for users/products/auth admin ops.
import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

// Data-layer helpers
export async function getAppUser(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw new Error(`Supabase getAppUser failed: ${error.message}`);
  return data;
}

export async function updateUserPlanAndLimit(
  userId: string,
  plan: "Free" | "Client Plus",
  uploadLimit: number,
  stripeCustomerId?: string | null
) {
  const patch: any = { plan, upload_limit: uploadLimit };
  if (stripeCustomerId) patch.stripe_customer_id = stripeCustomerId;

  const { error } = await supabase.from("users").update(patch).eq("id", userId);
  if (error)
    throw new Error(`Supabase updateUserPlan failed: ${error.message}`);
}

export async function banUser(userId: string, untilISO: string) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    banned_until: untilISO,
  } as any);
  if (error) throw new Error(`Supabase banUser failed: ${error.message}`);
}

export async function unbanUser(userId: string) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    banned_until: null,
  } as any);
  if (error) throw new Error(`Supabase unbanUser failed: ${error.message}`);
}

export async function deleteAuthUser(userId: string) {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error)
    throw new Error(`Supabase deleteAuthUser failed: ${error.message}`);
}

export async function deleteUserRow(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId);
  if (error) throw new Error(`Supabase deleteUserRow failed: ${error.message}`);
}

export async function deleteUserProducts(userId: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("user_id", userId);
  if (error)
    throw new Error(`Supabase deleteUserProducts failed: ${error.message}`);
}

export async function updateUserActiveStatus(userId: string, isActive: boolean) {
  const { error } = await supabase
    .from("users")
    .update({ is_active: isActive })
    .eq("id", userId);
  if (error)
    throw new Error(`Supabase updateUserActiveStatus failed: ${error.message}`);
}
