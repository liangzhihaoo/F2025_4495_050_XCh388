import supabase from "../lib/supabaseClient";
import type { PageRequest, PageResponse } from "../lib/pagination";
import type { UploadItem } from "../lib/mock";

export async function fetchUploads({
  page,
  pageSize,
  filters,
}: PageRequest): Promise<PageResponse<UploadItem>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Query products table, join with users to get uploader name
  let q = supabase
    .from("products")
    .select(
      `
      id, user_id, brand, type, price, images, created_at,
      users(first_name, last_name)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  // Apply search filter (brand, type)
  if (filters?.q) {
    q = q.or(`brand.ilike.%${filters.q}%,type.ilike.%${filters.q}%`);
  }

  // Apply date range filter
  if (filters?.range && filters.range !== "all") {
    const days = filters.range === "7d" ? 7 : filters.range === "30d" ? 30 : 90;
    const cutoff = new Date(Date.now() - days * 86400000).toISOString();
    q = q.gte("created_at", cutoff);
  }

  const { data, count, error } = await q.range(from, to);

  if (error) {
    console.error("Failed to fetch uploads:", error.message);
    throw error;
  }

  // Transform to include uploaderName from joined users table
  const items: UploadItem[] = (data ?? []).map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    brand: row.brand,
    type: row.type,
    price: row.price,
    images: row.images ?? [],
    created_at: row.created_at,
    uploaderName:
      `${row.users?.first_name || ""} ${row.users?.last_name || ""}`.trim() ||
      undefined,
  }));

  return {
    items,
    total: count ?? 0,
    page,
    pageSize,
  };
}
