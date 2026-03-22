'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: AlertCircle,
};

const colors = {
  success: 'bg-success',
  error: 'bg-red-500',
  warning: 'bg-warning',
  info: 'bg-primary',
};

export function Toast({ message, type, onClose }: ToastProps) {
  const Icon = icons[type];

  return (
    <div
      className={`fixed top-24 right-4 z-50 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up max-w-sm`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContextValue {
  showToast: (message: string, type: ToastType) => void;
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
}
