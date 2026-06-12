import { forwardRef } from 'react';
import { cn } from '../utils/cn';

const Input = forwardRef(function Input(
  { label, icon: Icon, trailing, error, hint, className = '', containerClassName = '', type = 'text', ...props },
  ref
) {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900',
            'border border-sand-200 dark:border-neutral-700',
            'text-neutral-900 dark:text-neutral-100',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-saffron-500/40 focus:border-saffron-500',
            'transition-all duration-200',
            Icon && 'pl-10',
            trailing && 'pr-10',
            error && 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {trailing}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">{hint}</p>}
    </div>
  );
});

export default Input;

export function Textarea({ label, error, hint, className = '', containerClassName = '', rows = 4, ...props }) {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900',
          'border border-sand-200 dark:border-neutral-700',
          'text-neutral-900 dark:text-neutral-100',
          'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
          'focus:outline-none focus:ring-2 focus:ring-saffron-500/40 focus:border-saffron-500',
          'transition-all duration-200 resize-none',
          error && 'border-rose-500 focus:ring-rose-500/30',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">{hint}</p>}
    </div>
  );
}

export function Select({ label, icon: Icon, error, hint, options = [], className = '', containerClassName = '', ...props }) {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
        )}
        <select
          className={cn(
            'w-full px-4 py-2.5 pr-10 rounded-xl bg-white dark:bg-neutral-900',
            'border border-sand-200 dark:border-neutral-700',
            'text-neutral-900 dark:text-neutral-100',
            'focus:outline-none focus:ring-2 focus:ring-saffron-500/40 focus:border-saffron-500',
            'transition-all duration-200 cursor-pointer appearance-none',
            Icon && 'pl-10',
            error && 'border-rose-500',
            className
          )}
          {...props}
        >
          {options.map((opt) =>
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>{opt}</option>
            ) : (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )
          )}
        </select>
        {/* Dropdown arrow is drawn via the global `select` rule in index.css
            (background-image), so we don't render a custom chevron here. */}
      </div>
      {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">{hint}</p>}
    </div>
  );
}

export function Checkbox({ label, className = '', ...props }) {
  return (
    <label className={cn('inline-flex items-center gap-2.5 cursor-pointer select-none', className)}>
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-sand-300 dark:border-neutral-600 text-saffron-600 focus:ring-saffron-500/40 focus:ring-2 cursor-pointer"
        {...props}
      />
      {label && <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>}
    </label>
  );
}

export function Switch({ checked, onChange, label, className = '' }) {
  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer', className)}>
      <span className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <span className="block w-11 h-6 rounded-full bg-sand-300 dark:bg-neutral-700 peer-checked:bg-gradient-to-r peer-checked:from-saffron-500 peer-checked:to-saffron-600 transition-all" />
        <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
      </span>
      {label && <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>}
    </label>
  );
}
