import type { UsageKpis } from "../../lib/mock";
import { formatNum } from "../../lib/format";

type Props = {
  kpis: UsageKpis;
};

export function UsageKPIs({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {/* Total Uploads */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Uploads</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNum(kpis.totalUploads)}
            </p>
          </div>
        </div>
      </div>

      {/* Avg Uploads per User */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Uploads / User</p>
            <p className="text-2xl font-bold text-gray-900">
              {kpis.avgUploadsPerUser.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* DAU */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">DAU</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNum(kpis.dau)}
            </p>
          </div>
        </div>
      </div>

      {/* WAU / MAU */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">WAU / MAU</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNum(kpis.wau)} / {formatNum(kpis.mau)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
