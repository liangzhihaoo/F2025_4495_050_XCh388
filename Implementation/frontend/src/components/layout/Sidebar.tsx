import { NavLink } from 'react-router-dom'
import { Home, Users, Upload, MessageSquare, CreditCard, BarChart3, Bell } from 'lucide-react'

const linkBase = 'flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-gray-600 no-underline'

type SidebarProps = {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="md:w-64 shrink-0 border-r bg-white h-full">
      <nav className="flex flex-col gap-2 p-4 w-full">
        <NavLink to="/" end onClick={onNavigate} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'}`}>
          <Home className="h-4 w-4" />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/users" onClick={onNavigate} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'}`}>
          <Users className="h-4 w-4" />
          <span>User Management</span>
        </NavLink>
        <NavLink to="/uploads" onClick={onNavigate} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'}`}>
          <Upload className="h-4 w-4" />
          <span>Uploads</span>
        </NavLink>
        <NavLink to="/analytics/onboarding" onClick={onNavigate} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'}`}>
          <BarChart3 className="h-4 w-4" />
          <span>Onboarding Funnel</span>
        </NavLink>
        <NavLink to="/testimonials" onClick={onNavigate} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'}`}>
          <MessageSquare className="h-4 w-4" />
          <span>Testimonials</span>
        </NavLink>
        <NavLink to="/analytics/billing" onClick={onNavigate} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'}`}>
          <CreditCard className="h-4 w-4" />
          <span>Billing</span>
        </NavLink>
        <NavLink to="/analytics/usage" onClick={onNavigate} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'}`}>
          <BarChart3 className="h-4 w-4" />
          <span>Usage Stats</span>
        </NavLink>
        {/* Temporarily hidden - Alerts page
        <NavLink to="/alerts" onClick={onNavigate} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'}`}>
          <Bell className="h-4 w-4" />
          <span>Alerts</span>
        </NavLink>
        */}
      </nav>
    </aside>
  )
}


