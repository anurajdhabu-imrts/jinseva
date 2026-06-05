import { cn } from '../utils/cn';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

export default function Avatar({ src, name = '', size = 'md', ring = false, status, className = '' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span className={cn('relative inline-flex items-center justify-center', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-saffron-400 to-maroon-600 text-white font-semibold',
          ring && 'ring-2 ring-saffron-500/30 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900',
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials || '·'}</span>
        )}
      </span>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-neutral-900',
            status === 'online' && 'bg-emerald-500',
            status === 'busy' && 'bg-amber-500',
            status === 'offline' && 'bg-neutral-400'
          )}
        />
      )}
    </span>
  );
}
