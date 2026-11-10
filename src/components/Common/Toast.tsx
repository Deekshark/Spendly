import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 rounded-full bg-slate-900/95 text-white px-4 py-2.5 shadow-xl shadow-slate-900/20 backdrop-blur-md border border-white/10 animate-fade-in text-xs font-semibold">
      <CheckCircle2 size={16} className="text-teal-400" />
      <span>{message}</span>
    </div>
  );
};
