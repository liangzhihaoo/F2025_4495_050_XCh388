import { useState } from 'react'
import type { Testimonial } from '../../lib/mock'
import { formatDate } from '../../lib/format'

type Props = {
  item: Testimonial
  onEdit: (t: Testimonial) => void
  onDelete: (t: Testimonial) => void
  onToggleFeatured: (t: Testimonial) => void
}

export default function TestimonialCard({ item, onEdit, onDelete, onToggleFeatured }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const statusColors = {
    published: 'bg-green-50 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    hidden: 'bg-amber-50 text-amber-700'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
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
            <div className="font-medium text-gray-900 truncate">{item.author_name}</div>
            <div className="text-sm text-gray-600 truncate">
              {item.role_title && `${item.role_title}${item.company ? ` at ${item.company}` : ''}`}
            </div>
          </div>
        </div>
        {item.is_featured && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Quote */}
      <div className="text-gray-800">
        <p className={`${isExpanded ? '' : 'line-clamp-3'}`}>
          {item.quote}
        </p>
        {item.quote.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Rating */}
      {item.rating && (
        <div className="flex items-center gap-1">
          {renderStars(item.rating)}
          <span className="text-sm text-gray-500 ml-1">({item.rating}/5)</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
            {item.status}
          </span>
          {item.source && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {item.source}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(item.created_at)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(item)}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
          aria-label={`Edit testimonial from ${item.author_name}`}
        >
          Edit
        </button>
        <button
          onClick={() => onToggleFeatured(item)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            item.is_featured
              ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
              : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
          }`}
          aria-label={`${item.is_featured ? 'Unfeature' : 'Feature'} testimonial from ${item.author_name}`}
        >
          {item.is_featured ? 'Unfeature' : 'Feature'}
        </button>
        <button
          onClick={() => onDelete(item)}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          aria-label={`Delete testimonial from ${item.author_name}`}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
