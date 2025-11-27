import { useQuery } from '@tanstack/react-query'
import type { DateRange } from '../components/ui/DateFilter'
import type { Granularity } from '../lib/dateUtils'
import {
  fetchOverviewMetrics,
  fetchDailySignups,
  fetchUploadTrends,
  fetchRecentNotifications,
  type OverviewMetrics,
  type DailySignupsPoint,
  type UploadTrendsPoint,
  type NotificationItem,
} from '../services/overview'

/**
 * Custom hook to fetch all Overview dashboard data
 * Orchestrates multiple React Query hooks in parallel
 */
export function useOverviewData(dateRange: DateRange, granularity: Granularity) {
  // Query 1: Overview metrics (Total Users, Total Uploads, Paying Users)
  const metricsQuery = useQuery<OverviewMetrics>({
    queryKey: [
      'overview',
      'metrics',
      {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
      },
    ],
    queryFn: () => fetchOverviewMetrics(dateRange),
    staleTime: 60_000, // 1 minute
    placeholderData: (prev) => prev, // Keep previous data while refetching
  })

  // Query 2: Daily signups time series
  const signupsQuery = useQuery<DailySignupsPoint[]>({
    queryKey: [
      'overview',
      'signups',
      {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
        granularity,
      },
    ],
    queryFn: () => fetchDailySignups(dateRange, granularity),
    staleTime: 60_000, // 1 minute
    placeholderData: (prev) => prev,
  })

  // Query 3: Upload trends time series
  const uploadsQuery = useQuery<UploadTrendsPoint[]>({
    queryKey: [
      'overview',
      'uploads',
      {
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
        granularity,
      },
    ],
    queryFn: () => fetchUploadTrends(dateRange, granularity),
    staleTime: 60_000, // 1 minute
    placeholderData: (prev) => prev,
  })

  // Query 4: Recent notifications
  const notificationsQuery = useQuery<NotificationItem[]>({
    queryKey: ['overview', 'notifications', { limit: 7 }],
    queryFn: () => fetchRecentNotifications(7),
    staleTime: 30_000, // 30 seconds (more frequent updates)
  })

  // Aggregate loading state
  const isLoading =
    metricsQuery.isLoading ||
    signupsQuery.isLoading ||
    uploadsQuery.isLoading ||
    notificationsQuery.isLoading

  // Aggregate error state
  const isError = !!(
    metricsQuery.error ||
    signupsQuery.error ||
    uploadsQuery.error ||
    notificationsQuery.error
  )

  // Get first error if any
  const error =
    metricsQuery.error ||
    signupsQuery.error ||
    uploadsQuery.error ||
    notificationsQuery.error

  return {
    metrics: metricsQuery.data,
    signups: signupsQuery.data,
    uploads: uploadsQuery.data,
    notifications: notificationsQuery.data,
    isLoading,
    isError,
    error,
  }
}
