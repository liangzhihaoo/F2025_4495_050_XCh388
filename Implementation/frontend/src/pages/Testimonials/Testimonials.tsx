import { useState, useMemo } from 'react'
import { mockTestimonials, type Testimonial } from '../../lib/mock'
import TestimonialFilters, { type FiltersValue } from '../../components/testimonials/TestimonialFilters'
import TestimonialCard from '../../components/testimonials/TestimonialCard'
import TestimonialForm, { type FormMode } from '../../components/testimonials/TestimonialForm'
import DeleteConfirmModal from '../../components/testimonials/DeleteConfirmModal'

export default function Testimonials() {
  // Data
  const [items, setItems] = useState<Testimonial[]>(() => mockTestimonials())

  // UI state
  const [filters, setFilters] = useState<FiltersValue>({
    q: '',
    status: 'all',
    featuredOnly: false,
    source: 'all'
  })
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [toDelete, setToDelete] = useState<Testimonial | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Filter testimonials
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      if (filters.q.trim()) {
        const query = filters.q.toLowerCase()
        const matchesSearch = 
          item.authorName.toLowerCase().includes(query) ||
          item.company?.toLowerCase().includes(query) ||
          item.quote.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false
      }

      // Featured filter
      if (filters.featuredOnly && !item.featured) {
        return false
      }

      // Source filter
      if (filters.source !== 'all' && item.source !== filters.source) {
        return false
      }

      return true
    })
  }, [items, filters])

  // Handlers
  const handleFiltersChange = (newFilters: FiltersValue) => {
    setFilters(newFilters)
  }

  const handleCreate = () => {
    setEditing(null)
    setFormMode('create')
    setFormOpen(true)
  }

  const handleEdit = (item: Testimonial) => {
    setEditing(item)
    setFormMode('edit')
    setFormOpen(true)
  }

  const handleSubmit = (values: Omit<Testimonial, "id"|"createdAt"|"updatedAt">) => {
    if (formMode === 'create') {
      // Create new testimonial
      const newItem: Testimonial = {
        ...values,
        id: `t-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setItems(prev => [newItem, ...prev])
    } else {
      // Update existing testimonial
      setItems(prev => prev.map(item => 
        item.id === editing?.id 
          ? { ...item, ...values, updatedAt: new Date().toISOString() }
          : item
      ))
    }
    setFormOpen(false)
    setEditing(null)
  }

  const handleDelete = (item: Testimonial) => {
    setToDelete(item)
  }

  const handleConfirmDelete = (item: Testimonial) => {
    setItems(prev => prev.filter(i => i.id !== item.id))
    setToDelete(null)
  }

  const handleToggleFeatured = (item: Testimonial) => {
    setItems(prev => prev.map(i => 
      i.id === item.id 
        ? { ...i, featured: !i.featured, updatedAt: new Date().toISOString() }
        : i
    ))
  }

  const handleToggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
        <div className="text-sm text-gray-500">
          {filteredItems.length} testimonial{filteredItems.length !== 1 ? 's' : ''}
          {filters.featuredOnly && ' (featured only)'}
        </div>
      </div>

      {/* Filters */}
      <TestimonialFilters
        value={filters}
        onChange={handleFiltersChange}
        onCreate={handleCreate}
      />

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-500 text-sm">
            {items.length === 0 
              ? 'No testimonials yet. Create your first one!'
              : 'No testimonials match your filters.'
            }
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <TestimonialCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TestimonialForm
        mode={formMode}
        open={formOpen}
        initial={editing || undefined}
        onCancel={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal
        open={Boolean(toDelete)}
        item={toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}