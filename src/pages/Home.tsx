import { Link } from 'react-router-dom';
import { Truck, Clock, Route, CheckCircle, Plus } from 'lucide-react';
import { useFreightStore } from '@/store/useFreightStore';
import { FreightStatus, STATUS_LABEL } from '@/types';
import StatusTag from '@/components/StatusTag';
import { formatDateTime, formatMoney } from '@/utils/storage';

const statCards = [
  {
    key: FreightStatus.PENDING,
    label: '待调度',
    icon: Clock,
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100'
  },
  {
    key: FreightStatus.DISPATCHED,
    label: '已调度',
    icon: Truck,
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100'
  },
  {
    key: FreightStatus.IN_TRANSIT,
    label: '运输中',
    icon: Route,
    color: 'from-purple-500 to-fuchsia-500',
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100'
  },
  {
    key: FreightStatus.DELIVERED,
    label: '已送达',
    icon: CheckCircle,
    color: 'from-emerald-500 to-green-500',
    bg: 'bg-green-50',
    iconBg: 'bg-green-100'
  }
];

export default function Home() {
  const getStatusCounts = useFreightStore(s => s.getStatusCounts);
  const getVehicleById = useFreightStore(s => s.getVehicleById);
  const getDriverById = useFreightStore(s => s.getDriverById);
  const searchOrders = useFreightStore(s => s.searchOrders);

  const counts = getStatusCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const recentOrders = searchOrders('').slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">欢迎回来，调度员 👋</h1>
          <p className="text-slate-500 mt-1 text-sm">
            今日共 {total} 票运单，以下是数据概览
          </p>
        </div>
        <Link
          to="/freight/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          <Plus size={16} />
          新建运单
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(card => (
          <div
            key={card.key}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {counts[card.key]}
                </p>
              </div>
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                <card.icon size={22} className={`bg-gradient-to-br ${card.color} bg-clip-text`} style={{ color: 'transparent' }} />
                <card.icon size={22} className={`text-slate-700`} />
              </div>
            </div>
            <div className={`h-1 w-full rounded-full mt-4 bg-gradient-to-r ${card.color}`} />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">最近运单</h3>
          <Link to="/freight" className="text-sm text-blue-600 hover:text-blue-700">
            查看全部 →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs bg-slate-50">
                <th className="px-6 py-3 text-left font-medium">运单号</th>
                <th className="px-6 py-3 text-left font-medium">客户</th>
                <th className="px-6 py-3 text-left font-medium">路线</th>
                <th className="px-6 py-3 text-left font-medium">车辆/司机</th>
                <th className="px-6 py-3 text-left font-medium">状态</th>
                <th className="px-6 py-3 text-left font-medium">费用</th>
                <th className="px-6 py-3 text-left font-medium">更新时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map(o => {
                const v = getVehicleById(o.vehicleId);
                const d = getDriverById(o.driverId);
                return (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{o.orderNo}</td>
                    <td className="px-6 py-4 text-slate-700">{o.customer}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="text-slate-700">{o.origin}</span>
                      <span className="mx-2 text-slate-400">→</span>
                      <span className="text-slate-700">{o.destination}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {v && d ? (
                        <div>
                          <div className="text-slate-700">{v.plateNumber}</div>
                          <div className="text-xs text-slate-500">{d.name}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">未分配</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusTag status={o.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {formatMoney(o.estimatedFee)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {formatDateTime(o.updatedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
