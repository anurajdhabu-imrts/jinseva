import { cn } from '../utils/cn';

export default function Loader({ size = 'md', className = '', label }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn('relative', sizes[size])}>
        <div className="absolute inset-0 rounded-full border-4 border-saffron-200 dark:border-neutral-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-saffron-600 border-r-saffron-500 animate-spin" />
      </div>
      {label && <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div
      className={cn(
        'bg-sand-200 dark:bg-neutral-800 rounded-lg animate-pulse',
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size="lg" label="Loading divine experience…" />
    </div>
  );
}
