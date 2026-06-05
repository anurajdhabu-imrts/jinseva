import { cn } from '@utils/cn';
import OrnamentalDivider from './OrnamentalDivider';

export default function SectionTitle({ eyebrow, title, accent, description, align = 'center', tone = 'saffron', className = '' }) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-100/80 dark:bg-saffron-500/15 text-saffron-700 dark:text-saffron-400 text-[11px] font-bold uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-display-lg font-bold mt-4 text-ink-900 dark:text-white">
        {title}
        {accent && <span className="italic font-serif text-saffron-700 dark:text-saffron-400"> {accent}</span>}
      </h2>
      {description && (
        <p className="text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed">{description}</p>
      )}
      {align === 'center' && <OrnamentalDivider className="mt-5" tone={tone} />}
    </div>
  );
}
