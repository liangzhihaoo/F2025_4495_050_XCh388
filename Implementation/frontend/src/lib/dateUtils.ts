import type { DateRange } from '../components/ui/DateFilter'

export type Granularity = 'D' | 'W' | 'M'

/**
 * Calculate the previous period with the same duration as the current period
 * Example: current = Nov 18-24 (7 days) → previous = Nov 11-17 (7 days)
 */
export function calculatePreviousPeriod(dateRange: DateRange): DateRange {
  const duration = dateRange.end.getTime() - dateRange.start.getTime()
  return {
    start: new Date(dateRange.start.getTime() - duration),
    end: dateRange.start, // Previous period ends where current starts
  }
}

/**
 * Calculate percentage change between current and previous values
 * Handles division by zero edge case
 */
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) {
    // If previous is 0 and current > 0, treat as 100% increase
    // If both are 0, treat as 0% change
    return current > 0 ? 1.0 : 0
  }
  return (current - previous) / previous
}

/**
 * Format a date into a key string based on granularity
 * Used for grouping records by date
 */
export function formatDateKey(date: Date, granularity: Granularity): string {
  if (granularity === 'D') {
    return date.toISOString().slice(0, 10) // YYYY-MM-DD
  } else if (granularity === 'M') {
    return date.toISOString().slice(0, 7) // YYYY-MM
  } else {
    // Weekly - return start of week (ISO date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay()) // Move to Sunday
    return weekStart.toISOString().slice(0, 10)
  }
}

/**
 * Format a date into a human-readable label based on granularity
 * Daily: 'Nov 18', Weekly: 'Nov 18-24', Monthly: 'Nov 2024'
 */
export function formatDateLabel(
  date: Date,
  granularity: Granularity,
  endDate?: Date
): string {
  if (granularity === 'D') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } else if (granularity === 'M') {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } else {
    // Weekly - show range like 'Nov 18-24'
    if (endDate) {
      const startStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      const endStr = endDate.toLocaleDateString('en-US', { day: 'numeric' })
      return `${startStr}-${endStr}`
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

/**
 * Group an array of records by date based on a field and granularity
 * Returns a Map with date keys and counts
 */
export function groupByDate<T extends Record<string, any>>(
  records: T[],
  field: string,
  granularity: Granularity
): Map<string, number> {
  const map = new Map<string, number>()

  for (const record of records) {
    const dateStr = record[field]
    if (!dateStr) continue

    const date = new Date(dateStr)
    const key = formatDateKey(date, granularity)

    map.set(key, (map.get(key) || 0) + 1)
  }

  return map
}

/**
 * Generate all date labels for a given date range and granularity
 * Fills in gaps to ensure continuous timeline
 */
export function generateDateLabels(
  dateRange: DateRange,
  granularity: Granularity
): string[] {
  const labels: string[] = []
  const current = new Date(dateRange.start)
  const end = new Date(dateRange.end)

  if (granularity === 'D') {
    while (current <= end) {
      labels.push(current.toISOString().slice(0, 10))
      current.setDate(current.getDate() + 1)
    }
  } else if (granularity === 'W') {
    while (current <= end) {
      labels.push(formatDateKey(current, 'W'))
      current.setDate(current.getDate() + 7)
    }
  } else {
    // Monthly
    while (current <= end) {
      labels.push(current.toISOString().slice(0, 7))
      current.setMonth(current.getMonth() + 1)
    }
  }

  return labels
}

/**
 * Get the end date of a week starting from a given date
 */
export function getWeekEnd(startDate: Date): Date {
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  return endDate
}
