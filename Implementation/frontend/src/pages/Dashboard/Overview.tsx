import { useEffect, useMemo, useState } from 'react'
import StatCard from '../../components/ui/StatCard'
import ChartCard from '../../components/ui/ChartCard'
import DailySignupsLine from '../../components/charts/DailySignupsLine'
import UploadTrendsBar from '../../components/charts/UploadTrendsBar'
import NotificationsList from '../../components/notifications/NotificationsList'
import DateFilter, { type DateRange } from '../../components/ui/DateFilter'
import { mockBarSeries, mockNotifications, mockTimeSeries } from '../../lib/mock'

type Granularity = 'D' | 'W' | 'M'

export default function Overview() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 6) // Last 7 days
    return { start, end }
  })
  const [granularity, setGranularity] = useState<Granularity>('D')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // dev toggles
  const devEmptyNotifications = false

  const getDateRangePoints = (range: DateRange) => {
    const diffTime = range.end.getTime() - range.start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return Math.max(1, diffDays)
  }

  const signupsData = useMemo<{ date: string; signups: number }[]>(() => {
    const points = getDateRangePoints(dateRange)
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
    // Generate labels based on granularity and date range
    const points = getDateRangePoints(dateRange)
    const labels = Array.from({ length: Math.min(6, points) }, (_, i) => {
      if (granularity === 'D') return `D${i + 1}`
      if (granularity === 'W') return `W${i + 1}`
      return `M${i + 1}`
    })
    return mockBarSeries(labels, 'uploads') as { label: string; uploads: number }[]
  }, [dateRange, granularity])

  const notifications = useMemo(() => (devEmptyNotifications ? [] : mockNotifications(7)), [devEmptyNotifications])

  // Paying users metric - will be replaced with backend data when ready
  // TODO: Replace with actual API call when backend endpoint is ready
  // const { data: payingUsersData } = useQuery({
  //   queryKey: ['payingUsers'],
  //   queryFn: () => fetchPayingUsersCount(),
  // });
  const payingUsers = useMemo(() => {
    // Temporary mock data - replace with: payingUsersData?.count ?? 0
    return 8234;
  }, []);

  useEffect(() => {
    setLoading(true)
    setError(null)
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [dateRange, granularity])

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
        <StatCard title="Total Users" value="12,543" trend="+8%" variant="good" />
        <StatCard title="Total Uploads" value="45,892" trend="+3%" variant="good" />
        <StatCard 
          title="Paying Users" 
          value={payingUsers.toLocaleString()} 
          trend="+5%" 
          variant="good" 
        />
      </div>

      {/* Row 2: Line chart + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[380px]">
          <ChartCard title="Daily Signups" subtitle="Unique user registrations">
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


