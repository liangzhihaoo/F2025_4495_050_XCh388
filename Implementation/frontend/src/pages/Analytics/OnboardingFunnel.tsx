import { useState, useEffect } from 'react'
import ChartCard from '../../components/ui/ChartCard'
import FiltersBar, { type FiltersValue } from '../../components/analytics/FiltersBar'
import FunnelBars from '../../components/analytics/FunnelBars'
import StepTimeTable from '../../components/analytics/StepTimeTable'
import ActivityTimeline from '../../components/analytics/ActivityTimeline'
import { 
  mockFunnel, 
  mockUserEvents, 
  mockCohortBuckets,
  type FunnelResponse,
  type ActivityEvent,
  type AggregateBucket
} from '../../lib/mock'
import { formatPct } from '../../lib/format'

const daysFromRange = (range: "7d" | "30d" | "90d") => {
  return range === "7d" ? 7 : range === "30d" ? 30 : 90
}

export default function OnboardingFunnel() {
  const [filters, setFilters] = useState<FiltersValue>({
    range: "30d",
    cohortLabel: "All Users",
    userQuery: "u-123"
  })

  const [funnel, setFunnel] = useState<FunnelResponse | null>(null)
  const [userEvents, setUserEvents] = useState<ActivityEvent[]>([])
  const [cohortBuckets, setCohortBuckets] = useState<AggregateBucket[]>([])

  // Initialize data
  useEffect(() => {
    refreshData()
  }, [])

  // Update data when filters change
  useEffect(() => {
    const days = daysFromRange(filters.range)
    setCohortBuckets(mockCohortBuckets(days))
    setUserEvents(mockUserEvents(filters.userQuery || "u-123"))
  }, [filters.range, filters.userQuery])

  const refreshData = () => {
    setFunnel(mockFunnel())
    const days = daysFromRange(filters.range)
    setCohortBuckets(mockCohortBuckets(days))
    setUserEvents(mockUserEvents(filters.userQuery || "u-123"))
  }

  const handleFiltersChange = (newFilters: FiltersValue) => {
    setFilters(newFilters)
  }

  const handleRefresh = () => {
    refreshData()
  }

  const handleSearchUser = (query: string) => {
    setFilters(prev => ({ ...prev, userQuery: query }))
  }

  if (!funnel) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading funnel data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Onboarding Funnel</h1>
        <p className="text-gray-600 mt-1">
          Analyze user progression through onboarding steps and identify drop-off points
        </p>
      </div>

      {/* Filters */}
      <FiltersBar 
        value={filters} 
        onChange={handleFiltersChange} 
        onRefresh={handleRefresh} 
      />

      {/* Funnel Visualization */}
      <ChartCard 
        title="Onboarding Funnel" 
        subtitle="Progression & drop-off"
        rightSlot={
          <div className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
            {formatPct(funnel.totalConversionRate)} overall conversion
          </div>
        }
      >
        <FunnelBars steps={funnel.steps} totalConversionRate={funnel.totalConversionRate} />
      </ChartCard>

      {/* Average Time per Step */}
      <ChartCard 
        title="Average Time per Step" 
        subtitle="Mean time to progress"
      >
        <StepTimeTable steps={funnel.steps} />
      </ChartCard>

      {/* Activity Timeline */}
      <ChartCard 
        title="Activity Timeline" 
        subtitle="User & Cohort"
      >
        <ActivityTimeline 
          userEvents={userEvents} 
          cohortBuckets={cohortBuckets} 
          onSearchUser={handleSearchUser} 
        />
      </ChartCard>
    </div>
  )
}