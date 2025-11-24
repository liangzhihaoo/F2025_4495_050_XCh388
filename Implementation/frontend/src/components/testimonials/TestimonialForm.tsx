import { useState, useEffect, useRef } from 'react'
import type { Testimonial, TestimonialStatus, TestimonialSource } from '../../lib/mock'

export type FormMode = "create" | "edit"

type Props = {
  mode: FormMode
  open: boolean
  initial?: Partial<Testimonial>
  onCancel: () => void
  onSubmit: (values: Omit<Testimonial, "id"|"created_at">, avatarFile: File | null) => void
}

export default function TestimonialForm({ mode, open, initial, onCancel, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    author_name: '',
    role_title: '',
    company: '',
    rating: null as number | null,
    quote: '',
    is_featured: false,
    status: 'published' as TestimonialStatus,
    source: 'manual' as TestimonialSource
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset form when modal opens/closes or initial data changes
  useEffect(() => {
    if (open) {
      setFormData({
        author_name: initial?.author_name || '',
        role_title: initial?.role_title || '',
        company: initial?.company || '',
        rating: initial?.rating ?? null,
        quote: initial?.quote || '',
        is_featured: initial?.is_featured || false,
        status: initial?.status || 'published',
        source: initial?.source || 'manual'
      })

      // Set avatar preview from existing URL (for edit mode)
      if (initial?.avatar_url) {
        setAvatarPreview(initial.avatar_url)
      } else {
        setAvatarPreview(null)
      }

      setAvatarFile(null)
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

    if (!formData.author_name.trim()) {
      newErrors.author_name = 'Author name is required'
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
        author_name: formData.author_name.trim(),
        role_title: formData.role_title.trim() || null,
        company: formData.company.trim() || null,
        avatar_url: null, // Will be set by service after upload
        rating: formData.rating,
        quote: formData.quote.trim(),
        is_featured: formData.is_featured,
        status: formData.status,
        source: formData.source
      }, avatarFile)
    }
  }

  const handleChange = (field: keyof typeof formData, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Image must be less than 5MB' }))
        return
      }

      setAvatarFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Clear any errors
      setErrors(prev => ({ ...prev, avatar: '' }))
    }
  }

  const handleDeleteAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
                  <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    id="author_name"
                    value={formData.author_name}
                    onChange={(e) => handleChange('author_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.author_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter author name"
                  />
                  {errors.author_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.author_name}</p>
                  )}
                </div>

                {/* Author Role */}
                <div>
                  <label htmlFor="role_title" className="block text-sm font-medium text-gray-700 mb-1">
                    Role/Title
                  </label>
                  <input
                    type="text"
                    id="role_title"
                    value={formData.role_title}
                    onChange={(e) => handleChange('role_title', e.target.value)}
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

                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar
                  </label>

                  {avatarPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleDeleteAvatar}
                        className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label="Remove avatar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload
                      </label>
                    </div>
                  )}

                  {errors.avatar && (
                    <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Max 5MB, image files only</p>
                </div>

                {/* Rating */}
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (1-5)
                  </label>
                  <select
                    id="rating"
                    value={formData.rating ?? ''}
                    onChange={(e) => handleChange('rating', e.target.value ? parseInt(e.target.value) : null)}
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
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => handleChange('is_featured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
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
                    onChange={(e) => handleChange('source', e.target.value as TestimonialSource)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="manual">Manual</option>
                    <option value="in_app">In-app</option>
                    <option value="imported">Imported</option>
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
