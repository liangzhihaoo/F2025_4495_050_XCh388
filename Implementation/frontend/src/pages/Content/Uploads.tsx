import { useMemo, useState } from 'react'
import { mockUploads, type UploadItem } from '../../lib/mock'
import UploadFilters, { type UploadFiltersValue } from '../../components/content/UploadFilters'
import UploadTable from '../../components/content/UploadTable'
import UploadGrid from '../../components/content/UploadGrid'
import UploadDetailDrawer from '../../components/content/UploadDetailDrawer'
import DeleteConfirmModal from '../../components/content/DeleteConfirmModal'
import ImageGalleryModal from '../../components/content/ImageGalleryModal'

export default function Uploads() {
  // Data
  const allUploads = useMemo(() => mockUploads(60), [])

  // Local state
  const [filters, setFilters] = useState<UploadFiltersValue>({
    q: '',
    range: 'all',
    view: 'table'
  })
  const [selectedItem, setSelectedItem] = useState<UploadItem | null>(null)
  const [toDelete, setToDelete] = useState<UploadItem | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  // Filter and search logic
  const filteredUploads = useMemo(() => {
    let filtered = allUploads

    // Search filter
    if (filters.q.trim()) {
      const query = filters.q.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.userEmail.toLowerCase().includes(query)
      )
    }

    // Date range filter
    if (filters.range !== 'all') {
      const now = new Date()
      const days = filters.range === '7d' ? 7 : filters.range === '30d' ? 30 : 90
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(item => new Date(item.createdAt) >= cutoffDate)
    }

    return filtered
  }, [allUploads, filters])

  // Pagination
  const totalPages = Math.ceil(filteredUploads.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedUploads = filteredUploads.slice(startIndex, endIndex)

  // Handlers
  const handleFiltersChange = (newFilters: UploadFiltersValue) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleViewItem = (item: UploadItem) => {
    setSelectedItem(item)
  }

  const handleDeleteItem = (item: UploadItem) => {
    setToDelete(item)
  }

  const handleConfirmDelete = (item: UploadItem) => {
    // In a real app, this would make an API call
    // For now, we'll just close the modal
    setToDelete(null)
  }

  const handleOpenGallery = (startIndex: number) => {
    setGalleryIndex(startIndex)
    setIsGalleryOpen(true)
  }

  const handleCloseGallery = () => {
    setIsGalleryOpen(false)
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Uploads</h1>
        <div className="text-sm text-gray-500">
          {filteredUploads.length} upload{filteredUploads.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <UploadFilters value={filters} onChange={handleFiltersChange} />

      {/* Content */}
      {filters.view === 'table' ? (
        <UploadTable
          items={paginatedUploads}
          onOpen={handleViewItem}
          onDelete={handleDeleteItem}
        />
      ) : (
        <UploadGrid
          items={paginatedUploads}
          onOpen={handleViewItem}
          onDelete={handleDeleteItem}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredUploads.length)}</span> of{' '}
                <span className="font-medium">{filteredUploads.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modals and Drawers */}
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