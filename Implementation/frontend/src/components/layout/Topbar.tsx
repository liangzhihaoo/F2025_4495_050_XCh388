import { Bell, Menu, User } from 'lucide-react'

type TopbarProps = {
  onMenuClick?: () => void
  onSearch?: (query: string) => void
}

export default function Topbar({ onMenuClick, onSearch }: TopbarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full">
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={onMenuClick} aria-label="Open Menu">
          <Menu className="h-5 w-5" />
        </button>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full max-w-md border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <button className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center" aria-label="Account">
          <User className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  )
}


