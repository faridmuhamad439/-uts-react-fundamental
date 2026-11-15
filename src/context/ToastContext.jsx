import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const value = {
    addToast,
    removeToast,
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning')
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Notification Floating Container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2.5rem)] pointer-events-none"
        role="region"
        aria-label="Notifikasi"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-slide-anim pointer-events-auto p-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border flex items-center gap-3 ${
              toast.type === 'success'
                ? 'border-emerald-200 text-emerald-950'
                : toast.type === 'error'
                ? 'border-red-200 text-red-950'
                : toast.type === 'warning'
                ? 'border-amber-200 text-amber-950'
                : 'border-[#dfd5c7] text-[#2c221e]'
            }`}
          >
            <span className="shrink-0">
              {toast.type === 'success' && <CheckCircle size={17} className="text-emerald-600" />}
              {toast.type === 'error' && <AlertCircle size={17} className="text-red-600" />}
              {toast.type === 'warning' && <AlertTriangle size={17} className="text-amber-600" />}
              {toast.type === 'info' && <Info size={17} className="text-[#b86b24]" />}
            </span>
            <p className="text-xs font-semibold leading-snug flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#9e9084] hover:text-[#2c221e] p-1 rounded-full shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
