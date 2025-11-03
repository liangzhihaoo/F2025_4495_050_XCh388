import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { Testimonial } from '../../lib/mock'
import TestimonialFilters, { type FiltersValue } from '../../components/testimonials/TestimonialFilters'
import TestimonialCard from '../../components/testimonials/TestimonialCard'
import TestimonialForm, { type FormMode } from '../../components/testimonials/TestimonialForm'
import DeleteConfirmModal from '../../components/testimonials/DeleteConfirmModal'
import Paginator from '../../components/ui/Paginator'
import { fetchTestimonials } from '../../services/testimonials'
import { trackPagination } from '../../lib/posthog'

const paginationOn = import.meta.env.VITE_FEATURE_PAGINATION !== "false";

export default function Testimonials() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<FiltersValue>({
    q: params.get("q") ?? '',
    status: (params.get("status") as any) ?? 'all',
    featuredOnly: params.get("featuredOnly") === 'true',
    source: (params.get("source") as any) ?? 'all'
  })
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [toDelete, setToDelete] = useState<Testimonial | null>(null)
  const [page, setPage] = useState(Number(params.get("page") ?? 1))
  const [pageSize, setPageSize] = useState(Number(params.get("pageSize") ?? 20))

  // Sync URL params
  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    next.set("pageSize", String(pageSize));
    if (filters.q) next.set("q", filters.q);
    else next.delete("q");
    if (filters.status !== 'all') next.set("status", filters.status);
    else next.delete("status");
    if (filters.featuredOnly) next.set("featuredOnly", "true");
    else next.delete("featuredOnly");
    if (filters.source !== 'all') next.set("source", filters.source);
    else next.delete("source");
    setParams(next, { replace: true });
  }, [page, pageSize, filters, params, setParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [filters.q, filters.status, filters.featuredOnly, filters.source]);

  // Fetch testimonials with React Query
  const { data, isFetching } = useQuery({
    queryKey: ["testimonials", { page, pageSize, filters }],
    queryFn: () => fetchTestimonials({ page, pageSize, filters }),
    placeholderData: (previousData) => previousData,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

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
    // In a real app, this would make an API call
    // For now, just close the form
    setFormOpen(false)
    setEditing(null)
    // Invalidate queries to refetch
  }

  const handleDelete = (item: Testimonial) => {
    setToDelete(item)
  }

  const handleConfirmDelete = (item: Testimonial) => {
    // In a real app, this would make an API call
    setToDelete(null)
    // Invalidate queries to refetch
  }

  const handleToggleFeatured = (item: Testimonial) => {
    // In a real app, this would make an API call
    // Invalidate queries to refetch
  }

  return (
    <div className="space-y-6 min-h-[60vh]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
        <div className="text-sm text-gray-500">
          {total} testimonial{total !== 1 ? 's' : ''}
          {filters.featuredOnly && ' (featured only)'}
        </div>
      </div>

      <TestimonialFilters
        value={filters}
        onChange={handleFiltersChange}
        onCreate={handleCreate}
      />

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-500 text-sm">
            No testimonials match your filters.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
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

      {paginationOn && (
        <Paginator
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={(p) => {
            setPage(p);
            trackPagination("testimonials", "navigate", { page: p, pageSize });
          }}
          onPageSizeChange={(ps) => {
            setPage(1);
            setPageSize(ps);
            trackPagination("testimonials", "change_page_size", { pageSize: ps });
          }}
          isLoading={isFetching}
        />
      )}

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