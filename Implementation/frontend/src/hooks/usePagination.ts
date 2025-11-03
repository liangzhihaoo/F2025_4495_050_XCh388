import { useMemo } from "react";

export type PaginationState = {
  page: number;       // 1-based
  pageSize: number;   // e.g., 10, 20, 50
  total?: number;     // optional if unknown
};

export function usePagination({ page, pageSize, total }: PaginationState) {
  const pageCount = useMemo(() => {
    if (!total || total < 0) return undefined;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  return { pageCount, offset };
}
