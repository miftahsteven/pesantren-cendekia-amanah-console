import React from 'react';
import { useUI, ToastItem } from '../../context/UIContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#D8232A] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#D8232A] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#D4A31C] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#1F5FD0] shrink-0" />
  };

  const borders = {
    success: 'border-[#D8232A]/30 bg-[#FDE8E9]',
    error: 'border-[#D8232A]/30 bg-[#FEECEC]',
    warning: 'border-[#F0BD28]/40 bg-[#FEF8E8]',
    info: 'border-[#1F5FD0]/30 bg-[#EBF3FF]'
  };

  return (
    <div
      className={`p-3.5 rounded-xl border shadow-lg flex items-center justify-between gap-3 bg-white animate-in slide-in-from-bottom-2 ${
        borders[toast.type]
      }`}
    >
      <div className="flex items-center gap-2.5">
        {icons[toast.type]}
        <p className="text-xs font-semibold text-[#1A293B]">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded text-gray-400 hover:text-gray-700 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
