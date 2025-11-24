import { useEffect } from 'react'
import type { Testimonial } from '../../lib/mock'

type Props = {
  open: boolean
  item?: Testimonial | null
  onCancel: () => void
  onConfirm: (t: Testimonial) => void
}

export default function DeleteConfirmModal({ open, item, onCancel, onConfirm }: Props) {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        onCancel()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onCancel])

  if (!open || !item) return null

  const handleConfirm = () => {
    onConfirm(item)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Delete Testimonial</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete this testimonial? This cannot be undone.
                </p>
              </div>
            </div>

            {/* Item Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={`${item.author_name} avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                      {item.author_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.author_name}</div>
                  <div className="text-sm text-gray-600">
                    {item.role_title && `${item.role_title}${item.company ? ` at ${item.company}` : ''}`}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                    "{item.quote}"
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="font-medium text-red-800">This action cannot be undone.</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This will permanently delete the testimonial from the platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
