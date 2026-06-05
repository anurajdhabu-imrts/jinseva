import { cn } from '@utils/cn';

/**
 * The 5 Panch Parmeshthi colors of the Jain flag:
 *   White  → Arihants
 *   Red    → Siddhas
 *   Yellow → Acharyas
 *   Green  → Upadhyays
 *   Black  → Sadhus
 */
export const JAIN_FLAG_COLORS = [
  { hex: '#ffffff', name: 'White',  parmeshthi: 'Arihants' },
  { hex: '#c8102e', name: 'Red',    parmeshthi: 'Siddhas' },
  { hex: '#ffc01e', name: 'Yellow', parmeshthi: 'Acharyas' },
  { hex: '#00843d', name: 'Green',  parmeshthi: 'Upadhyays' },
  { hex: '#1a1b22', name: 'Black',  parmeshthi: 'Sadhus' },
];

/**
 * A thin 5-color stripe drawn from the Jain flag.
 * Use as a decorative ribbon under the topbar, footer top, hero base, etc.
 */
export default function JainFlagStripe({ orientation = 'horizontal', height = 'h-1.5', className = '' }) {
  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col w-1.5 rounded-full overflow-hidden', className)}>
        {JAIN_FLAG_COLORS.map((c) => (
          <span key={c.name} className="flex-1" style={{ background: c.hex }} />
        ))}
      </div>
    );
  }
  return (
    <div className={cn('flex w-full overflow-hidden', height, className)}>
      {JAIN_FLAG_COLORS.map((c) => (
        <span key={c.name} className="flex-1" style={{ background: c.hex }} />
      ))}
    </div>
  );
}

/**
 * Small circular logo that uses the 5 Jain flag colors as concentric or radial slices.
 * Drop-in replacement for the old flame logo.
 */
export function JainFlagBadge({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };
  return (
    <span className={cn('relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-md', sizes[size], className)}>
      <span className="absolute inset-0 bg-jain-flag" aria-hidden />
      <span className="absolute inset-[15%] rounded-xl bg-white flex items-center justify-center">
        {/* Stylized swastika-style cross — 4-fold dharma wheel */}
        <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-jain-red-600" fill="currentColor" aria-hidden>
          <circle cx="12" cy="12" r="2" />
        </svg>
      </span>
    </span>
  );
}
