import Modal from '@/components/Modal';
import StatusTag from '@/components/StatusTag';
import { useFreightStore } from '@/store/useFreightStore';
import {
  ALL_STATUSES,
  FreightStatus,
  STATUS_LABEL
} from '@/types';
import { formatDateTime, formatMoney } from '@/utils/storage';
import { Check, Circle, Package, MapPin, Truck, User, Clock, DollarSign, FileText } from 'lucide-react';

interface DetailModalProps {
  orderId: string | null;
  onClose: () => void;
}

export default function DetailModal({ orderId, onClose }: DetailModalProps) {
  const open = !!orderId;
  const getOrderById = useFreightStore(s => s.getOrderById);
  const getVehicleById = useFreightStore(s => s.getVehicleById);
  const getDriverById = useFreightStore(s => s.getDriverById);

  const order = orderId ? getOrderById(orderId) : undefined;
  const vehicle = order ? getVehicleById(order.vehicleId) : undefined;
  const driver = order ? getDriverById(order.driverId) : undefined;

  const getStatusIndex = (s: FreightStatus) => ALL_STATUSES.indexOf(s);
  const currentIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="运单详情"
      width="max-w-3xl"
    >
      {order && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{order.orderNo}</h2>
              <p className="text-sm text-slate-500 mt-1">
                创建于 {formatDateTime(order.createdAt)}
              </p>
            </div>
            <StatusTag status={order.status} className="text-sm px-3 py-1.5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <FileText size={16} className="text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-800">基础信息</h3>
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex gap-2">
                  <dt className="w-20 text-slate-500 shrink-0">客户</dt>
                  <dd className="text-slate-800 font-medium">{order.customer}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 text-slate-500 shrink-0 flex items-start">
                    <MapPin size={13} className="mt-0.5 mr-1 text-slate-400" />
                    路线
                  </dt>
                  <dd className="text-slate-700">
                    <div>{order.origin}</div>
                    <div className="text-slate-400 my-0.5">↓</div>
                    <div>{order.destination}</div>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 text-slate-500 shrink-0 flex items-start">
                    <Package size={13} className="mt-0.5 mr-1 text-slate-400" />
                    货物
                  </dt>
                  <dd className="text-slate-700">
                    {order.cargoName} · {order.cargoWeight} 吨
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Truck size={16} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800">调度信息</h3>
              </div>
              {vehicle && driver ? (
                <dl className="space-y-2.5 text-sm">
                  <div className="flex gap-2">
                    <dt className="w-20 text-slate-500 shrink-0 flex items-center">
                      <Truck size={13} className="mr-1 text-slate-400" />
                      车辆
                    </dt>
                    <dd className="text-slate-800 font-medium">
                      {vehicle.plateNumber}
                      <span className="text-xs text-slate-500 ml-2">
                        {vehicle.model} · {vehicle.capacity}吨
                      </span>
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-20 text-slate-500 shrink-0 flex items-center">
                      <User size={13} className="mr-1 text-slate-400" />
                      司机
                    </dt>
                    <dd className="text-slate-800 font-medium">
                      {driver.name}
                      <span className="text-xs text-slate-500 ml-2">{driver.phone}</span>
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-slate-500 italic">暂未分配车辆和司机</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Clock size={16} className="text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-800">时间计划</h3>
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex gap-2">
                  <dt className="w-24 text-slate-500 shrink-0">计划提货</dt>
                  <dd className="text-slate-800 font-medium">
                    {formatDateTime(order.plannedPickupTime)}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 text-slate-500 shrink-0">计划到达</dt>
                  <dd className="text-slate-800 font-medium">
                    {formatDateTime(order.plannedArrivalTime)}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 text-slate-500 shrink-0">更新时间</dt>
                  <dd className="text-slate-700">{formatDateTime(order.updatedAt)}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <DollarSign size={16} className="text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800">费用信息</h3>
              </div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex gap-2">
                  <dt className="w-20 text-slate-500 shrink-0">预估费用</dt>
                  <dd className="text-slate-800 font-semibold text-base">
                    {formatMoney(order.estimatedFee)}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 text-slate-500 shrink-0">实际费用</dt>
                  <dd className="text-slate-800 font-medium">
                    {order.actualFee !== undefined ? formatMoney(order.actualFee) : (
                      <span className="text-slate-400 italic">运输完成后确认</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-5">状态进度</h3>
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-200" />
              <div className="space-y-4">
                {ALL_STATUSES.map((s, idx) => {
                  const log = order.statusLogs.find(l => l.status === s);
                  const done = idx <= currentIndex;
                  const current = idx === currentIndex;
                  return (
                    <div key={s} className="relative flex gap-4">
                      <div
                        className={`z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                          done
                            ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-600 text-white shadow-md'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}
                      >
                        {done ? <Check size={16} /> : <Circle size={14} />}
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-medium ${
                              current ? 'text-emerald-700' : done ? 'text-slate-700' : 'text-slate-400'
                            }`}
                          >
                            {STATUS_LABEL[s]}
                          </span>
                          {current && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              当前
                            </span>
                          )}
                        </div>
                        {log ? (
                          <div className="mt-1">
                            <div className="text-xs text-slate-500">
                              {formatDateTime(log.time)}
                            </div>
                            {log.remark && (
                              <div className="text-sm text-slate-600 mt-1">{log.remark}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 mt-1 italic">待处理</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
