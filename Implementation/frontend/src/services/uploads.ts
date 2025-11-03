import type { PageRequest, PageResponse } from "../lib/pagination";
import { mockUploads, type UploadItem } from "../lib/mock";

// Temporary in-memory fallback until backend supports pagination
export async function fetchUploads({ page, pageSize, filters }: PageRequest): Promise<PageResponse<UploadItem>> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  let allItems = mockUploads(100); // Generate enough items for pagination demo

  // Apply filters
  if (filters?.q) {
    const query = filters.q.toLowerCase();
    allItems = allItems.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.userEmail.toLowerCase().includes(query)
    );
  }

  if (filters?.range && filters.range !== "all") {
    const now = new Date();
    const days = filters.range === "7d" ? 7 : filters.range === "30d" ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    allItems = allItems.filter(item => new Date(item.createdAt) >= cutoffDate);
  }

  const total = allItems.length;
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const items = allItems.slice(from, to);

  return {
    items,
    total,
    page,
    pageSize,
  };
}
