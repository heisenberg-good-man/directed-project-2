import Modal from '@/components/Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = '确认操作',
  message,
  confirmText = '确定',
  cancelText = '取消',
  danger = false,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      width="max-w-sm"
      footer={
        <>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={
              danger
                ? 'px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md transition-all'
                : 'px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all'
            }
          >
            {confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-1">
        <div
          className={
            danger
              ? 'w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0'
              : 'w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0'
          }
        >
          <AlertTriangle
            size={20}
            className={danger ? 'text-red-600' : 'text-blue-600'}
          />
        </div>
        <div className="text-sm text-slate-700 leading-6">{message}</div>
      </div>
    </Modal>
  );
}
