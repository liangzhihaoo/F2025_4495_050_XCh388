import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleToggleSidebar = () => setMobileOpen((v) => !v)
  const handleCloseSidebar = () => setMobileOpen(false)

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Mobile overlay drawer */}
      <div className={`${mobileOpen ? 'fixed inset-0 z-20' : 'hidden'} md:hidden`}>
        <div className="absolute inset-0 bg-black/30" onClick={handleCloseSidebar} />
        <div className="absolute inset-y-0 left-0 w-64 bg-white border-r shadow-lg">
          <Sidebar onNavigate={handleCloseSidebar} />
        </div>
      </div>

      {/* Desktop sidebar - fixed position */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 z-10">
        <Sidebar />
      </div>

      {/* Main content area with left margin for desktop sidebar */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Topbar onMenuClick={handleToggleSidebar} />
        <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}


