import { useState } from 'react'
import type { UploadItem } from '../../lib/mock'
import { formatDateTime } from '../../lib/format'

type UploadTableProps = {
  items: UploadItem[]
  onOpen: (item: UploadItem) => void
  onDelete: (item: UploadItem) => void
}

type SortDirection = 'asc' | 'desc'

export default function UploadTable({ items, onOpen, onDelete }: UploadTableProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
  })

  if (sortedItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-500 text-sm">No uploads match your filters.</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="table-auto w-full">
        <thead className="text-left text-xs text-gray-500 bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium">Preview</th>
            <th className="px-4 py-3 font-medium">Brand</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Uploader</th>
            <th className="px-4 py-3 font-medium">
              <button
                onClick={handleSort}
                className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                aria-label={`Sort by created date ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
              >
                Created
                <svg
                  className={`w-3 h-3 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </th>
            <th className="px-4 py-3 font-medium">Images</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {sortedItems.map((item, idx) => (
            <tr key={item.id} className={idx % 2 === 1 ? 'odd:bg-gray-50' : ''}>
              {/* Preview */}
              <td className="px-4 py-3">
                <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden">
                  {item.images[0] && (
                    <img
                      src={item.images[0]}
                      alt={`Preview of ${item.brand || 'product'}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </td>

              {/* Brand */}
              <td className="px-4 py-3 text-gray-900">{item.brand || '-'}</td>

              {/* Type */}
              <td className="px-4 py-3 text-gray-600">{item.type || '-'}</td>

              {/* Price */}
              <td className="px-4 py-3 text-gray-600">
                {item.price ? `$${item.price}` : '-'}
              </td>

              {/* Uploader */}
              <td className="px-4 py-3 text-gray-600">{item.uploaderName || '-'}</td>

              {/* Created */}
              <td className="px-4 py-3 text-gray-600">{formatDateTime(item.created_at)}</td>

              {/* Images */}
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.images.length}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpen(item)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    aria-label={`View details for ${item.brand || 'product'}`}
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    aria-label={`Delete ${item.brand || 'product'}`}
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
  )
}
