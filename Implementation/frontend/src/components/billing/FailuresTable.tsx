import { useState } from "react";
import type { FailedPayment } from "../../lib/mock";
import { formatDateTime, formatCurrency } from "../../lib/format";

type Props = {
  items: FailedPayment[];
  onRetry: (row: FailedPayment) => void;
  onCancel: (row: FailedPayment) => void;
  onResolve: (row: FailedPayment) => void;
};

type SortField = "attemptedAt" | "amount" | "attempts";
type SortDirection = "asc" | "desc";

export function FailuresTable({ items, onRetry, onCancel, onResolve }: Props) {
  const [sortField, setSortField] = useState<SortField>("attemptedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case "attemptedAt":
        aValue = new Date(a.attemptedAt).getTime();
        bValue = new Date(b.attemptedAt).getTime();
        break;
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "attempts":
        aValue = a.attempts;
        bValue = b.attempts;
        break;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusChip = (status: FailedPayment["status"]) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case "Open":
        return `${baseClasses} bg-red-50 text-red-700`;
      case "Retry Scheduled":
        return `${baseClasses} bg-amber-50 text-amber-700`;
      case "Resolved":
        return `${baseClasses} bg-green-50 text-green-700`;
      case "Canceled":
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

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

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <p className="text-gray-500">No failed payments match your filters.</p>
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
                <SortButton field="attemptedAt">User</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Plan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                <SortButton field="amount">Amount</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Reason
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                <SortButton field="attemptedAt">Attempted</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Next Retry
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                <SortButton field="attempts">Attempts</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedItems.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {item.userEmail}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {item.plan}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatCurrency(item.amount)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {item.reason}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDateTime(item.attemptedAt)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {item.nextRetryAt ? formatDateTime(item.nextRetryAt) : "—"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {item.attempts}
                </td>
                <td className="px-4 py-4">
                  <span className={getStatusChip(item.status)}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onRetry(item)}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Retry payment for ${item.userEmail}`}
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => onResolve(item)}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      aria-label={`Resolve payment for ${item.userEmail}`}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => onCancel(item)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Cancel payment for ${item.userEmail}`}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
