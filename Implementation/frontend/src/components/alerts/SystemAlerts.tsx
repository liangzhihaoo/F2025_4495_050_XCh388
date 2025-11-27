import type { SystemAlert } from "../../lib/mock";
import { formatAgo } from "../../lib/format";

type Props = {
  rows: SystemAlert[];
  onResolve: (row: SystemAlert) => void;
  onSnooze: (row: SystemAlert) => void;
};

export function SystemAlerts({ rows, onResolve, onSnooze }: Props) {
  const getSeverityChip = (severity: SystemAlert["severity"]) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (severity) {
      case "low":
        return `${baseClasses} bg-gray-100 text-gray-700`;
      case "medium":
        return `${baseClasses} bg-amber-50 text-amber-700`;
      case "high":
        return `${baseClasses} bg-red-50 text-red-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getTypeChip = (type: SystemAlert["type"]) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (type) {
      case "missing_profile":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case "payment_issue":
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case "quota_exceeded":
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case "other":
        return `${baseClasses} bg-gray-100 text-gray-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <p className="text-gray-500">No system alerts match your filters.</p>
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
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Message
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-4">
                  <span className={getTypeChip(row.type)}>
                    {row.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {row.message}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {row.userEmail || "—"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatAgo(row.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <span className={getSeverityChip(row.severity)}>
                    {row.severity}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onResolve(row)}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      aria-label={`Resolve ${row.type} alert`}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => onSnooze(row)}
                      className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      aria-label={`Snooze ${row.type} alert`}
                    >
                      Snooze
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
