import type { Notification } from '../../lib/mock'

type Props = { items: Notification[] }

function formatRelative(iso: string) {
  const ts = new Date(iso).getTime()
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function NotificationsList({ items }: Props) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">No notifications.</div>
  }

  return (
    <div className="space-y-3">
      {items.map((n) => {
        const color = n.severity === 'error' ? 'red' : n.severity === 'warn' ? 'amber' : 'gray'
        const badge = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${color}-50 text-${color}-700`
        return (
          <article key={n.id} role="article" aria-labelledby={`notif-${n.id}`} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 id={`notif-${n.id}`} className="text-sm font-medium text-gray-900 truncate">
                  {n.title}
                </h4>
                {n.body && <p className="text-sm text-gray-600 mt-0.5">{n.body}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={badge}>{n.severity || 'info'}</span>
                <time className="text-xs text-gray-500" dateTime={n.ts} aria-label={new Date(n.ts).toLocaleString()}>
                  {formatRelative(n.ts)}
                </time>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}


