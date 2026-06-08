import { FreightStatus, STATUS_LABEL } from '@/types';
import { cn } from '@/lib/utils';

interface StatusTagProps {
  status: FreightStatus;
  className?: string;
}

const statusConfig: Record<FreightStatus, { bg: string; text: string; dot: string }> = {
  [FreightStatus.PENDING]: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    dot: 'bg-orange-500'
  },
  [FreightStatus.DISPATCHED]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500'
  },
  [FreightStatus.IN_TRANSIT]: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    dot: 'bg-purple-500'
  },
  [FreightStatus.DELIVERED]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500'
  }
};

export default function StatusTag({ status, className }: StatusTagProps) {
  const cfg = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium',
        cfg.bg,
        cfg.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)}></span>
      {STATUS_LABEL[status]}
    </span>
  );
}
