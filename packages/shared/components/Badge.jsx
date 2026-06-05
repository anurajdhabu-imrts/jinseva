import { cn } from '../utils/cn';

const variants = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  danger:  'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
  info:    'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400',
  primary: 'bg-saffron-100 text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-400',
  neutral: 'bg-sand-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  gold:    'bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-400',
};

export default function Badge({ children, variant = 'neutral', dot = false, className = '' }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', variants[variant], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full bg-current')} />}
      {children}
    </span>
  );
}
