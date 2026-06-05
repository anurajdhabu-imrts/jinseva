import { ArrowRight } from 'lucide-react';
import { cn } from '@utils/cn';

// Each service card uses one of the 5 Jain flag colors so the row of
// 4 cards naturally reads as the Panch Parmeshthi palette.
const tones = {
  red:    { circle: 'bg-jain-red-600',    chipBg: 'bg-jain-red-50',    arrow: 'group-hover:bg-jain-red-600' },
  yellow: { circle: 'bg-jain-yellow-400', chipBg: 'bg-jain-yellow-50', arrow: 'group-hover:bg-jain-yellow-500' },
  green:  { circle: 'bg-jain-green-600',  chipBg: 'bg-jain-green-50',  arrow: 'group-hover:bg-jain-green-600' },
  black:  { circle: 'bg-jain-black-900',  chipBg: 'bg-jain-black-50',  arrow: 'group-hover:bg-jain-black-800' },
  white:  { circle: 'bg-white border-2 border-jain-black-900', chipBg: 'bg-white border border-jain-white-300', arrow: 'group-hover:bg-jain-black-900' },
};

export default function ArchServiceCard({ icon, title, description, ctaLabel = 'More Details', tone = 'yellow', className = '' }) {
  const t = tones[tone] || tones.yellow;

  return (
    <div
      className={cn(
        'group relative px-7 pt-20 pb-8 transition-colors',
        t.chipBg,
        className
      )}
      style={{ borderTopLeftRadius: 9999, borderTopRightRadius: 9999, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
    >
      {/* Circular icon — flat Jain flag color */}
      <div
        className={cn(
          'absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 group-hover:rotate-6',
          t.circle,
          tone === 'white' ? 'text-jain-black-900' : 'text-white'
        )}
      >
        <span className="text-3xl">{icon}</span>
      </div>

      <div className="text-center mt-12">
        <h3 className="font-serif text-2xl font-bold text-jain-black-900 dark:text-white">{title}</h3>
        <p className="text-sm text-jain-black-600 dark:text-jain-white-400 mt-3 leading-relaxed">{description}</p>

        <button className="mt-7 inline-flex items-center gap-2 font-serif font-semibold text-jain-black-900 dark:text-white text-sm">
          {ctaLabel}
          <span className={cn(
            'w-8 h-8 rounded-full bg-jain-black-900 text-white flex items-center justify-center transition-colors',
            t.arrow,
          )}>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    </div>
  );
}
