import supabase from "../lib/supabaseClient";
import type { PageRequest, PageResponse } from "../lib/pagination";
import type { User } from "../lib/mock";

export async function fetchUsers({ page, pageSize, filters, sort }: PageRequest): Promise<PageResponse<User>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabase
    .from("users")
    .select("id, email, first_name, last_name, phone, stripe_customer_id, plan, upload_limit, created_at, is_active", { count: "exact" })
    .order("created_at", { ascending: false });

  // Apply filters if provided
  if (filters?.search) {
    const search = filters.search;
    // Supabase OR query format: column.ilike.value,column2.ilike.value
    q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  if (filters?.plan) {
    q = q.eq("plan", filters.plan);
  }
  if (filters?.status === "Active") {
    q = q.eq("is_active", true);
  } else if (filters?.status === "Inactive") {
    q = q.eq("is_active", false);
  }

  // Apply sort if provided
  if (sort?.field) {
    q = q.order(sort.field, { ascending: !!sort.asc });
  }

  const { data, count, error } = await q.range(from, to);

  if (error) {
    console.error("Failed to fetch users:", error.message);
    throw error;
  }

  return {
    items: (data ?? []) as User[],
    total: count ?? 0,
    page,
    pageSize,
  };
}