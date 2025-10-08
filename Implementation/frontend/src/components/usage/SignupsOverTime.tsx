import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { UsagePoint } from "../../lib/mock";
import { formatNum } from "../../lib/format";

type Props = {
  data: UsagePoint[];
  height?: number;
};

export function SignupsOverTime({ data, height = 300 }: Props) {
  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatXAxisLabel}
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          tickFormatter={(value) => formatNum(value)}
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip 
          labelFormatter={formatTooltipLabel}
          formatter={(value: number) => [formatNum(value), 'Signups']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
