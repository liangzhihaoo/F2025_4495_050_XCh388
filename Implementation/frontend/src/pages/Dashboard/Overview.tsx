import { useEffect, useMemo, useState } from 'react'
import StatCard from '../../components/ui/StatCard'
import ChartCard from '../../components/ui/ChartCard'
import DailySignupsLine from '../../components/charts/DailySignupsLine'
import UploadTrendsBar from '../../components/charts/UploadTrendsBar'
import NotificationsList from '../../components/notifications/NotificationsList'
import { mockBarSeries, mockNotifications, mockTimeSeries } from '../../lib/mock'

type DateRange = '7d' | '30d' | '90d'
type Granularity = 'D' | 'W' | 'M'

export default function Overview() {
  const [dateRange, setDateRange] = useState<DateRange>('7d')
  const [granularity, setGranularity] = useState<Granularity>('D')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // dev toggles
  const devEmptyNotifications = false

  const rangeToPoints = (range: DateRange) => (range === '7d' ? 7 : range === '30d' ? 30 : 90)

  const signupsData = useMemo<{ date: string; signups: number }[]>(() => {
    const points = rangeToPoints(dateRange)
    const base = mockTimeSeries(points, 'signups').map((p) => ({ date: p.date, signups: (p as any)['signups'] as number }))
    if (granularity === 'D') return base
    // naive downsample: group every 7 days for W, 30 for M
    const groupSize = granularity === 'W' ? 7 : 30
    const grouped: { date: string; signups: number }[] = []
    for (let i = 0; i < base.length; i += groupSize) {
      const chunk = base.slice(i, i + groupSize)
      const sum = chunk.reduce((s, p) => s + p.signups, 0)
      grouped.push({ date: chunk[0]?.date ?? String(i), signups: Math.round(sum) })
    }
    return grouped
  }, [dateRange, granularity])

  const uploadsBarData = useMemo(() => {
    // last 6 weeks labels (W1..W6) or months (M1..M6) - simple labels
    const labels = ['1', '2', '3', '4', '5', '6'].map((n) => (dateRange === '7d' ? `W${n}` : `M${n}`))
    return mockBarSeries(labels, 'uploads') as { label: string; uploads: number }[]
  }, [dateRange])

  const notifications = useMemo(() => (devEmptyNotifications ? [] : mockNotifications(7)), [devEmptyNotifications])

  useEffect(() => {
    setLoading(true)
    setError(null)
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [dateRange, granularity])

  const rightFilters = (
    <div className="flex items-center gap-2">
      <select
        className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value as DateRange)}
        aria-label="Date range"
      >
        <option value="7d">Last 7d</option>
        <option value="30d">Last 30d</option>
        <option value="90d">Last 90d</option>
      </select>
      <select
        className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={granularity}
        onChange={(e) => setGranularity(e.target.value as Granularity)}
        aria-label="Granularity"
      >
        <option value="D">D</option>
        <option value="W">W</option>
        <option value="M">M</option>
      </select>
    </div>
  )

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Overview</h1>

      {/* Row 1: KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Users" value="12,543" trend="+8%" variant="good" />
        <StatCard title="Total Uploads" value="45,892" trend="+3%" variant="good" />
        <StatCard title="Subscription Health" value="94.2%" trend="-2%" variant="bad" />
      </div>

      {/* Row 2: Line chart + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[380px]">
          <ChartCard title="Daily Signups" subtitle="Unique user registrations" rightSlot={rightFilters}>
            {error ? (
              <div className="text-sm text-red-600">Failed to load data.</div>
            ) : loading ? (
              <div className="h-[300px] rounded-md bg-gray-100 animate-pulse" />
            ) : (
              <DailySignupsLine data={signupsData} height={300} />
            )}
          </ChartCard>
        </div>
        <div className="lg:col-span-1 h-[380px]">
          <ChartCard title="Notifications">
            {loading ? (
              <div className="h-[300px] rounded-md bg-gray-100 animate-pulse" />
            ) : (
              <div className="h-[300px] overflow-auto pr-1">
                <NotificationsList items={notifications} />
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Row 3: Upload trends bar */}
      <ChartCard title="Upload Trends" subtitle="Recent activity volume">
        {loading ? (
          <div className="h-[300px] rounded-md bg-gray-100 animate-pulse" />
        ) : (
          <UploadTrendsBar data={uploadsBarData} height={300} />
        )}
      </ChartCard>
    </div>
  )
}


