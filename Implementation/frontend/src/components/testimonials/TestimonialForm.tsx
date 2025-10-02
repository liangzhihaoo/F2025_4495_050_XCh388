import { useState, useEffect } from 'react'
import type { Testimonial, TestimonialStatus } from '../../lib/mock'

export type FormMode = "create" | "edit"

type Props = {
  mode: FormMode
  open: boolean
  initial?: Partial<Testimonial>
  onCancel: () => void
  onSubmit: (values: Omit<Testimonial, "id"|"createdAt"|"updatedAt">) => void
}

export default function TestimonialForm({ mode, open, initial, onCancel, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    authorName: '',
    authorRole: '',
    authorAvatarUrl: '',
    company: '',
    rating: undefined as number | undefined,
    quote: '',
    featured: false,
    status: 'Published' as TestimonialStatus,
    source: 'Manual' as const
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens/closes or initial data changes
  useEffect(() => {
    if (open) {
      setFormData({
        authorName: initial?.authorName || '',
        authorRole: initial?.authorRole || '',
        authorAvatarUrl: initial?.authorAvatarUrl || '',
        company: initial?.company || '',
        rating: initial?.rating,
        quote: initial?.quote || '',
        featured: initial?.featured || false,
        status: initial?.status || 'Published',
        source: initial?.source || 'Manual'
      })
      setErrors({})
    }
  }, [open, initial])

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required'
    }

    if (!formData.quote.trim()) {
      newErrors.quote = 'Quote is required'
    } else if (formData.quote.trim().length < 20) {
      newErrors.quote = 'Quote must be at least 20 characters'
    }

    if (formData.rating && (formData.rating < 1 || formData.rating > 5)) {
      newErrors.rating = 'Rating must be between 1 and 5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        authorName: formData.authorName.trim(),
        authorRole: formData.authorRole.trim() || undefined,
        authorAvatarUrl: formData.authorAvatarUrl.trim() || undefined,
        company: formData.company.trim() || undefined,
        quote: formData.quote.trim()
      })
    }
  }

  const handleChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {mode === 'create' ? 'Create New Testimonial' : 'Edit Testimonial'}
                </h2>
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Author Name */}
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) => handleChange('authorName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.authorName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter author name"
                  />
                  {errors.authorName && (
                    <p className="mt-1 text-sm text-red-600">{errors.authorName}</p>
                  )}
                </div>

                {/* Author Role */}
                <div>
                  <label htmlFor="authorRole" className="block text-sm font-medium text-gray-700 mb-1">
                    Role/Title
                  </label>
                  <input
                    type="text"
                    id="authorRole"
                    value={formData.authorRole}
                    onChange={(e) => handleChange('authorRole', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Founder, CEO"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter company name"
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label htmlFor="authorAvatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    id="authorAvatarUrl"
                    value={formData.authorAvatarUrl}
                    onChange={(e) => handleChange('authorAvatarUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {formData.authorAvatarUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.authorAvatarUrl}
                        alt="Avatar preview"
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (1-5)
                  </label>
                  <select
                    id="rating"
                    value={formData.rating || ''}
                    onChange={(e) => handleChange('rating', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No rating</option>
                    <option value="1">1 star</option>
                    <option value="2">2 stars</option>
                    <option value="3">3 stars</option>
                    <option value="4">4 stars</option>
                    <option value="5">5 stars</option>
                  </select>
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                  )}
                </div>

                {/* Quote */}
                <div>
                  <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">
                    Quote *
                  </label>
                  <textarea
                    id="quote"
                    value={formData.quote}
                    onChange={(e) => handleChange('quote', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.quote ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter the testimonial quote (20-600 characters recommended)"
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>{formData.quote.length} characters</span>
                    <span>Recommended: 280-600 characters</span>
                  </div>
                  {errors.quote && (
                    <p className="mt-1 text-sm text-red-600">{errors.quote}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as TestimonialStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured testimonial
                  </label>
                </div>

                {/* Source */}
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    id="source"
                    value={formData.source}
                    onChange={(e) => handleChange('source', e.target.value as const)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Manual">Manual</option>
                    <option value="In-app">In-app</option>
                    <option value="Imported">Imported</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {mode === 'create' ? 'Create Testimonial' : 'Update Testimonial'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
