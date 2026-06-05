import { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

export default function Dropdown({ trigger, children, align = 'right', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            'absolute z-40 mt-2 min-w-[200px] py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-sand-200 dark:border-neutral-800 shadow-xl animate-scale-in origin-top',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ icon: Icon, children, onClick, danger = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 transition-colors',
        danger ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10' : 'text-neutral-700 dark:text-neutral-200 hover:bg-sand-100 dark:hover:bg-neutral-800',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-sand-100 dark:border-neutral-800" />;
}
