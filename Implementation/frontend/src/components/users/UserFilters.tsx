type Props = {
  search: string
  onSearch: (v: string) => void
  plan: string
  onPlan: (v: string) => void
  status: string
  onStatus: (v: string) => void
}

export default function UserFilters({ search, onSearch, plan, onPlan, status, onStatus }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-lg shadow-sm">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search name or email..."
        className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search users"
      />
      <select
        value={plan}
        onChange={(e) => onPlan(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Filter by plan"
      >
        <option value="">All Plans</option>
        <option value="Free">Free</option>
        <option value="Client Plus">Client Plus</option>
        <option value="Enterprise">Enterprise</option>
      </select>
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Suspended">Suspended</option>
      </select>
    </div>
  )
}


