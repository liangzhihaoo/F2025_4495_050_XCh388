import type { PageRequest, PageResponse } from "../lib/pagination";
import type { Testimonial } from "../lib/mock";
import supabase from "../lib/supabaseClient";

/**
 * Upload avatar image to Supabase Storage and return public URL
 */
async function uploadAvatar(file: File): Promise<string> {
  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;
  const filePath = fileName;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Avatar upload error:", error);
    throw new Error(`Failed to upload avatar: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete avatar from Supabase Storage
 */
async function deleteAvatar(avatarUrl: string): Promise<void> {
  try {
    // Extract the file path from the URL
    const url = new URL(avatarUrl);
    const pathParts = url.pathname.split("/avatars/");
    if (pathParts.length < 2) return;

    const filePath = pathParts[1];

    const { error } = await supabase.storage.from("avatars").remove([filePath]);

    if (error) {
      console.error("Avatar deletion error:", error);
      // Don't throw, just log - avatar deletion is not critical
    }
  } catch (err) {
    console.error("Error parsing avatar URL:", err);
  }
}

/**
 * Fetch testimonials with pagination and filters
 */
export async function fetchTestimonials({
  page,
  pageSize,
  filters,
}: PageRequest): Promise<PageResponse<Testimonial>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("testimonials")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  // Apply filters
  if (filters?.q) {
    const searchQuery = `%${filters.q}%`;
    query = query.or(
      `author_name.ilike.${searchQuery},company.ilike.${searchQuery},quote.ilike.${searchQuery}`
    );
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (filters?.source && filters.source !== "all") {
    query = query.eq("source", filters.source);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Fetch testimonials error:", error);
    throw new Error(`Failed to fetch testimonials: ${error.message}`);
  }

  return {
    items: (data || []) as Testimonial[],
    total: count || 0,
    page,
    pageSize,
  };
}

/**
 * Create a new testimonial
 */
export async function createTestimonial(
  values: Omit<Testimonial, "id" | "created_at" | "avatar_url">,
  avatarFile: File | null
): Promise<Testimonial> {
  let avatar_url: string | null = null;

  // Upload avatar if provided
  if (avatarFile) {
    avatar_url = await uploadAvatar(avatarFile);
  }

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      ...values,
      avatar_url,
    })
    .select()
    .single();

  if (error) {
    // Clean up uploaded avatar if testimonial creation fails
    if (avatar_url) {
      await deleteAvatar(avatar_url);
    }
    console.error("Create testimonial error:", error);
    throw new Error(`Failed to create testimonial: ${error.message}`);
  }

  return data as Testimonial;
}

/**
 * Update an existing testimonial
 */
export async function updateTestimonial(
  id: number,
  values: Omit<Testimonial, "id" | "created_at" | "avatar_url">,
  avatarFile: File | null,
  currentAvatarUrl: string | null
): Promise<Testimonial> {
  let avatar_url: string | null = currentAvatarUrl;

  // Handle avatar changes
  if (avatarFile) {
    // Upload new avatar
    avatar_url = await uploadAvatar(avatarFile);

    // Delete old avatar if it exists
    if (currentAvatarUrl) {
      await deleteAvatar(currentAvatarUrl);
    }
  }

  const { data, error } = await supabase
    .from("testimonials")
    .update({
      ...values,
      avatar_url,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    // Clean up uploaded avatar if update fails
    if (avatarFile && avatar_url && avatar_url !== currentAvatarUrl) {
      await deleteAvatar(avatar_url);
    }
    console.error("Update testimonial error:", error);
    throw new Error(`Failed to update testimonial: ${error.message}`);
  }

  return data as Testimonial;
}

/**
 * Delete a testimonial
 */
export async function deleteTestimonial(
  id: number,
  avatarUrl: string | null
): Promise<void> {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    console.error("Delete testimonial error:", error);
    throw new Error(`Failed to delete testimonial: ${error.message}`);
  }

  // Delete avatar from storage
  if (avatarUrl) {
    await deleteAvatar(avatarUrl);
  }
}

/**
 * Toggle featured status of a testimonial
 */
export async function toggleFeatured(
  id: number,
  currentStatus: boolean
): Promise<Testimonial> {
  const { data, error } = await supabase
    .from("testimonials")
    .update({ is_featured: !currentStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Toggle featured error:", error);
    throw new Error(`Failed to toggle featured status: ${error.message}`);
  }

  return data as Testimonial;
}
