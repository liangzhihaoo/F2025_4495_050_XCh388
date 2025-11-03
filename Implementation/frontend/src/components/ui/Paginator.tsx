import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginatorProps = {
  page: number;                  // 1-based
  pageSize: number;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange?: (nextSize: number) => void;
  total?: number;                // if provided, show counts & numbers
  pageSizeOptions?: number[];    // default [10, 20, 50]
  isLoading?: boolean;
};

export default function Paginator({
  page, pageSize, onPageChange, onPageSizeChange,
  total, pageSizeOptions = [10, 20, 50], isLoading
}: PaginatorProps) {

  const pageCount = total ? Math.max(1, Math.ceil(total / pageSize)) : undefined;

  const go = (p: number) => {
    if (!pageCount) return onPageChange(Math.max(1, p));
    onPageChange(Math.min(Math.max(1, p), pageCount));
  };

  // Simple number window (first, prev, current, next, last) to avoid huge lists
  const windowPages = () => {
    if (!pageCount) return [page];
    const arr: number[] = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(pageCount, page + 1);
    for (let i = start; i <= end; i++) arr.push(i);
    return [1, ...(start > 2 ? [-1] : []), ...arr, ...(end < pageCount - 1 ? [-1] : []), pageCount]
      .filter((v, i, a) => i === 0 || v !== a[i-1]);
  };

  return (
    <nav className="mt-4 flex items-center justify-between gap-4" aria-label="Pagination">
      <div className="text-sm text-gray-500">
        {typeof total === "number" ? (
          <>Showing <span className="font-medium">{(page-1)*pageSize + 1}</span>-
          <span className="font-medium">{Math.min(page*pageSize, total)}</span> of
          <span className="font-medium"> {total}</span></>
        ) : <>Page {page}{isLoading ? " (loading…)" : ""}</>}
      </div>

      <div className="flex items-center gap-2">
        <button 
          className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          onClick={() => go(page - 1)} 
          aria-label="Previous page" 
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <ul className="flex items-center gap-1">
          {windowPages().map((p, idx) =>
            p === -1 ? (
              <li key={`gap-${idx}`} className="px-2"><MoreHorizontal className="h-4 w-4" aria-hidden="true" /></li>
            ) : (
              <li key={p}>
                <button
                  className={`px-3 py-1 rounded-xl text-sm ${p === page ? "bg-gray-900 text-white" : "hover:bg-gray-100 border border-transparent"}`}
                  onClick={() => go(p)}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              </li>
            )
          )}
        </ul>

        <button 
          className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          onClick={() => go(page + 1)} 
          aria-label="Next page"
          disabled={!!(total && pageCount && page >= pageCount)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {onPageSizeChange && (
          <select
            className="ml-2 rounded-xl border px-2 py-1"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Items per page"
          >
            {pageSizeOptions.map(opt => <option key={opt} value={opt}>{opt} / page</option>)}
          </select>
        )}
      </div>
    </nav>
  );
}
