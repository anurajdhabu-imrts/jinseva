import { cn } from '../utils/cn';

export default function Card({ children, className = '', hover = false, glow = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-neutral-900 rounded-2xl border border-sand-200/60 dark:border-neutral-800 shadow-card dark:shadow-card-dark',
        hover && 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300',
        glow && 'hover:shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 p-5 border-b border-sand-100 dark:border-neutral-800', className)}>
      <div>
        {title && <h3 className="font-serif font-semibold text-lg text-neutral-900 dark:text-white">{title}</h3>}
        {subtitle && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={cn('p-5 border-t border-sand-100 dark:border-neutral-800', className)}>{children}</div>;
}
