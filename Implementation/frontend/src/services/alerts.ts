import type { PageRequest, PageResponse } from "../lib/pagination";
import { mockFlagged, mockSystemAlerts, mockAuditLog, type FlaggedItem, type SystemAlert, type AuditRow } from "../lib/mock";

// Temporary in-memory fallback until backend supports pagination
export async function fetchFlaggedItems({ page, pageSize, filters }: PageRequest): Promise<PageResponse<FlaggedItem>> {
  await new Promise(resolve => setTimeout(resolve, 100));

  let allItems = mockFlagged();

  if (filters?.q) {
    const query = filters.q.toLowerCase();
    allItems = allItems.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.userEmail.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );
  }

  if (filters?.severity && filters.severity !== "all") {
    allItems = allItems.filter(item => item.severity === filters.severity);
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

export async function fetchSystemAlerts({ page, pageSize, filters }: PageRequest): Promise<PageResponse<SystemAlert>> {
  await new Promise(resolve => setTimeout(resolve, 100));

  let allItems = mockSystemAlerts();

  if (filters?.q) {
    const query = filters.q.toLowerCase();
    allItems = allItems.filter(item =>
      item.message.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      (item.userEmail?.toLowerCase().includes(query) ?? false)
    );
  }

  if (filters?.severity && filters.severity !== "all") {
    allItems = allItems.filter(item => item.severity === filters.severity);
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

export async function fetchAuditLog({ page, pageSize, filters }: PageRequest): Promise<PageResponse<AuditRow>> {
  await new Promise(resolve => setTimeout(resolve, 100));

  let allItems = mockAuditLog();

  if (filters?.q) {
    const query = filters.q.toLowerCase();
    allItems = allItems.filter(item =>
      item.actor.toLowerCase().includes(query) ||
      item.action.toLowerCase().includes(query) ||
      item.targetId.toLowerCase().includes(query)
    );
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
