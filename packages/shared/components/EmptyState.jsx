import { Inbox } from 'lucide-react';
import { cn } from '../utils/cn';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action, className = '' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saffron-100 to-saffron-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center mb-4">
        <Icon className="w-9 h-9 text-saffron-600 dark:text-saffron-400" />
      </div>
      <h3 className="text-lg font-serif font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
      {description && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
