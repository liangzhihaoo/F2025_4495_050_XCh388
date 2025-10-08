import { useState, useMemo } from "react";
import { 
  mockBillingKpis, 
  mockPlanBuckets, 
  mockFailedPayments
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

export default function Billing() {
  // Local state
  const [filters, setFilters] = useState<FiltersValue>({
    range: "30d",
    plan: "all",
    status: "all",
    q: "",
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

  // Mock data
  const kpis = useMemo(() => mockBillingKpis(), []);
  const buckets = useMemo(() => mockPlanBuckets(), []);
  const [failures, setFailures] = useState<FailedPayment[]>(() => mockFailedPayments(24));

  // Derived: filtered failures
  const filteredFailures = useMemo(() => {
    return failures.filter((failure) => {
      // Plan filter
      if (filters.plan !== "all" && failure.plan !== filters.plan) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && failure.status !== filters.status) {
        return false;
      }

      // Search filter
      if (filters.q && !failure.userEmail.toLowerCase().includes(filters.q.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [failures, filters]);

  // Handlers
  const handleAction = (action: ActionKind, row: FailedPayment) => {
    setConfirm({ open: true, action, row });
  };

  const handleConfirm = (row: FailedPayment, action: ActionKind) => {
    setFailures(prevFailures => 
      prevFailures.map(failure => {
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
      })
    );
  };

  const handleCancelConfirm = () => {
    setConfirm({ open: false, action: null, row: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing Analytics</h1>
        <p className="text-gray-600">Monitor subscription KPIs, plan distribution, and failed payments</p>
      </div>

      {/* Filters */}
      <BillingFilters value={filters} onChange={setFilters} />

      {/* KPIs */}
      <BillingKPIs kpis={kpis} />

      {/* Plan Distribution */}
      <PlanDistributionPie buckets={buckets} />

      {/* Failed Payments Table */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Failed Payments Queue</h2>
          <p className="text-sm text-gray-600">
            {filteredFailures.length} of {failures.length} failed payments
          </p>
        </div>
        <FailuresTable
          items={filteredFailures}
          onRetry={(row) => handleAction("retry", row)}
          onCancel={(row) => handleAction("cancel", row)}
          onResolve={(row) => handleAction("resolve", row)}
        />
      </div>

      {/* Confirm Modal */}
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