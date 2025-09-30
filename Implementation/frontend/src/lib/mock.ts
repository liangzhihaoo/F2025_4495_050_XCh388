export function mockTimeSeries(daysOrPoints: number, key = 'value') {
  const out: { date: string; [k: string]: number }[] = []
  const now = new Date()
  for (let i = daysOrPoints - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const date = d.toISOString().slice(0, 10)
    const base = 50 + Math.sin(i / 3) * 15
    const jitter = Math.floor(Math.random() * 20)
    out.push({ date, [key]: Math.max(0, Math.round(base + jitter)) })
  }
  return out
}

export function mockBarSeries(labels: string[], key = 'value') {
  return labels.map((label, idx) => {
    const base = 200 + Math.cos(idx / 2) * 50
    const jitter = Math.floor(Math.random() * 60)
    return { label, [key]: Math.max(0, Math.round(base + jitter)) }
  })
}

export type Notification = {
  id: string
  ts: string
  title: string
  body?: string
  severity?: 'info' | 'warn' | 'error'
}

export function mockNotifications(n: number): Notification[] {
  const severities: Notification['severity'][] = ['info', 'warn', 'error']
  const now = Date.now()
  return Array.from({ length: n }).map((_, i) => {
    const ts = new Date(now - i * 1000 * 60 * (15 + Math.floor(Math.random() * 60)))
      .toISOString()
    const severity = severities[i % severities.length]
    return {
      id: `n_${i}_${Math.random().toString(36).slice(2, 6)}`,
      ts,
      title: severity === 'error' ? 'Upload failed' : severity === 'warn' ? 'High usage detected' : 'New signup',
      body:
        severity === 'error'
          ? 'An error occurred while processing an upload job.'
          : severity === 'warn'
          ? 'Traffic spike observed. Monitoring closely.'
          : 'A new user joined the platform.',
      severity,
    }
  })
}


