import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white hover:from-saffron-600 hover:to-saffron-700 shadow-md hover:shadow-glow',
  secondary: 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-sand-200 dark:border-neutral-700 hover:bg-sand-50 dark:hover:bg-neutral-700',
  ghost:     'text-neutral-700 dark:text-neutral-200 hover:bg-sand-100 dark:hover:bg-neutral-800',
  danger:    'bg-maroon-600 text-white hover:bg-maroon-700 shadow-sm',
  gold:      'bg-gradient-to-r from-gold-400 to-saffron-500 text-white hover:shadow-glow-gold',
  outline:   'border-2 border-saffron-500 text-saffron-600 dark:text-saffron-400 hover:bg-saffron-500 hover:text-white',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg',
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-base rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
}
