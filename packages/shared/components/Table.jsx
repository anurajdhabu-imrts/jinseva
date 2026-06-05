import { cn } from '../utils/cn';

export default function Table({ columns = [], data = [], rowKey = 'id', onRowClick, emptyText = 'No records found', className = '' }) {
  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-sand-200 dark:border-neutral-800 bg-white dark:bg-neutral-900', className)}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 bg-sand-50 dark:bg-neutral-900/50 border-b border-sand-200 dark:border-neutral-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col.title}
                className={cn('px-5 py-3.5 font-semibold whitespace-nowrap', col.align === 'right' && 'text-right', col.align === 'center' && 'text-center', col.headerClassName)}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-16 text-center text-neutral-500 dark:text-neutral-400">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row[rowKey] ?? i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-sand-100 dark:border-neutral-800/70 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-sand-50/60 dark:hover:bg-neutral-800/40'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.title}
                    className={cn(
                      'px-5 py-3.5 text-neutral-800 dark:text-neutral-200',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                      col.cellClassName
                    )}
                  >
                    {col.render ? col.render(row[col.key], row, i) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
