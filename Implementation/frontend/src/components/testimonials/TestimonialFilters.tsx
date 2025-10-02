import { useState } from 'react'
import type { TestimonialStatus } from '../../lib/mock'

export type FiltersValue = {
  q: string
  status: "all" | TestimonialStatus
  featuredOnly: boolean
  source: "all" | "In-app" | "Imported" | "Manual"
}

type Props = {
  value: FiltersValue
  onChange: (v: FiltersValue) => void
  onCreate: () => void
}

export default function TestimonialFilters({ value, onChange, onCreate }: Props) {
  const [searchValue, setSearchValue] = useState(value.q)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange({ ...value, q: newValue })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, status: e.target.value as FiltersValue['status'] })
  }

  const handleFeaturedToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, featuredOnly: e.target.checked })
  }

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, source: e.target.value as FiltersValue['source'] })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="flex-1 min-w-64">
        <input
          type="text"
          placeholder="Search by author, company, or quote..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 whitespace-nowrap">Status:</label>
        <select
          value={value.status}
          onChange={handleStatusChange}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Hidden">Hidden</option>
        </select>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={value.featuredOnly}
            onChange={handleFeaturedToggle}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Featured only
        </label>
      </div>

      {/* Source Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 whitespace-nowrap">Source:</label>
        <select
          value={value.source}
          onChange={handleSourceChange}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="In-app">In-app</option>
          <option value="Imported">Imported</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      {/* Create Button */}
      <button
        onClick={onCreate}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        + New Testimonial
      </button>
    </div>
  )
}
