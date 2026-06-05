import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Pagination({ page = 1, totalPages = 1, onChange, className = '' }) {
  const pages = (() => {
    const out = [];
    const show = 5;
    let start = Math.max(1, page - Math.floor(show / 2));
    let end = Math.min(totalPages, start + show - 1);
    if (end - start < show - 1) start = Math.max(1, end - show + 1);
    if (start > 1) {
      out.push(1);
      if (start > 2) out.push('...');
    }
    for (let i = start; i <= end; i++) out.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) out.push('...');
      out.push(totalPages);
    }
    return out;
  })();

  const btn = 'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all';

  return (
    <nav className={cn('flex items-center gap-1', className)}>
      <button
        disabled={page <= 1}
        onClick={() => onChange?.(page - 1)}
        className={cn(btn, 'text-neutral-600 dark:text-neutral-400 hover:bg-sand-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed')}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={i} className={cn(btn, 'text-neutral-400 cursor-default')}>
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onChange?.(p)}
            className={cn(
              btn,
              p === page
                ? 'bg-gradient-to-br from-saffron-500 to-saffron-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-sand-100 dark:hover:bg-neutral-800'
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page >= totalPages}
        onClick={() => onChange?.(page + 1)}
        className={cn(btn, 'text-neutral-600 dark:text-neutral-400 hover:bg-sand-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed')}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
