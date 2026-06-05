import Breadcrumb from './Breadcrumb';
import { cn } from '../utils/cn';

export default function PageHeader({ title, subtitle, breadcrumb, actions, className = '' }) {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6', className)}>
      <div>
        {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-2" />}
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-neutral-900 dark:text-white">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
