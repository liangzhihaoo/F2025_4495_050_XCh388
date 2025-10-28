import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Overview from './pages/Dashboard/Overview'
import UsersList from './pages/Users/UsersList'
import Uploads from './pages/Content/Uploads'
import FunnelAnalytics from './pages/Analytics/Funnel'
import Testimonials from './pages/Testimonials/Testimonials'
import Billing from './pages/Analytics/Billing'
import Usage from './pages/Analytics/Usage'
// import Alerts from './pages/Alerts/Alerts' // Temporarily hidden

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/uploads" element={<Uploads />} />
        <Route path="/analytics/onboarding" element={<FunnelAnalytics />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/analytics/billing" element={<Billing />} />
        <Route path="/analytics/usage" element={<Usage />} />
        {/* <Route path="/alerts" element={<Alerts />} /> */} {/* Temporarily hidden */}
      </Route>
    </Routes>
  )
}


