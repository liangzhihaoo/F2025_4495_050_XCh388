import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  type FlaggedItem, 
  type SystemAlert, 
  type AuditRow
} from "../../lib/mock";
import { AlertsFilters } from "../../components/alerts/AlertsFilters";
import type { FiltersValue } from "../../components/alerts/AlertsFilters";
import { BulkBar } from "../../components/alerts/BulkBar";
import { FlaggedQueue } from "../../components/alerts/FlaggedQueue";
import { FlagDetailDrawer } from "../../components/alerts/FlagDetailDrawer";
import { SystemAlerts } from "../../components/alerts/SystemAlerts";
import { AuditLog } from "../../components/alerts/AuditLog";
import { ConfirmModal } from "../../components/alerts/ConfirmModal";
import type { ConfirmKind } from "../../components/alerts/ConfirmModal";
import Paginator from "../../components/ui/Paginator";
import { fetchFlaggedItems, fetchSystemAlerts, fetchAuditLog } from "../../services/alerts";
import { trackPagination } from "../../lib/posthog";

const paginationOn = import.meta.env.VITE_FEATURE_PAGINATION !== "false";

export default function Alerts() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<FiltersValue>({
    queue: (params.get("queue") as any) ?? "flagged",
    q: params.get("q") ?? "",
    severity: (params.get("severity") as any) ?? "all",
    range: (params.get("range") as any) ?? "30d",
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawer, setDrawer] = useState<{
    open: boolean;
    item: FlaggedItem | null;
  }>({
    open: false,
    item: null,
  });

  const [confirm, setConfirm] = useState<{
    open: boolean;
    kind: ConfirmKind | null;
    payload?: any;
  }>({
    open: false,
    kind: null,
    payload: undefined,
  });

  const [page, setPage] = useState(Number(params.get("page") ?? 1));
  const [pageSize, setPageSize] = useState(Number(params.get("pageSize") ?? 20));

  // Sync URL params
  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    next.set("pageSize", String(pageSize));
    if (filters.queue) next.set("queue", filters.queue);
    else next.delete("queue");
    if (filters.q) next.set("q", filters.q);
    else next.delete("q");
    if (filters.severity !== "all") next.set("severity", filters.severity);
    else next.delete("severity");
    if (filters.range !== "30d") next.set("range", filters.range);
    else next.delete("range");
    setParams(next, { replace: true });
  }, [page, pageSize, filters, params, setParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [filters.q, filters.severity, filters.queue]);

  // Fetch data based on queue type
  const flaggedQuery = useQuery({
    queryKey: ["flagged", { page, pageSize, filters }],
    queryFn: () => fetchFlaggedItems({ page, pageSize, filters }),
    placeholderData: (previousData) => previousData,
    enabled: filters.queue === "flagged",
  });

  const systemQuery = useQuery({
    queryKey: ["systemAlerts", { page, pageSize, filters }],
    queryFn: () => fetchSystemAlerts({ page, pageSize, filters }),
    placeholderData: (previousData) => previousData,
    enabled: filters.queue === "system",
  });

  const auditQuery = useQuery({
    queryKey: ["auditLog", { page, pageSize, filters }],
    queryFn: () => fetchAuditLog({ page, pageSize, filters }),
    placeholderData: (previousData) => previousData,
    enabled: filters.queue === "audit",
  });

  const filteredFlagged = flaggedQuery.data?.items ?? [];
  const flaggedTotal = flaggedQuery.data?.total ?? 0;
  const filteredSystem = systemQuery.data?.items ?? [];
  const systemTotal = systemQuery.data?.total ?? 0;
  const filteredAudit = auditQuery.data?.items ?? [];
  const auditTotal = auditQuery.data?.total ?? 0;

  const isFetching = filters.queue === "flagged" ? flaggedQuery.isFetching :
                     filters.queue === "system" ? systemQuery.isFetching :
                     auditQuery.isFetching;

  const currentTotal = filters.queue === "flagged" ? flaggedTotal :
                       filters.queue === "system" ? systemTotal :
                       auditTotal;

  const handleToggleSelect = (id: string) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleOpenDrawer = (item: FlaggedItem) => {
    setDrawer({ open: true, item });
  };

  const handleCloseDrawer = () => {
    setDrawer({ open: false, item: null });
  };

  const handleApprove = (item: FlaggedItem) => {
    setConfirm({ open: true, kind: "approve", payload: item });
  };

  const handleDelete = (item: FlaggedItem) => {
    setConfirm({ open: true, kind: "delete", payload: item });
  };

  const handleBulkApprove = () => {
    setConfirm({ open: true, kind: "bulk_approve", payload: { count: selected.size } });
  };

  const handleBulkDelete = () => {
    setConfirm({ open: true, kind: "bulk_delete", payload: { count: selected.size } });
  };

  const handleClearSelection = () => {
    setSelected(new Set());
  };

  const handleResolve = (alert: SystemAlert) => {
    setConfirm({ open: true, kind: "resolve", payload: alert });
  };

  const handleSnooze = (alert: SystemAlert) => {
    setConfirm({ open: true, kind: "snooze", payload: alert });
  };

  const handleConfirm = (kind: ConfirmKind, payload?: any) => {
    // In a real app, this would make API calls
    // For now, just close the modal
    setConfirm({ open: false, kind: null, payload: undefined });
    // Invalidate queries to refetch
  };

  const handleCancelConfirm = () => {
    setConfirm({ open: false, kind: null, payload: undefined });
  };

  return (
    <div className="space-y-6 min-h-[60vh]">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Moderation & Alerts</h1>
        <p className="text-gray-600">Manage flagged content, system alerts, and audit logs</p>
      </div>

      <AlertsFilters value={filters} onChange={setFilters} />

      {filters.queue === "flagged" && (
        <>
          <BulkBar
            count={selected.size}
            onBulkApprove={handleBulkApprove}
            onBulkDelete={handleBulkDelete}
            onClear={handleClearSelection}
          />

          <FlaggedQueue
            rows={filteredFlagged}
            selected={selected}
            onToggleSelect={handleToggleSelect}
            onOpen={handleOpenDrawer}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />

          {paginationOn && (
            <Paginator
              page={page}
              pageSize={pageSize}
              total={flaggedTotal}
              onPageChange={(p) => {
                setPage(p);
                trackPagination("flagged", "navigate", { page: p, pageSize });
              }}
              onPageSizeChange={(ps) => {
                setPage(1);
                setPageSize(ps);
                trackPagination("flagged", "change_page_size", { pageSize: ps });
              }}
              isLoading={isFetching}
            />
          )}

          <FlagDetailDrawer
            item={drawer.item}
            open={drawer.open}
            onClose={handleCloseDrawer}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        </>
      )}

      {filters.queue === "system" && (
        <>
          <SystemAlerts
            rows={filteredSystem}
            onResolve={handleResolve}
            onSnooze={handleSnooze}
          />
          {paginationOn && (
            <Paginator
              page={page}
              pageSize={pageSize}
              total={systemTotal}
              onPageChange={(p) => {
                setPage(p);
                trackPagination("systemAlerts", "navigate", { page: p, pageSize });
              }}
              onPageSizeChange={(ps) => {
                setPage(1);
                setPageSize(ps);
                trackPagination("systemAlerts", "change_page_size", { pageSize: ps });
              }}
              isLoading={isFetching}
            />
          )}
        </>
      )}

      {filters.queue === "audit" && (
        <>
          <AuditLog rows={filteredAudit} />
          {paginationOn && (
            <Paginator
              page={page}
              pageSize={pageSize}
              total={auditTotal}
              onPageChange={(p) => {
                setPage(p);
                trackPagination("auditLog", "navigate", { page: p, pageSize });
              }}
              onPageSizeChange={(ps) => {
                setPage(1);
                setPageSize(ps);
                trackPagination("auditLog", "change_page_size", { pageSize: ps });
              }}
              isLoading={isFetching}
            />
          )}
        </>
      )}

      <ConfirmModal
        open={confirm.open}
        kind={confirm.kind}
        payload={confirm.payload}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirm}
      />
    </div>
  );
}