import type { PageRequest, PageResponse } from "../lib/pagination";
import { mockTestimonials, type Testimonial } from "../lib/mock";

// Temporary in-memory fallback until backend supports pagination
export async function fetchTestimonials({ page, pageSize, filters }: PageRequest): Promise<PageResponse<Testimonial>> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  let allItems = mockTestimonials();

  // Apply filters
  if (filters?.q) {
    const query = filters.q.toLowerCase();
    allItems = allItems.filter(item =>
      item.authorName.toLowerCase().includes(query) ||
      item.company?.toLowerCase().includes(query) ||
      item.quote.toLowerCase().includes(query)
    );
  }

  if (filters?.status && filters.status !== "all") {
    allItems = allItems.filter(item => item.status === filters.status);
  }

  if (filters?.featuredOnly) {
    allItems = allItems.filter(item => item.featured);
  }

  if (filters?.source && filters.source !== "all") {
    allItems = allItems.filter(item => item.source === filters.source);
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
