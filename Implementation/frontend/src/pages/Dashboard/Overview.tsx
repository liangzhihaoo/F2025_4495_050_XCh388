import StatCard from '../../components/ui/StatCard'

export default function Overview() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Users" value="12,543" trend="+8%" variant="good" />
        <StatCard title="Total Uploads" value="45,892" trend="+3%" variant="good" />
        <StatCard title="Subscription Health" value="94.2%" trend="-2%" variant="bad" />
      </div>
    </div>
  )
}


