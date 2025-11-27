import { useState } from "react";
import type { AuditRow } from "../../lib/mock";
import { formatDateTime } from "../../lib/format";

type Props = {
  rows: AuditRow[];
};

type SortField = "ts" | "actor" | "action";
type SortDirection = "asc" | "desc";

export function AuditLog({ rows }: Props) {
  const [sortField, setSortField] = useState<SortField>("ts");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case "ts":
        aValue = new Date(a.ts).getTime();
        bValue = new Date(b.ts).getTime();
        break;
      case "actor":
        aValue = a.actor;
        bValue = b.actor;
        break;
      case "action":
        aValue = a.action;
        bValue = b.action;
        break;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-medium text-gray-900 hover:text-blue-600 focus:outline-none"
    >
      {children}
      {sortField === field && (
        <span className="text-xs">
          {sortDirection === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <p className="text-gray-500">No audit log entries match your filters.</p>
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                <SortButton field="ts">Time</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                <SortButton field="actor">Actor</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                <SortButton field="action">Action</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Target
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Meta
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRows.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDateTime(row.ts)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {row.actor}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {row.action.replace('_', ' ')}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  <div>
                    <div className="text-xs text-gray-500">{row.targetType}</div>
                    <div>{row.targetId}</div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {row.meta ? (
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {JSON.stringify(row.meta)}
                    </code>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
