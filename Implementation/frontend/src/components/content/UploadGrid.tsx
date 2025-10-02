import { useState } from 'react'
import type { UploadItem } from '../../lib/mock'
import { formatDateTime } from '../../lib/format'

type UploadGridProps = {
  items: UploadItem[]
  onOpen: (item: UploadItem) => void
  onDelete: (item: UploadItem) => void
}

export default function UploadGrid({ items, onOpen, onDelete }: UploadGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-500 text-sm">No uploads match your filters.</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onOpen(item)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Cover Image */}
          <div className="aspect-square bg-gray-100 overflow-hidden">
            <img
              src={item.images[0]?.url}
              alt={`Cover image for ${item.title}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.id}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="truncate">{item.userEmail}</span>
              <span className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</span>
            </div>

            {/* Image Count Badge */}
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {item.images.length} image{item.images.length !== 1 ? 's' : ''}
              </span>

              {/* Overflow Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item)
                  }}
                  className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
                    hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-label={`Delete ${item.title}`}
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
