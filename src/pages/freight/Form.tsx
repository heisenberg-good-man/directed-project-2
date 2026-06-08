import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useFreightStore } from '@/store/useFreightStore';
import { FreightFormData } from '@/types';
import { cn } from '@/lib/utils';

function getDefaultDateTime(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setMinutes(0, 0, 0);
  d.setMilliseconds(0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours() || 9)}:00`;
}

const defaultForm: FreightFormData = {
  customer: '',
  origin: '',
  destination: '',
  cargoName: '',
  cargoWeight: '',
  plannedPickupTime: getDefaultDateTime(1),
  plannedArrivalTime: getDefaultDateTime(2),
  estimatedFee: ''
};

type Errors = Partial<Record<keyof FreightFormData, string>>;

export default function FreightForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const getOrderById = useFreightStore(s => s.getOrderById);
  const createOrder = useFreightStore(s => s.createOrder);
  const updateOrder = useFreightStore(s => s.updateOrder);

  const [form, setForm] = useState<FreightFormData>(defaultForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const order = getOrderById(id);
      if (order) {
        setForm({
          customer: order.customer,
          origin: order.origin,
          destination: order.destination,
          cargoName: order.cargoName,
          cargoWeight: order.cargoWeight,
          plannedPickupTime: order.plannedPickupTime.slice(0, 16),
          plannedArrivalTime: order.plannedArrivalTime.slice(0, 16),
          estimatedFee: order.estimatedFee
        });
      }
    }
  }, [isEdit, id, getOrderById]);

  const updateField = <K extends keyof FreightFormData>(key: K, value: FreightFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.customer.trim()) next.customer = '请输入客户名称';
    if (!form.origin.trim()) next.origin = '请输入起点';
    if (!form.destination.trim()) next.destination = '请输入终点';
    if (!form.cargoName.trim()) next.cargoName = '请输入货物名称';
    if (form.cargoWeight === '' || Number(form.cargoWeight) <= 0) next.cargoWeight = '请输入有效的货物重量';
    if (!form.plannedPickupTime) next.plannedPickupTime = '请选择计划提货时间';
    if (!form.plannedArrivalTime) next.plannedArrivalTime = '请选择计划到达时间';
    if (form.plannedPickupTime && form.plannedArrivalTime && form.plannedPickupTime >= form.plannedArrivalTime) {
      next.plannedArrivalTime = '到达时间必须晚于提货时间';
    }
    if (form.estimatedFee === '' || Number(form.estimatedFee) < 0) next.estimatedFee = '请输入有效的预估费用';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEdit && id) {
        updateOrder(id, form);
      } else {
        createOrder(form);
      }
      navigate('/freight');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (key: keyof FreightFormData) =>
    cn(
      'w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 transition-all',
      errors[key]
        ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
        : 'border-slate-200 focus:ring-blue-500/30 focus:border-blue-500'
    );

  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';
  const required = <span className="text-red-500 ml-0.5">*</span>;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          to="/freight"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEdit ? '编辑运单' : '新建运单'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            填写货运单信息，带 * 为必填项
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="md:col-span-2">
            <label className={labelClass}>客户名称{required}</label>
            <input
              type="text"
              value={form.customer}
              onChange={e => updateField('customer', e.target.value)}
              placeholder="例如：深圳市恒通电子有限公司"
              className={fieldClass('customer')}
            />
            {errors.customer && <p className="mt-1 text-xs text-red-500">{errors.customer}</p>}
          </div>

          <div>
            <label className={labelClass}>起点{required}</label>
            <input
              type="text"
              value={form.origin}
              onChange={e => updateField('origin', e.target.value)}
              placeholder="发货地"
              className={fieldClass('origin')}
            />
            {errors.origin && <p className="mt-1 text-xs text-red-500">{errors.origin}</p>}
          </div>
          <div>
            <label className={labelClass}>终点{required}</label>
            <input
              type="text"
              value={form.destination}
              onChange={e => updateField('destination', e.target.value)}
              placeholder="收货地"
              className={fieldClass('destination')}
            />
            {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination}</p>}
          </div>

          <div>
            <label className={labelClass}>货物名称{required}</label>
            <input
              type="text"
              value={form.cargoName}
              onChange={e => updateField('cargoName', e.target.value)}
              placeholder="例如：电子元器件"
              className={fieldClass('cargoName')}
            />
            {errors.cargoName && <p className="mt-1 text-xs text-red-500">{errors.cargoName}</p>}
          </div>
          <div>
            <label className={labelClass}>货物重量（吨）{required}</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={form.cargoWeight}
              onChange={e => updateField('cargoWeight', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="例如：8.5"
              className={fieldClass('cargoWeight')}
            />
            {errors.cargoWeight && <p className="mt-1 text-xs text-red-500">{errors.cargoWeight}</p>}
          </div>

          <div>
            <label className={labelClass}>计划提货时间{required}</label>
            <input
              type="datetime-local"
              value={form.plannedPickupTime}
              onChange={e => updateField('plannedPickupTime', e.target.value)}
              className={fieldClass('plannedPickupTime')}
            />
            {errors.plannedPickupTime && <p className="mt-1 text-xs text-red-500">{errors.plannedPickupTime}</p>}
          </div>
          <div>
            <label className={labelClass}>计划到达时间{required}</label>
            <input
              type="datetime-local"
              value={form.plannedArrivalTime}
              onChange={e => updateField('plannedArrivalTime', e.target.value)}
              className={fieldClass('plannedArrivalTime')}
            />
            {errors.plannedArrivalTime && <p className="mt-1 text-xs text-red-500">{errors.plannedArrivalTime}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>预估费用（元）{required}</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.estimatedFee}
              onChange={e => updateField('estimatedFee', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="例如：2800.00"
              className={cn(fieldClass('estimatedFee'), 'md:w-1/2')}
            />
            {errors.estimatedFee && <p className="mt-1 text-xs text-red-500">{errors.estimatedFee}</p>}
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end gap-3">
          <Link
            to="/freight"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
          >
            <Save size={16} />
            {isEdit ? '保存修改' : '创建运单'}
          </button>
        </div>
      </form>
    </div>
  );
}
