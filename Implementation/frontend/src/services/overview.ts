import supabase from '../lib/supabaseClient'
import type { DateRange } from '../components/ui/DateFilter'
import {
  calculatePreviousPeriod,
  calculatePercentChange,
  groupByDate,
  generateDateLabels,
  formatDateLabel,
  getWeekEnd,
  type Granularity,
} from '../lib/dateUtils'

// Type Definitions
export type MetricValue = {
  current: number
  previous: number
  change: number // decimal (e.g., 0.08 = 8%)
}

export type OverviewMetrics = {
  totalUsers: MetricValue
  totalUploads: MetricValue
  payingUsers: MetricValue
}

export type DailySignupsPoint = {
  date: string // 'YYYY-MM-DD'
  signups: number
}

export type UploadTrendsPoint = {
  label: string // Date-based: 'Nov 18', 'Nov 18-24', 'Nov 2024'
  uploads: number
}

export type NotificationItem = {
  id: string
  ts: string // ISO timestamp
  title: string
  body?: string
  severity?: 'info' | 'warn' | 'error'
}

// Helper Functions

/**
 * Count users in a date range
 */
async function countUsers(start: Date, end: Date): Promise<number> {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())

  if (error) {
    console.error('Failed to count users:', error.message)
    throw error
  }

  return count ?? 0
}

/**
 * Count products (uploads) in a date range
 */
async function countProducts(start: Date, end: Date): Promise<number> {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())

  if (error) {
    console.error('Failed to count products:', error.message)
    throw error
  }

  return count ?? 0
}

/**
 * Count paying users (plan != 'Free' and not null) in a date range
 */
async function countPayingUsers(start: Date, end: Date): Promise<number> {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())
    .not('plan', 'ilike', 'free') // Case-insensitive
    .not('plan', 'is', null)

  if (error) {
    console.error('Failed to count paying users:', error.message)
    throw error
  }

  return count ?? 0
}

// Main Service Functions

/**
 * Fetch overview metrics (Total Users, Total Uploads, Paying Users)
 * with current vs. previous period comparison
 */
export async function fetchOverviewMetrics(
  dateRange: DateRange
): Promise<OverviewMetrics> {
  const current = dateRange
  const previous = calculatePreviousPeriod(dateRange)

  // Execute all 6 queries in parallel
  const [
    currentUsers,
    previousUsers,
    currentUploads,
    previousUploads,
    currentPaying,
    previousPaying,
  ] = await Promise.all([
    countUsers(current.start, current.end),
    countUsers(previous.start, previous.end),
    countProducts(current.start, current.end),
    countProducts(previous.start, previous.end),
    countPayingUsers(current.start, current.end),
    countPayingUsers(previous.start, previous.end),
  ])

  return {
    totalUsers: {
      current: currentUsers,
      previous: previousUsers,
      change: calculatePercentChange(currentUsers, previousUsers),
    },
    totalUploads: {
      current: currentUploads,
      previous: previousUploads,
      change: calculatePercentChange(currentUploads, previousUploads),
    },
    payingUsers: {
      current: currentPaying,
      previous: previousPaying,
      change: calculatePercentChange(currentPaying, previousPaying),
    },
  }
}

/**
 * Fetch daily signups data for line chart
 * Groups users by date and fills gaps with zeros
 */
export async function fetchDailySignups(
  dateRange: DateRange,
  granularity: Granularity
): Promise<DailySignupsPoint[]> {
  const { data, error } = await supabase
    .from('users')
    .select('created_at')
    .gte('created_at', dateRange.start.toISOString())
    .lte('created_at', dateRange.end.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch daily signups:', error.message)
    throw error
  }

  // Group by date
  const grouped = groupByDate(data ?? [], 'created_at', granularity)

  // Generate all date labels in range (fill gaps with zeros)
  const labels = generateDateLabels(dateRange, granularity)

  // Map to chart format
  return labels.map((date) => ({
    date,
    signups: grouped.get(date) ?? 0,
  }))
}

/**
 * Fetch upload trends data for bar chart
 * Groups products by date with human-readable labels
 */
export async function fetchUploadTrends(
  dateRange: DateRange,
  granularity: Granularity
): Promise<UploadTrendsPoint[]> {
  const { data, error } = await supabase
    .from('products')
    .select('created_at')
    .gte('created_at', dateRange.start.toISOString())
    .lte('created_at', dateRange.end.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch upload trends:', error.message)
    throw error
  }

  // Group by date
  const grouped = groupByDate(data ?? [], 'created_at', granularity)

  // Generate labels and map to chart format
  const labels = generateDateLabels(dateRange, granularity)

  return labels.map((dateKey) => {
    const date = new Date(dateKey)
    let label: string

    if (granularity === 'D') {
      label = formatDateLabel(date, 'D')
    } else if (granularity === 'M') {
      label = formatDateLabel(date, 'M')
    } else {
      // Weekly - show range
      const weekEnd = getWeekEnd(date)
      label = formatDateLabel(date, 'W', weekEnd)
    }

    return {
      label,
      uploads: grouped.get(dateKey) ?? 0,
    }
  })
}

/**
 * Fetch recent notifications
 * Maps database schema to component format
 */
export async function fetchRecentNotifications(
  limit: number = 7
): Promise<NotificationItem[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, message, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch notifications:', error.message)
    throw error
  }

  return (data ?? []).map((n) => ({
    id: n.id,
    ts: n.created_at,
    title: n.title,
    body: n.message ?? undefined,
    severity: n.type as 'info' | 'warn' | 'error',
  }))
}
