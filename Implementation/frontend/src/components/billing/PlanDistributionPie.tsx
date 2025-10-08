import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { PlanBucket } from "../../lib/mock";
import { formatCurrency } from "../../lib/format";

type Props = {
  buckets: PlanBucket[];
};

const COLORS = {
  "Client Plus": "#3B82F6", // blue-500
  "Enterprise": "#10B981",  // emerald-500
  "Free": "#6B7280",        // gray-500
};

export function PlanDistributionPie({ buckets }: Props) {
  // Filter out Free plan from pie chart data
  const pieData = buckets
    .filter(bucket => bucket.plan !== "Free")
    .map(bucket => ({
      name: bucket.plan,
      value: bucket.subscribers,
      mrr: bucket.mrr,
    }));

  const freeBucket = buckets.find(bucket => bucket.plan === "Free");

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
      
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} subscribers`,
                  name
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
              {pieData.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[plan.name as keyof typeof COLORS] }}
                    />
                    <span className="font-medium text-gray-900">{plan.name}</span>
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
              ))}
            </div>

            {/* Free Plan (separate section) */}
            {freeBucket && (
              <div className="border-t pt-3">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS.Free }}
                    />
                    <span className="font-medium text-gray-600">{freeBucket.plan}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">
                      {freeBucket.subscribers.toLocaleString()} subscribers
                    </div>
                    <div className="text-xs text-gray-500">
                      No revenue
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
