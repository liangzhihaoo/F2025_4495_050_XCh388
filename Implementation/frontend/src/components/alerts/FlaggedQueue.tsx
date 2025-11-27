import type { FlaggedItem } from "../../lib/mock";
import { formatAgo } from "../../lib/format";

type Props = {
  rows: FlaggedItem[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpen: (row: FlaggedItem) => void;
  onApprove: (row: FlaggedItem) => void;
  onDelete: (row: FlaggedItem) => void;
};

export function FlaggedQueue({ rows, selected, onToggleSelect, onOpen, onApprove, onDelete }: Props) {
  const getSeverityChip = (severity: FlaggedItem["severity"]) => {
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

  const getReasonChip = (reason: string) => {
    return "px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700";
  };

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <p className="text-gray-500">No flagged items match your filters.</p>
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  checked={selected.size === rows.length && rows.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      rows.forEach(row => onToggleSelect(row.id));
                    } else {
                      rows.forEach(row => onToggleSelect(row.id));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-label="Select all items"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                Preview
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Uploader
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Reasons
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Flagged At
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
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={() => onToggleSelect(row.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label={`Select ${row.title}`}
                  />
                </td>
                <td className="px-4 py-4">
                  {row.images.length > 0 && (
                    <img
                      src={row.images[0].url}
                      alt={`Preview of ${row.title}`}
                      className="h-12 w-12 rounded-md object-cover bg-gray-100"
                    />
                  )}
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{row.title}</div>
                    <div className="text-xs text-gray-500">{row.id}</div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {row.userEmail}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {row.reasons.map((reason) => (
                      <span key={reason} className={getReasonChip(reason)}>
                        {reason}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={getSeverityChip(row.severity)}>
                    {row.severity}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatAgo(row.flaggedAt)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onOpen(row)}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`View details for ${row.title}`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => onApprove(row)}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      aria-label={`Approve ${row.title}`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${row.title}`}
                    >
                      Delete
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
