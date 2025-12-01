import { Menu } from 'lucide-react'

type TopbarProps = {
  onMenuClick?: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <div className="md:hidden sticky top-0 z-10 bg-white border-b px-4 py-3">
      <button className="p-2 rounded-md hover:bg-gray-100" onClick={onMenuClick} aria-label="Open Menu">
        <Menu className="h-5 w-5" />
      </button>
    </div>
  )
}


