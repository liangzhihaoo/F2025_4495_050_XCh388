import { useState, useMemo } from "react";
import { 
  mockFlagged, 
  mockSystemAlerts, 
  mockAuditLog
} from "../../lib/mock";
import type { 
  FlaggedItem, 
  SystemAlert, 
  AuditRow
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

export default function Alerts() {
  // Local state
  const [filters, setFilters] = useState<FiltersValue>({
    queue: "flagged",
    q: "",
    severity: "all",
    range: "30d",
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

  // Mock data
  const [flagged, setFlagged] = useState<FlaggedItem[]>(() => mockFlagged());
  const [system, setSystem] = useState<SystemAlert[]>(() => mockSystemAlerts());
  const [audit, setAudit] = useState<AuditRow[]>(() => mockAuditLog());

  // Derived: filtered data
  const filteredFlagged = useMemo(() => {
    return flagged.filter((item) => {
      // Search filter
      if (filters.q && !item.title.toLowerCase().includes(filters.q.toLowerCase()) && 
          !item.userEmail.toLowerCase().includes(filters.q.toLowerCase()) &&
          !item.id.toLowerCase().includes(filters.q.toLowerCase())) {
        return false;
      }

      // Severity filter
      if (filters.severity !== "all" && item.severity !== filters.severity) {
        return false;
      }

      return true;
    });
  }, [flagged, filters.q, filters.severity]);

  const filteredSystem = useMemo(() => {
    return system.filter((alert) => {
      // Search filter
      if (filters.q && !alert.message.toLowerCase().includes(filters.q.toLowerCase()) &&
          !alert.id.toLowerCase().includes(filters.q.toLowerCase()) &&
          !(alert.userEmail?.toLowerCase().includes(filters.q.toLowerCase()) ?? false)) {
        return false;
      }

      // Severity filter
      if (filters.severity !== "all" && alert.severity !== filters.severity) {
        return false;
      }

      return true;
    });
  }, [system, filters.q, filters.severity]);

  const filteredAudit = useMemo(() => {
    return audit.filter((row) => {
      // Search filter
      if (filters.q && !row.actor.toLowerCase().includes(filters.q.toLowerCase()) &&
          !row.action.toLowerCase().includes(filters.q.toLowerCase()) &&
          !row.targetId.toLowerCase().includes(filters.q.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [audit, filters.q]);

  // Handlers
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
    const now = new Date().toISOString();
    const actor = "admin@gluu.demo"; // In real app, this would be the current user

    switch (kind) {
      case "approve":
        if (payload) {
          setFlagged(prev => prev.map(item => 
            item.id === payload.id ? { ...item, status: "approved" as const } : item
          ));
          setAudit(prev => [...prev, {
            id: `log-${Date.now()}`,
            ts: now,
            actor,
            action: "approve",
            targetType: "flag",
            targetId: payload.id,
            meta: { reason: "manual_approval" }
          }]);
        }
        break;

      case "delete":
        if (payload) {
          setFlagged(prev => prev.filter(item => item.id !== payload.id));
          setAudit(prev => [...prev, {
            id: `log-${Date.now()}`,
            ts: now,
            actor,
            action: "delete",
            targetType: "flag",
            targetId: payload.id,
            meta: { reason: "manual_deletion" }
          }]);
        }
        break;

      case "bulk_approve":
        setFlagged(prev => prev.map(item => 
          selected.has(item.id) ? { ...item, status: "approved" as const } : item
        ));
        setAudit(prev => [...prev, {
          id: `log-${Date.now()}`,
          ts: now,
          actor,
          action: "bulk_approve",
          targetType: "flag",
          targetId: "multiple",
          meta: { count: selected.size, ids: Array.from(selected) }
        }]);
        setSelected(new Set());
        break;

      case "bulk_delete":
        setFlagged(prev => prev.filter(item => !selected.has(item.id)));
        setAudit(prev => [...prev, {
          id: `log-${Date.now()}`,
          ts: now,
          actor,
          action: "bulk_delete",
          targetType: "flag",
          targetId: "multiple",
          meta: { count: selected.size, ids: Array.from(selected) }
        }]);
        setSelected(new Set());
        break;

      case "resolve":
        if (payload) {
          setSystem(prev => prev.map(alert => 
            alert.id === payload.id ? { ...alert, status: "resolved" as const } : alert
          ));
          setAudit(prev => [...prev, {
            id: `log-${Date.now()}`,
            ts: now,
            actor,
            action: "resolve",
            targetType: "system",
            targetId: payload.id,
            meta: { type: payload.type }
          }]);
        }
        break;

      case "snooze":
        if (payload) {
          setSystem(prev => prev.map(alert => 
            alert.id === payload.id ? { ...alert, status: "snoozed" as const } : alert
          ));
          setAudit(prev => [...prev, {
            id: `log-${Date.now()}`,
            ts: now,
            actor,
            action: "snooze",
            targetType: "system",
            targetId: payload.id,
            meta: { type: payload.type, duration: "24h" }
          }]);
        }
        break;
    }
  };

  const handleCancelConfirm = () => {
    setConfirm({ open: false, kind: null, payload: undefined });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Moderation & Alerts</h1>
        <p className="text-gray-600">Manage flagged content, system alerts, and audit logs</p>
      </div>

      {/* Filters */}
      <AlertsFilters value={filters} onChange={setFilters} />

      {/* Conditional Content Based on Queue */}
      {filters.queue === "flagged" && (
        <>
          {/* Bulk Actions Bar */}
          <BulkBar
            count={selected.size}
            onBulkApprove={handleBulkApprove}
            onBulkDelete={handleBulkDelete}
            onClear={handleClearSelection}
          />

          {/* Flagged Queue */}
          <FlaggedQueue
            rows={filteredFlagged}
            selected={selected}
            onToggleSelect={handleToggleSelect}
            onOpen={handleOpenDrawer}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />

          {/* Flag Detail Drawer */}
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
        <SystemAlerts
          rows={filteredSystem}
          onResolve={handleResolve}
          onSnooze={handleSnooze}
        />
      )}

      {filters.queue === "audit" && (
        <AuditLog rows={filteredAudit} />
      )}

      {/* Confirm Modal */}
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