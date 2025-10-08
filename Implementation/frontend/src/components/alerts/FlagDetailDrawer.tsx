import { useState } from "react";
import type { FlaggedItem } from "../../lib/mock";
import { formatDateTime, formatAgo } from "../../lib/format";

type Props = {
  item?: FlaggedItem | null;
  open: boolean;
  onClose: () => void;
  onApprove: (row: FlaggedItem) => void;
  onDelete: (row: FlaggedItem) => void;
};

export function FlagDetailDrawer({ item, open, onClose, onApprove, onDelete }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!open || !item) return null;

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      />
      
      {/* Drawer */}
      <div 
        className="fixed right-0 top-0 h-full w-[440px] bg-white shadow-xl p-6 overflow-y-auto z-50"
        role="dialog"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-description"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 id="drawer-title" className="text-lg font-semibold text-gray-900 mb-2">
              {item.title}
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">{item.id}</span>
              <span className={getSeverityChip(item.severity)}>
                {item.severity}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label="Close drawer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Uploader Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <div className="font-medium text-gray-900 mb-1">Uploader</div>
            <div className="text-gray-600 mb-2">{item.userEmail}</div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>Created: {formatDateTime(item.createdAt)}</div>
              <div>Flagged: {formatAgo(item.flaggedAt)}</div>
            </div>
          </div>
        </div>

        {/* Reasons */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-900 mb-2">Flag Reasons</div>
          <div className="flex flex-wrap gap-2">
            {item.reasons.map((reason) => (
              <span key={reason} className={getReasonChip(reason)}>
                {reason}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-900 mb-2">System Notes</div>
            <div className="text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              {item.notes}
            </div>
          </div>
        )}

        {/* Images */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-900 mb-3">Evidence Images</div>
          <div className="grid grid-cols-2 gap-3">
            {item.images.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.url}
                  alt={`Evidence ${image.id}`}
                  className="w-full h-24 object-cover rounded-md bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedImage(image.url)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(item)}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Approve
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full p-4">
            <img
              src={selectedImage}
              alt="Full size evidence"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded-md p-1"
              aria-label="Close image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
