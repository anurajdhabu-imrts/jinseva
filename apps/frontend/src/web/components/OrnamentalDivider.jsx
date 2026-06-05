import { cn } from '@utils/cn';

export default function OrnamentalDivider({ className = '', tone = 'saffron' }) {
  const colors = {
    saffron: 'text-saffron-500',
    gold:    'text-gold-500',
    cream:   'text-cream-400',
    forest:  'text-forest-700',
  };

  return (
    <div className={cn('flex items-center justify-center gap-4 py-2', className)}>
      <span className={cn('h-px w-12 md:w-24', colors[tone].replace('text-', 'bg-'))} />
      <svg viewBox="0 0 64 16" className={cn('w-14 h-4', colors[tone])} fill="currentColor">
        <circle cx="6"  cy="8" r="1.5" />
        <circle cx="14" cy="8" r="1" />
        <path d="M22 8 L28 4 L34 8 L28 12 Z" />
        <circle cx="40" cy="8" r="2.2" />
        <path d="M46 8 L52 4 L58 8 L52 12 Z" />
      </svg>
      <span className={cn('h-px w-12 md:w-24', colors[tone].replace('text-', 'bg-'))} />
    </div>
  );
}

export function LotusGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('w-12 h-12', className)} fill="none">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 8 C 28 22, 28 30, 32 42 C 36 30, 36 22, 32 8 Z" />
        <path d="M14 22 C 22 26, 28 32, 32 42 C 24 38, 18 34, 14 22 Z" />
        <path d="M50 22 C 42 26, 36 32, 32 42 C 40 38, 46 34, 50 22 Z" />
        <path d="M6 36 C 18 38, 26 42, 32 50 C 22 46, 14 44, 6 36 Z" />
        <path d="M58 36 C 46 38, 38 42, 32 50 C 42 46, 50 44, 58 36 Z" />
        <path d="M16 50 C 24 50, 40 50, 48 50 L 32 56 Z" />
      </g>
    </svg>
  );
}
