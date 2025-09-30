import type { ReactNode } from 'react'

export type ChartCardProps = {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
  children: ReactNode
}

export default function ChartCard({ title, subtitle, rightSlot, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}


