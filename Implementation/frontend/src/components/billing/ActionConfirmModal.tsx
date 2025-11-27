import type { FailedPayment } from "../../lib/mock";

export type ActionKind = "retry" | "resolve" | "cancel";

type Props = {
  open: boolean;
  action: ActionKind | null;
  row?: FailedPayment | null;
  onCancel: () => void;
  onConfirm: (row: FailedPayment, action: ActionKind) => void;
};

export function ActionConfirmModal({ open, action, row, onCancel, onConfirm }: Props) {
  if (!open || !action || !row) return null;

  const getModalContent = () => {
    switch (action) {
      case "retry":
        return {
          title: "Schedule Retry",
          message: "Schedule another retry for this payment?",
          confirmText: "Schedule Retry",
          confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
        };
      case "resolve":
        return {
          title: "Mark as Resolved",
          message: "Mark this failed payment as resolved?",
          confirmText: "Mark Resolved",
          confirmClass: "bg-green-600 hover:bg-green-700 text-white",
        };
      case "cancel":
        return {
          title: "Cancel Collection",
          message: "Cancel this subscription's collection attempt?",
          confirmText: "Cancel Collection",
          confirmClass: "bg-red-600 hover:bg-red-700 text-white",
        };
    }
  };

  const content = getModalContent();

  const handleConfirm = () => {
    onConfirm(row, action);
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

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="text-sm text-gray-600">
              <div><strong>User:</strong> {row.userEmail}</div>
              <div><strong>Plan:</strong> {row.plan}</div>
              <div><strong>Amount:</strong> ${row.amount}</div>
              <div><strong>Reason:</strong> {row.reason}</div>
            </div>
          </div>

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
