import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../utils/cn';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-7xl',
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  footer,
  closeOnBackdrop = true,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className={cn(
              'relative w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-sand-200 dark:border-neutral-800 max-h-[90vh] flex flex-col',
              sizes[size]
            )}
          >
            {(title || onClose) && (
              <div className="flex items-start justify-between gap-4 p-5 border-b border-sand-100 dark:border-neutral-800">
                <div>
                  {title && <h3 className="font-serif font-semibold text-lg text-neutral-900 dark:text-white">{title}</h3>}
                  {subtitle && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-neutral-500 hover:bg-sand-100 dark:hover:bg-neutral-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            <div className="overflow-y-auto p-5 flex-1">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-2 p-5 border-t border-sand-100 dark:border-neutral-800">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
