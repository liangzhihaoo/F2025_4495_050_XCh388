import type { BillingKpis } from "../../lib/mock";
import { formatCurrency, formatPct } from "../../lib/format";

type Props = {
  kpis: BillingKpis;
};

export function BillingKPIs({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {/* MRR */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">MRR</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(kpis.mrr)}
            </p>
          </div>
        </div>
      </div>

      {/* ARR */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">ARR</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(kpis.arr)}
            </p>
          </div>
        </div>
      </div>

      {/* Active Subscribers */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
            <p className="text-2xl font-bold text-gray-900">
              {kpis.activeSubscribers.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ARPU */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">ARPU</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(kpis.arpu)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Churn 30d: {formatPct(kpis.churnRate30d)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
