import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, UserCog, PlayCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useFreightStore } from '@/store/useFreightStore';
import { FreightStatus, STATUS_ACTION_LABEL, STATUS_FLOW, STATUS_LABEL } from '@/types';
import StatusTag from '@/components/StatusTag';
import { formatDateTime, formatMoney } from '@/utils/storage';
import DetailModal from './DetailModal';
import DispatchModal from './DispatchModal';
import { cn } from '@/lib/utils';

export default function FreightList() {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<FreightStatus | ''>('');
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);
  const [dispatchOrderId, setDispatchOrderId] = useState<string | null>(null);

  const searchOrders = useFreightStore(s => s.searchOrders);
  const getVehicleById = useFreightStore(s => s.getVehicleById);
  const getDriverById = useFreightStore(s => s.getDriverById);
  const advanceStatus = useFreightStore(s => s.advanceStatus);
  const deleteOrder = useFreightStore(s => s.deleteOrder);

  const orders = searchOrders(keyword, statusFilter);

  const handleAdvance = (id: string) => {
    advanceStatus(id);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该运单吗？此操作不可恢复。')) {
      deleteOrder(id);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">货运单管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理所有货运订单的调度与运输状态</p>
        </div>
        <Link
          to="/freight/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all self-start"
        >
          <Plus size={16} />
          新建运单
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="搜索运单号、客户、货物、起终点..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as FreightStatus | '')}
          className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        >
          <option value="">全部状态</option>
          {Object.entries(STATUS_LABEL).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">运单号</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">客户</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">起终点</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">货物</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">车辆/司机</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">计划提货</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">状态</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">费用</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-slate-400">
                    暂无运单数据
                  </td>
                </tr>
              ) : (
                orders.map(o => {
                  const v = getVehicleById(o.vehicleId);
                  const d = getDriverById(o.driverId);
                  const nextStatus = STATUS_FLOW[o.status];
                  const canAdvance = !!nextStatus;
                  return (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-800 whitespace-nowrap">
                        {o.orderNo}
                      </td>
                      <td className="px-5 py-4 text-slate-700 whitespace-nowrap">{o.customer}</td>
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                        <div className="text-slate-700">{o.origin}</div>
                        <div className="text-xs text-slate-400">→ {o.destination}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                        <div className="text-slate-700">{o.cargoName}</div>
                        <div className="text-xs text-slate-500">{o.cargoWeight} 吨</div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                        {v && d ? (
                          <div>
                            <div className="text-slate-700">{v.plateNumber}</div>
                            <div className="text-xs text-slate-500">{d.name}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400">未分配</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap text-xs">
                        {formatDateTime(o.plannedPickupTime)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusTag status={o.status} />
                      </td>
                      <td className="px-5 py-4 text-slate-700 font-medium whitespace-nowrap">
                        {formatMoney(o.estimatedFee)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => setDetailOrderId(o.id)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="查看详情"
                          >
                            <Eye size={16} />
                          </button>
                          {o.status === FreightStatus.PENDING && (
                            <button
                              onClick={() => setDispatchOrderId(o.id)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                              title="调度"
                            >
                              <UserCog size={16} />
                            </button>
                          )}
                          {o.status !== FreightStatus.DELIVERED && (
                            <Link
                              to={`/freight/${o.id}/edit`}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              title="编辑"
                            >
                              <Pencil size={16} />
                            </Link>
                          )}
                          {canAdvance && (
                            <button
                              onClick={() => handleAdvance(o.id)}
                              className={cn(
                                'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                                nextStatus === FreightStatus.IN_TRANSIT
                                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                  : nextStatus === FreightStatus.DELIVERED
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              )}
                            >
                              {nextStatus === FreightStatus.DELIVERED ? (
                                <CheckCircle2 size={14} />
                              ) : nextStatus === FreightStatus.IN_TRANSIT ? (
                                <PlayCircle size={14} />
                              ) : (
                                <UserCog size={14} />
                              )}
                              {STATUS_ACTION_LABEL[o.status]}
                            </button>
                          )}
                          {o.status !== FreightStatus.DELIVERED && (
                            <button
                              onClick={() => handleDelete(o.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="删除"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailModal orderId={detailOrderId} onClose={() => setDetailOrderId(null)} />
      <DispatchModal orderId={dispatchOrderId} onClose={() => setDispatchOrderId(null)} />
    </div>
  );
}
