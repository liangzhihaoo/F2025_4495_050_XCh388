import { useState, useMemo } from "react";
import { 
  mockUsageSeries, 
  mockSignupsSeries, 
  mockActiveUsersSeries, 
  mockUsageKpis,
  mockQuotaList
} from "../../lib/mock";
import type { 
  UsagePoint, 
  UserQuotaRow
} from "../../lib/mock";
import { UsageFilters } from "../../components/usage/UsageFilters";
import type { FiltersValue } from "../../components/usage/UsageFilters";
import { UsageKPIs } from "../../components/usage/UsageKPIs";
import { UploadsOverTime } from "../../components/usage/UploadsOverTime";
import { SignupsOverTime } from "../../components/usage/SignupsOverTime";
import { ActiveUsersLine } from "../../components/usage/ActiveUsersLine";
import { QuotaList } from "../../components/usage/QuotaList";
import ChartCard from "../../components/ui/ChartCard";

// Helper function to downsample data based on granularity
function downsampleData(data: UsagePoint[], granularity: "D" | "W" | "M"): UsagePoint[] {
  if (granularity === "D") return data;
  
  if (granularity === "W") {
    const weekly: UsagePoint[] = [];
    for (let i = 0; i < data.length; i += 7) {
      const weekData = data.slice(i, i + 7);
      if (weekData.length > 0) {
        const avgValue = weekData.reduce((sum, point) => sum + point.value, 0) / weekData.length;
        weekly.push({
          date: weekData[0].date,
          value: Math.round(avgValue)
        });
      }
    }
    return weekly;
  }
  
  if (granularity === "M") {
    const monthly: UsagePoint[] = [];
    for (let i = 0; i < data.length; i += 30) {
      const monthData = data.slice(i, i + 30);
      if (monthData.length > 0) {
        const avgValue = monthData.reduce((sum, point) => sum + point.value, 0) / monthData.length;
        monthly.push({
          date: monthData[0].date,
          value: Math.round(avgValue)
        });
      }
    }
    return monthly;
  }
  
  return data;
}

export default function Usage() {
  // Local state
  const [filters, setFilters] = useState<FiltersValue>({
    range: "30d",
    granularity: "D",
    plan: "all",
    q: "",
  });

  // Generate series based on date range
  const getDaysFromRange = (range: string) => {
    switch (range) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      default: return 30;
    }
  };

  const days = getDaysFromRange(filters.range);
  
  const [uploadsSeries, setUploadsSeries] = useState<UsagePoint[]>(() => mockUsageSeries(days));
  const [signupsSeries, setSignupsSeries] = useState<UsagePoint[]>(() => mockSignupsSeries(days));
  const [activeSeries, setActiveSeries] = useState<UsagePoint[]>(() => mockActiveUsersSeries(days));
  const [quotaRows] = useState<UserQuotaRow[]>(() => mockQuotaList(30));

  // Update series when range changes
  useMemo(() => {
    const newDays = getDaysFromRange(filters.range);
    setUploadsSeries(mockUsageSeries(newDays));
    setSignupsSeries(mockSignupsSeries(newDays));
    setActiveSeries(mockActiveUsersSeries(newDays));
  }, [filters.range]);

  // Downsample data based on granularity
  const downsampledUploads = useMemo(() => 
    downsampleData(uploadsSeries, filters.granularity), 
    [uploadsSeries, filters.granularity]
  );
  
  const downsampledSignups = useMemo(() => 
    downsampleData(signupsSeries, filters.granularity), 
    [signupsSeries, filters.granularity]
  );
  
  const downsampledActive = useMemo(() => 
    downsampleData(activeSeries, filters.granularity), 
    [activeSeries, filters.granularity]
  );

  // Calculate KPIs
  const kpis = useMemo(() => 
    mockUsageKpis(uploadsSeries, signupsSeries, activeSeries), 
    [uploadsSeries, signupsSeries, activeSeries]
  );

  // Filter quota rows
  const visibleRows = useMemo(() => {
    return quotaRows.filter((row) => {
      // Plan filter
      if (filters.plan !== "all" && row.plan !== filters.plan) {
        return false;
      }

      // Search filter
      if (filters.q && !row.email.toLowerCase().includes(filters.q.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [quotaRows, filters.plan, filters.q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usage Analytics</h1>
        <p className="text-gray-600">Monitor platform usage trends and capacity signals</p>
      </div>

      {/* Filters */}
      <UsageFilters value={filters} onChange={setFilters} />

      {/* KPIs */}
      <UsageKPIs kpis={kpis} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uploads Over Time */}
        <ChartCard title="Total Uploads Over Time">
          <UploadsOverTime data={downsampledUploads} />
        </ChartCard>

        {/* Signups Over Time */}
        <ChartCard title="New Signups Over Time">
          <SignupsOverTime data={downsampledSignups} />
        </ChartCard>

        {/* Active Users Trend */}
        <ChartCard title="Active Users Trend (DAU Approx)">
          <ActiveUsersLine data={downsampledActive} />
        </ChartCard>

        {/* Users Near Quota */}
        <ChartCard title="Users Near Quota">
          <QuotaList filters={{ plan: filters.plan, q: filters.q }} />
        </ChartCard>
      </div>
    </div>
  );
}