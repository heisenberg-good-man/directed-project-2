import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { useFreightStore } from '@/store/useFreightStore';
import { useToastStore } from '@/store/useToastStore';
import { Truck, User, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DispatchModalProps {
  orderId: string | null;
  onClose: () => void;
}

export default function DispatchModal({ orderId, onClose }: DispatchModalProps) {
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const open = !!orderId;
  const vehicles = useFreightStore(s => s.vehicles);
  const drivers = useFreightStore(s => s.drivers);
  const dispatchOrder = useFreightStore(s => s.dispatchOrder);
  const getOrderById = useFreightStore(s => s.getOrderById);
  const getVehicleById = useFreightStore(s => s.getVehicleById);
  const getDriverById = useFreightStore(s => s.getDriverById);
  const showToast = useToastStore(s => s.showToast);

  useEffect(() => {
    if (open) {
      setVehicleId('');
      setDriverId('');
      setError('');
      setSubmitting(false);
    }
  }, [open, orderId]);

  const order = orderId ? getOrderById(orderId) : undefined;

  const handleConfirm = async () => {
    if (!vehicleId) {
      setError('请选择车辆');
      return;
    }
    if (!driverId) {
      setError('请选择司机');
      return;
    }
    setSubmitting(true);
    try {
      if (orderId) {
        dispatchOrder(orderId, vehicleId, driverId);
        const v = getVehicleById(vehicleId);
        const d = getDriverById(driverId);
        showToast('success', `调度成功：已分配车辆 ${v?.plateNumber || ''}、司机 ${d?.name || ''}`);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="调度运单 - 分配车辆与司机"
      width="max-w-xl"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all disabled:opacity-60"
          >
            <CheckCircle2 size={16} />
            {submitting ? '处理中...' : '确认调度'}
          </button>
        </>
      }
    >
      {order && (
        <div className="space-y-5">
          <div className="bg-slate-50 rounded-lg p-4 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-slate-800">{order.orderNo}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">{order.customer}</span>
            </div>
            <div className="text-slate-600">
              {order.origin} <span className="mx-1.5 text-slate-400">→</span> {order.destination}
            </div>
            <div className="text-slate-500 mt-1 text-xs">
              {order.cargoName} · {order.cargoWeight} 吨
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Truck size={14} className="inline mr-1.5 -mt-0.5" />
              选择车辆
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vehicles.map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVehicleId(v.id);
                    setError('');
                  }}
                  className={cn(
                    'text-left p-3 rounded-lg border text-sm transition-all',
                    vehicleId === v.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className="font-medium text-slate-800">{v.plateNumber}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {v.model} · 载重 {v.capacity} 吨
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <User size={14} className="inline mr-1.5 -mt-0.5" />
              选择司机
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {drivers.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setDriverId(d.id);
                    setError('');
                  }}
                  className={cn(
                    'text-left p-3 rounded-lg border text-sm transition-all',
                    driverId === d.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className="font-medium text-slate-800">{d.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{d.phone}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
