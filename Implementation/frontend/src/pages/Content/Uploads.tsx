import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { UploadItem } from '../../lib/mock'
import UploadFilters, { type UploadFiltersValue } from '../../components/content/UploadFilters'
import UploadTable from '../../components/content/UploadTable'
import UploadGrid from '../../components/content/UploadGrid'
import UploadDetailDrawer from '../../components/content/UploadDetailDrawer'
import DeleteConfirmModal from '../../components/content/DeleteConfirmModal'
import ImageGalleryModal from '../../components/content/ImageGalleryModal'
import Paginator from '../../components/ui/Paginator'
import { fetchUploads } from '../../services/uploads'
import { trackPagination } from '../../lib/posthog'

const paginationOn = import.meta.env.VITE_FEATURE_PAGINATION !== "false";

export default function Uploads() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<UploadFiltersValue>({
    q: params.get("q") ?? '',
    range: (params.get("range") as any) ?? 'all',
    view: (params.get("view") as any) ?? 'table'
  })
  const [selectedItem, setSelectedItem] = useState<UploadItem | null>(null)
  const [toDelete, setToDelete] = useState<UploadItem | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [page, setPage] = useState(Number(params.get("page") ?? 1))
  const [pageSize, setPageSize] = useState(Number(params.get("pageSize") ?? 20))

  // Sync URL params
  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    next.set("pageSize", String(pageSize));
    if (filters.q) next.set("q", filters.q);
    else next.delete("q");
    if (filters.range !== 'all') next.set("range", filters.range);
    else next.delete("range");
    if (filters.view !== 'table') next.set("view", filters.view);
    else next.delete("view");
    setParams(next, { replace: true });
  }, [page, pageSize, filters, params, setParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [filters.q, filters.range]);

  // Fetch uploads with React Query
  const { data, isFetching } = useQuery({
    queryKey: ["uploads", { page, pageSize, filters }],
    queryFn: () => fetchUploads({ page, pageSize, filters }),
    placeholderData: (previousData) => previousData,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleFiltersChange = (newFilters: UploadFiltersValue) => {
    setFilters(newFilters)
  }

  const handleViewItem = (item: UploadItem) => {
    setSelectedItem(item)
  }

  const handleDeleteItem = (item: UploadItem) => {
    setToDelete(item)
  }

  const handleConfirmDelete = (item: UploadItem) => {
    // In a real app, this would make an API call
    setToDelete(null)
  }

  const handleOpenGallery = (startIndex: number) => {
    setGalleryIndex(startIndex)
    setIsGalleryOpen(true)
  }

  const handleCloseGallery = () => {
    setIsGalleryOpen(false)
  }

  return (
    <div className="space-y-6 min-h-[60vh]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Uploads</h1>
        <div className="text-sm text-gray-500">
          {total} upload{total !== 1 ? 's' : ''}
        </div>
      </div>

      <UploadFilters value={filters} onChange={handleFiltersChange} />

      {filters.view === 'table' ? (
        <UploadTable
          items={items}
          onOpen={handleViewItem}
          onDelete={handleDeleteItem}
        />
      ) : (
        <UploadGrid
          items={items}
          onOpen={handleViewItem}
          onDelete={handleDeleteItem}
        />
      )}

      {paginationOn && (
        <Paginator
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={(p) => {
            setPage(p);
            trackPagination("uploads", "navigate", { page: p, pageSize });
          }}
          onPageSizeChange={(ps) => {
            setPage(1);
            setPageSize(ps);
            trackPagination("uploads", "change_page_size", { pageSize: ps });
          }}
          isLoading={isFetching}
        />
      )}

      <UploadDetailDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenGallery={handleOpenGallery}
      />

      <DeleteConfirmModal
        item={toDelete}
        open={Boolean(toDelete)}
        onCancel={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <ImageGalleryModal
        item={selectedItem}
        open={isGalleryOpen}
        startIndex={galleryIndex}
        onClose={handleCloseGallery}
      />
    </div>
  )
}