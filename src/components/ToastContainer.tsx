import { useToastStore, ToastItem } from '@/store/useToastStore';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const colorMap = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

const iconColorMap = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
  info: 'text-blue-600'
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const removeToast = useToastStore(s => s.removeToast);
  const Icon = iconMap[toast.type];

  return (
    <div
      className={cn(
        'min-w-[280px] max-w-sm flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg shadow-slate-900/5 backdrop-blur-sm',
        colorMap[toast.type],
        'animate-[slideIn_0.25s_ease-out]'
      )}
    >
      <Icon size={18} className={cn('shrink-0 mt-0.5', iconColorMap[toast.type])} />
      <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors"
      >
        <X size={14} className="text-slate-400 hover:text-slate-600" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore(s => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastCard toast={t} />
        </div>
      ))}
    </div>
  );
}
