import type { PageRequest, PageResponse } from "../lib/pagination";
import { mockFailedPayments, type FailedPayment } from "../lib/mock";

// Temporary in-memory fallback until backend supports pagination
export async function fetchFailedPayments({ page, pageSize, filters }: PageRequest): Promise<PageResponse<FailedPayment>> {
  await new Promise(resolve => setTimeout(resolve, 100));

  let allItems = mockFailedPayments(100); // Generate enough items for pagination demo

  // Apply filters
  if (filters?.plan && filters.plan !== "all") {
    allItems = allItems.filter(item => item.plan === filters.plan);
  }

  if (filters?.status && filters.status !== "all") {
    allItems = allItems.filter(item => item.status === filters.status);
  }

  if (filters?.q) {
    const query = filters.q.toLowerCase();
    allItems = allItems.filter(item => item.userEmail.toLowerCase().includes(query));
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
