export type ConfirmKind = "approve" | "delete" | "bulk_approve" | "bulk_delete" | "resolve" | "snooze";

type Props = {
  open: boolean;
  kind: ConfirmKind | null;
  payload?: any;
  onCancel: () => void;
  onConfirm: (kind: ConfirmKind, payload?: any) => void;
};

export function ConfirmModal({ open, kind, payload, onCancel, onConfirm }: Props) {
  if (!open || !kind) return null;

  const getModalContent = () => {
    switch (kind) {
      case "approve":
        return {
          title: "Approve Item",
          message: "Mark this flagged item as acceptable?",
          confirmText: "Approve",
          confirmClass: "bg-green-600 hover:bg-green-700 text-white",
        };
      case "delete":
        return {
          title: "Delete Item",
          message: "Remove this item from the platform?",
          confirmText: "Delete",
          confirmClass: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "bulk_approve":
        return {
          title: "Bulk Approve",
          message: `Approve ${payload?.count || 0} selected items?`,
          confirmText: "Approve All",
          confirmClass: "bg-green-600 hover:bg-green-700 text-white",
        };
      case "bulk_delete":
        return {
          title: "Bulk Delete",
          message: `Delete ${payload?.count || 0} selected items?`,
          confirmText: "Delete All",
          confirmClass: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "resolve":
        return {
          title: "Resolve Alert",
          message: "Mark this system alert as resolved?",
          confirmText: "Resolve",
          confirmClass: "bg-green-600 hover:bg-green-700 text-white",
        };
      case "snooze":
        return {
          title: "Snooze Alert",
          message: "Snooze this system alert for 24 hours?",
          confirmText: "Snooze",
          confirmClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
        };
    }
  };

  const content = getModalContent();

  const handleConfirm = () => {
    onConfirm(kind, payload);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="p-6">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900 mb-2">
            {content.title}
          </h3>
          
          <p id="modal-description" className="text-gray-600 mb-4">
            {content.message}
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${content.confirmClass}`}
            >
              {content.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
