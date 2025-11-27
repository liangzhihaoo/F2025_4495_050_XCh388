import type { PageRequest, PageResponse } from "../lib/pagination";
import { mockQuotaList, type UserQuotaRow } from "../lib/mock";

// Temporary in-memory fallback until backend supports pagination
export async function fetchQuotaList({ page, pageSize, filters }: PageRequest): Promise<PageResponse<UserQuotaRow>> {
  await new Promise(resolve => setTimeout(resolve, 100));

  let allItems = mockQuotaList(100);

  if (filters?.plan && filters.plan !== "all") {
    allItems = allItems.filter(item => item.plan === filters.plan);
  }

  if (filters?.q) {
    const query = filters.q.toLowerCase();
    allItems = allItems.filter(item => item.email.toLowerCase().includes(query));
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
