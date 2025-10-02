import { useState } from 'react'

export type UploadFiltersValue = {
  q: string
  range: "7d" | "30d" | "90d" | "all"
  view: "table" | "grid"
}

type UploadFiltersProps = {
  value: UploadFiltersValue
  onChange: (v: UploadFiltersValue) => void
}

export default function UploadFilters({ value, onChange }: UploadFiltersProps) {
  const [searchValue, setSearchValue] = useState(value.q)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange({ ...value, q: newValue })
  }

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, range: e.target.value as UploadFiltersValue['range'] })
  }

  const handleViewChange = (view: UploadFiltersValue['view']) => {
    onChange({ ...value, view })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-64">
        <input
          type="text"
          placeholder="Search by title, ID, or uploader email..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Date Range Select */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 whitespace-nowrap">Date range:</label>
        <select
          value={value.range}
          onChange={handleRangeChange}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7d</option>
          <option value="30d">Last 30d</option>
          <option value="90d">Last 90d</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
        <button
          onClick={() => handleViewChange('table')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            value.view === 'table'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Table view"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={() => handleViewChange('grid')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            value.view === 'grid'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Grid view"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
