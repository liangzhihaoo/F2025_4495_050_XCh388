type Props = {
  count: number;
  onBulkApprove: () => void;
  onBulkDelete: () => void;
  onClear: () => void;
};

export function BulkBar({ count, onBulkApprove, onBulkDelete, onClear }: Props) {
  if (count === 0) return null;

  return (
    <div className="sticky top-0 z-10 bg-blue-600 text-white p-3 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">
            {count} item{count !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onBulkApprove}
            className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={`Approve ${count} selected items`}
          >
            Bulk Approve
          </button>
          <button
            onClick={onBulkDelete}
            className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={`Delete ${count} selected items`}
          >
            Bulk Delete
          </button>
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Clear selection"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
