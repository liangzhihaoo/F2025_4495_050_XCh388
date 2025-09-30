import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleToggleSidebar = () => setMobileOpen((v) => !v)
  const handleCloseSidebar = () => setMobileOpen(false)

  const handleSearch = (query: string) => {
    // placeholder: log or later wire to route/search state
    console.log('Search:', query)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay drawer */}
      <div className={`${mobileOpen ? 'fixed inset-0 z-20' : 'hidden'} md:hidden`}>
        <div className="absolute inset-0 bg-black/30" onClick={handleCloseSidebar} />
        <div className="absolute inset-y-0 left-0 w-64 bg-white border-r shadow-lg">
          <Sidebar onNavigate={handleCloseSidebar} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={handleToggleSidebar} onSearch={handleSearch} />
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}


