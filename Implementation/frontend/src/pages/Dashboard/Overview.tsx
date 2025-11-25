import { useState } from 'react'
import StatCard from '../../components/ui/StatCard'
import ChartCard from '../../components/ui/ChartCard'
import DailySignupsLine from '../../components/charts/DailySignupsLine'
import UploadTrendsBar from '../../components/charts/UploadTrendsBar'
import NotificationsList from '../../components/notifications/NotificationsList'
import DateFilter, { type DateRange } from '../../components/ui/DateFilter'
import { useOverviewData } from '../../hooks/useOverviewData'
import { formatTrend, formatNum } from '../../lib/format'
import type { Granularity } from '../../lib/dateUtils'

export default function Overview() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 6) // Last 7 days
    return { start, end }
  })
  const [granularity, setGranularity] = useState<Granularity>('D')

  // Fetch all data using custom hook
  const { metrics, signups, uploads, notifications, isLoading, error } = useOverviewData(
    dateRange,
    granularity
  )

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange)
  }

  const handleGranularityChange = (newGranularity: Granularity) => {
    setGranularity(newGranularity)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Overview</h1>
        <DateFilter
          value={dateRange}
          onChange={handleDateRangeChange}
          granularity={granularity}
          onGranularityChange={handleGranularityChange}
        />
      </div>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={metrics ? formatNum(metrics.totalUsers.current) : '—'}
          trend={metrics ? formatTrend(metrics.totalUsers.change) : undefined}
          variant={
            metrics && metrics.totalUsers.change > 0
              ? 'good'
              : metrics && metrics.totalUsers.change < 0
              ? 'bad'
              : 'default'
          }
        />
        <StatCard
          title="Total Uploads"
          value={metrics ? formatNum(metrics.totalUploads.current) : '—'}
          trend={metrics ? formatTrend(metrics.totalUploads.change) : undefined}
          variant={
            metrics && metrics.totalUploads.change > 0
              ? 'good'
              : metrics && metrics.totalUploads.change < 0
              ? 'bad'
              : 'default'
          }
        />
        <StatCard
          title="Paying Users"
          value={metrics ? formatNum(metrics.payingUsers.current) : '—'}
          trend={metrics ? formatTrend(metrics.payingUsers.change) : undefined}
          variant={
            metrics && metrics.payingUsers.change > 0
              ? 'good'
              : metrics && metrics.payingUsers.change < 0
              ? 'bad'
              : 'default'
          }
        />
      </div>

      {/* Row 2: Line chart + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[380px]">
          <ChartCard title="Daily Signups" subtitle="Unique user registrations">
            {error ? (
              <div className="text-sm text-red-600">Failed to load data: {error.message}</div>
            ) : isLoading ? (
              <div className="h-[300px] rounded-md bg-gray-100 animate-pulse" />
            ) : (
              <DailySignupsLine data={signups ?? []} height={300} />
            )}
          </ChartCard>
        </div>
        <div className="lg:col-span-1 h-[380px]">
          <ChartCard title="Notifications">
            {isLoading ? (
              <div className="h-[300px] rounded-md bg-gray-100 animate-pulse" />
            ) : (
              <div className="h-[300px] overflow-auto pr-1">
                <NotificationsList items={notifications ?? []} />
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Row 3: Upload trends bar */}
      <ChartCard title="Upload Trends" subtitle="Recent activity volume">
        {isLoading ? (
          <div className="h-[300px] rounded-md bg-gray-100 animate-pulse" />
        ) : (
          <UploadTrendsBar data={uploads ?? []} height={300} />
        )}
      </ChartCard>
    </div>
  )
}


