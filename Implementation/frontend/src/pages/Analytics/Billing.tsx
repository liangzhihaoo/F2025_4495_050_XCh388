import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  mockBillingKpis, 
  mockPlanBuckets, 
} from "../../lib/mock";
import type { 
  FailedPayment, 
  FailedPaymentStatus
} from "../../lib/mock";
import { BillingFilters } from "../../components/billing/BillingFilters";
import type { FiltersValue } from "../../components/billing/BillingFilters";
import { BillingKPIs } from "../../components/billing/BillingKPIs";
import { PlanDistributionPie } from "../../components/billing/PlanDistributionPie";
import { FailuresTable } from "../../components/billing/FailuresTable";
import { ActionConfirmModal } from "../../components/billing/ActionConfirmModal";
import type { ActionKind } from "../../components/billing/ActionConfirmModal";
import Paginator from "../../components/ui/Paginator";
import { fetchFailedPayments } from "../../services/billing";
import { trackPagination } from "../../lib/posthog";

const paginationOn = import.meta.env.VITE_FEATURE_PAGINATION !== "false";

export default function Billing() {
  const [params, setParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FiltersValue>({
    range: (params.get("range") as any) ?? "30d",
    plan: (params.get("plan") as any) ?? "all",
    status: (params.get("status") as any) ?? "all",
    q: params.get("q") ?? "",
  });

  const [confirm, setConfirm] = useState<{
    open: boolean;
    action: ActionKind | null;
    row: FailedPayment | null;
  }>({
    open: false,
    action: null,
    row: null,
  });

  const [page, setPage] = useState(Number(params.get("page") ?? 1));
  const [pageSize, setPageSize] = useState(Number(params.get("pageSize") ?? 20));

  // Sync URL params
  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    next.set("pageSize", String(pageSize));
    if (filters.range !== "30d") next.set("range", filters.range);
    else next.delete("range");
    if (filters.plan !== "all") next.set("plan", filters.plan);
    else next.delete("plan");
    if (filters.status !== "all") next.set("status", filters.status);
    else next.delete("status");
    if (filters.q) next.set("q", filters.q);
    else next.delete("q");
    setParams(next, { replace: true });
  }, [page, pageSize, filters, params, setParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [filters.plan, filters.status, filters.q]);

  // Fetch failed payments with React Query
  const { data, isFetching } = useQuery({
    queryKey: ["failedPayments", { page, pageSize, filters }],
    queryFn: () => fetchFailedPayments({ page, pageSize, filters }),
    placeholderData: (previousData) => previousData,
  });

  const failures = data?.items ?? [];
  const total = data?.total ?? 0;

  // Mock data for KPIs and charts (these don't need pagination)
  const kpis = mockBillingKpis();
  const buckets = mockPlanBuckets();

  // Handlers
  const handleAction = (action: ActionKind, row: FailedPayment) => {
    setConfirm({ open: true, action, row });
  };

  const handleConfirm = (row: FailedPayment, action: ActionKind) => {
    // Optimistically update the cache
    queryClient.setQueryData(["failedPayments", { page, pageSize, filters }], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((failure: FailedPayment) => {
          if (failure.id === row.id) {
            switch (action) {
              case "retry":
                return {
                  ...failure,
                  status: "Retry Scheduled" as FailedPaymentStatus,
                  nextRetryAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                  attempts: failure.attempts + 1,
                };
              case "resolve":
                return {
                  ...failure,
                  status: "Resolved" as FailedPaymentStatus,
                  nextRetryAt: undefined,
                };
              case "cancel":
                return {
                  ...failure,
                  status: "Canceled" as FailedPaymentStatus,
                  nextRetryAt: undefined,
                };
              default:
                return failure;
            }
          }
          return failure;
        }),
      };
    });
    setConfirm({ open: false, action: null, row: null });
  };

  const handleCancelConfirm = () => {
    setConfirm({ open: false, action: null, row: null });
  };

  return (
    <div className="space-y-6 min-h-[60vh]">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing Analytics</h1>
        <p className="text-gray-600">Monitor subscription KPIs, plan distribution, and failed payments</p>
      </div>

      <BillingFilters value={filters} onChange={setFilters} />

      <BillingKPIs kpis={kpis} />

      <PlanDistributionPie buckets={buckets} />

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Failed Payments Queue</h2>
          <p className="text-sm text-gray-600">
            {total} failed payment{total !== 1 ? 's' : ''}
          </p>
        </div>
        <FailuresTable
          items={failures}
          onRetry={(row) => handleAction("retry", row)}
          onCancel={(row) => handleAction("cancel", row)}
          onResolve={(row) => handleAction("resolve", row)}
        />
        {paginationOn && (
          <Paginator
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={(p) => {
              setPage(p);
              trackPagination("failedPayments", "navigate", { page: p, pageSize });
            }}
            onPageSizeChange={(ps) => {
              setPage(1);
              setPageSize(ps);
              trackPagination("failedPayments", "change_page_size", { pageSize: ps });
            }}
            isLoading={isFetching}
          />
        )}
      </div>

      <ActionConfirmModal
        open={confirm.open}
        action={confirm.action}
        row={confirm.row}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirm}
      />
    </div>
  );
}