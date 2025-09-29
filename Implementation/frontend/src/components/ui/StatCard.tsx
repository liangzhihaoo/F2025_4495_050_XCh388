export type StatCardProps = {
  title: string
  value: string | number
  trend?: string
  variant?: 'default' | 'good' | 'bad'
}

export default function StatCard({ title, value, trend, variant = 'default' }: StatCardProps) {
  const trendClass =
    variant === 'good'
      ? 'bg-green-50 text-green-700'
      : variant === 'bad'
      ? 'bg-red-50 text-red-700'
      : 'bg-gray-50 text-gray-600'

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {trend !== undefined && trend !== '' && (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${trendClass}`}>
          {trend}
        </span>
      )}
    </div>
  )
}


