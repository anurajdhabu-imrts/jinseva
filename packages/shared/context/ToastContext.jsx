import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const variants = {
  success: { icon: CheckCircle2, className: 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
  error:   { icon: XCircle,      className: 'border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300' },
  warning: { icon: AlertCircle,  className: 'border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  info:    { icon: Info,         className: 'border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type: 'info', duration: 3500, ...toast };
    setToasts((t) => [...t, newToast]);
    if (newToast.duration > 0) {
      setTimeout(() => remove(id), newToast.duration);
    }
    return id;
  }, [remove]);

  const toast = {
    success: (msg, opts) => push({ type: 'success', message: msg, ...opts }),
    error:   (msg, opts) => push({ type: 'error', message: msg, ...opts }),
    warning: (msg, opts) => push({ type: 'warning', message: msg, ...opts }),
    info:    (msg, opts) => push({ type: 'info', message: msg, ...opts }),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[320px] max-w-[90vw]">
        <AnimatePresence>
          {toasts.map(({ id, type, title, message }) => {
            const { icon: Icon, className } = variants[type] || variants.info;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 22 }}
                className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${className}`}
              >
                <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  {title && <div className="font-semibold text-sm">{title}</div>}
                  <div className="text-sm opacity-90">{message}</div>
                </div>
                <button onClick={() => remove(id)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
