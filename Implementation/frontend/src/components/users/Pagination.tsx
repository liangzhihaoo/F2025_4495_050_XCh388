import React from "react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (next: number) => void;
  className?: string;
};

/**
 * Minimal, generic Pagination component.
 * - Renders: "‹ Previous" | [1, 2, ... with ellipsis] | "Next ›"
 * - Keeps styling simple; no external deps; no pageSize selector.
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: Props) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // Build page items with ellipsis (e.g., [1, '…', 5, 6, 7, '…', total])
  const items: Array<number | "…"> = React.useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const windowSize = 1; // neighbors around current page
    const out: Array<number | "…"> = [];
    const push = (v: number | "…") => {
      if (out[out.length - 1] !== v) out.push(v);
    };
    push(1);
    if (page - windowSize > 2) push("…");
    const from = Math.max(2, page - windowSize);
    const to = Math.min(totalPages - 1, page + windowSize);
    for (let i = from; i <= to; i++) push(i);
    if (page + windowSize < totalPages - 1) push("…");
    push(totalPages);
    return out;
  }, [page, totalPages]);

  return (
    <nav
      className={["flex items-center gap-2", className || ""].join(" ")}
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        className="px-2 py-1 text-sm text-gray-700 hover:underline disabled:text-gray-300 disabled:no-underline"
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
      >
        ‹ Previous
      </button>

      {/* Numbered pages */}
      {items.map((it, idx) =>
        it === "…" ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-1 text-sm text-gray-500 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={it}
            onClick={() => onPageChange(it)}
            aria-current={it === page ? "page" : undefined}
            className={[
              "min-w-8 h-8 px-2 text-sm rounded-md border transition-colors tabular-nums",
              it === page
                ? "border-gray-900 text-gray-900 bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
                : "border-transparent text-gray-700 hover:border-gray-300 hover:bg-gray-50",
            ].join(" ")}
          >
            {it}
          </button>
        )
      )}

      {/* Next */}
      <button
        className="px-2 py-1 text-sm text-gray-700 hover:underline disabled:text-gray-300 disabled:no-underline"
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
      >
        Next ›
      </button>
    </nav>
  );
}
