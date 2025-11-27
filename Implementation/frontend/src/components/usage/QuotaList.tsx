import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { UserQuotaRow } from "../../lib/mock";
import { formatNum, formatDate } from "../../lib/format";
import Paginator from "../ui/Paginator";
import { fetchQuotaList } from "../../services/quota";
import { trackPagination } from "../../lib/posthog";

const paginationOn = import.meta.env.VITE_FEATURE_PAGINATION !== "false";

type Props = {
  filters?: { plan?: string; q?: string };
};

export function QuotaList({ filters }: Props) {
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(Number(params.get("quotaPage") ?? 1));
  const [pageSize, setPageSize] = useState(Number(params.get("quotaPageSize") ?? 10));

  // Sync URL params (using unique keys to avoid conflicts)
  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("quotaPage", String(page));
    next.set("quotaPageSize", String(pageSize));
    setParams(next, { replace: true });
  }, [page, pageSize, params, setParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [filters?.plan, filters?.q]);

  // Fetch quota list with React Query
  const { data, isFetching } = useQuery({
    queryKey: ["quotaList", { page, pageSize, filters }],
    queryFn: () => fetchQuotaList({ page, pageSize, filters }),
    placeholderData: (previousData) => previousData,
  });

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <p className="text-gray-500">No users near quota.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-fixed w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Plan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Uploads
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Quota
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Usage %
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, index) => {
              const isOverQuota = row.pct > 1;
              const rowClass = isOverQuota ? "bg-red-50" : index % 2 === 0 ? "bg-white" : "bg-gray-50";
              
              return (
                <tr key={row.id} className={rowClass}>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {row.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {row.plan}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatNum(row.uploadsThisPeriod)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatNum(row.quota)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 h-2 rounded">
                        <div 
                          className={`h-2 rounded ${isOverQuota ? 'bg-red-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min(100, row.pct * 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${isOverQuota ? 'text-red-700' : 'text-gray-700'}`}>
                        {(row.pct * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatDate(row.lastActive)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {paginationOn && (
        <Paginator
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={(p) => {
            setPage(p);
            trackPagination("quotaList", "navigate", { page: p, pageSize });
          }}
          onPageSizeChange={(ps) => {
            setPage(1);
            setPageSize(ps);
            trackPagination("quotaList", "change_page_size", { pageSize: ps });
          }}
          isLoading={isFetching}
        />
      )}
    </div>
  );
}