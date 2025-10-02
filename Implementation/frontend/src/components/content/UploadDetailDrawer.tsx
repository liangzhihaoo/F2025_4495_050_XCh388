import { useEffect } from 'react'
import type { UploadItem } from '../../lib/mock'
import { formatDateTime } from '../../lib/format'

type Props = {
  item?: UploadItem | null
  onClose: () => void
  onOpenGallery: (startIndex: number) => void
}

export default function UploadDetailDrawer({ item, onClose, onOpenGallery }: Props) {
  const open = Boolean(item)

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!item) return null

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}
      <div
        role="dialog"
        aria-hidden={!open}
        className={`fixed right-0 top-0 h-full w-[420px] bg-white shadow-xl p-6 overflow-y-auto z-50 transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h2>
              <p className="text-xs text-gray-500 mt-1">{item.id}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Uploader Block */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Uploader</h3>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">{item.userEmail}</div>
              <div className="text-xs text-gray-500">User ID: {item.userId}</div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Created</h3>
              <div className="text-sm text-gray-600">{formatDateTime(item.createdAt)}</div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h3>
              <div className="text-sm text-gray-600">{formatDateTime(item.lastUpdatedAt)}</div>
            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-sm text-amber-800">{item.notes}</div>
              </div>
            </div>
          )}

          {/* Image Thumbnails */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Images ({item.images.length})
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => onOpenGallery(index)}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all group"
                  aria-label={`View image ${index + 1} of ${item.title}`}
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1} of ${item.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => onOpenGallery(0)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              View All Images
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
