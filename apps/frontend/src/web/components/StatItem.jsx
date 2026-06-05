import { cn } from '@utils/cn';

export default function StatItem({ icon: Icon, label, value, description, className = '' }) {
  return (
    <div className={cn('text-left', className)}>
      <div className="w-20 h-20 rounded-full bg-saffron-100 dark:bg-saffron-500/15 text-saffron-700 dark:text-saffron-400 flex items-center justify-center mb-5">
        <Icon className="w-9 h-9" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium">{label}</p>
      <p className="font-display text-5xl font-bold text-neutral-900 dark:text-white mt-1.5 tracking-tight">{value}</p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 leading-relaxed max-w-[220px]">
        {description}
      </p>
    </div>
  );
}
