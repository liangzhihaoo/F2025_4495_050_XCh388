import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { PlanBucket } from "../../lib/mock";
import { formatCurrency } from "../../lib/format";

type Props = {
  buckets: PlanBucket[];
};

// Vibrant color palette for pie chart segments
const COLORS = [
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#F59E0B", // amber-500
  "#10B981", // emerald-500
  "#3B82F6", // blue-500
  "#EF4444", // red-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
];

const FREE_COLOR = "#6B7280"; // gray-500

// Get color for a plan - Free always gets gray, others get vibrant colors
const getColor = (planName: string, index: number, nonFreeIndex: number) => {
  if (planName === "Free") return FREE_COLOR;
  return COLORS[nonFreeIndex % COLORS.length];
};

export function PlanDistributionPie({ buckets }: Props) {
  // Filter out Free plan from pie chart data
  const pieData = buckets.map((bucket) => ({
    name: bucket.plan,
    value: bucket.subscribers,
    mrr: bucket.mrr,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Plan Distribution
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Pie Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => {
                  const nonFreeIndex = pieData
                    .slice(0, index)
                    .filter((p) => p.name !== "Free").length;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColor(entry.name, index, nonFreeIndex)}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} subscribers`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="flex-1">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Plan Details</h4>

            {/* Paying Plans Table */}
            <div className="space-y-2">
              {pieData.map((plan, index) => {
                const nonFreeIndex = pieData
                  .slice(0, index)
                  .filter((p) => p.name !== "Free").length;
                return (
                  <div
                    key={plan.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getColor(
                            plan.name,
                            index,
                            nonFreeIndex
                          ),
                        }}
                      />
                      <span className="font-medium text-gray-900">
                        {plan.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {plan.value.toLocaleString()} subscribers
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(plan.mrr)} MRR
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
