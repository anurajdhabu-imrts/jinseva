import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import JainFlagStripe from './JainFlagStripe';
import { cn } from '@utils/cn';

/**
 * Compact breadcrumb-style page header — replaces the giant red hero panels
 * on internal pages (About, Festivals, Donate, Contact, etc.).
 *
 * Props:
 *   - eyebrow: small uppercase tag above the title (e.g. "DAANAM PARAMODHARMAH")
 *   - title: main heading
 *   - accent: optional italic accent word after the title
 *   - description: optional subtitle paragraph
 *   - breadcrumb: array of { label, to? } — last item is the current page
 *   - tone: 'white' | 'yellow' | 'red' (default 'white')
 */
export default function PageHeroSmall({
  eyebrow,
  title,
  accent,
  description,
  breadcrumb = [],
  tone = 'white',
}) {
  const toneStyles = {
    white:  'bg-white text-jain-black-900',
    yellow: 'bg-jain-yellow-50 text-jain-black-900',
    red:    'bg-jain-red-600 text-white',
  };

  const isRed = tone === 'red';

  return (
    <section className={cn('relative overflow-hidden border-b-2 border-jain-yellow-300', toneStyles[tone])}>
      {/* Top Jain flag stripe */}
      <JainFlagStripe height="h-1" />

      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-12">
        {/* Breadcrumb row */}
        <nav className={cn(
          'flex items-center gap-1.5 text-xs font-medium',
          isRed ? 'text-jain-yellow-200' : 'text-jain-black-600'
        )}>
          <Link
            to="/"
            className={cn(
              'inline-flex items-center gap-1.5 hover:underline underline-offset-4',
              isRed ? 'hover:text-jain-yellow-300' : 'hover:text-jain-red-600'
            )}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          {breadcrumb.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <ChevronRight className={cn('w-3.5 h-3.5', isRed ? 'text-jain-yellow-300/60' : 'text-jain-black-400')} />
              {item.to ? (
                <Link
                  to={item.to}
                  className={cn(
                    'hover:underline underline-offset-4',
                    isRed ? 'hover:text-jain-yellow-300' : 'hover:text-jain-red-600'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn(
                  'font-bold',
                  isRed ? 'text-white' : 'text-jain-black-900'
                )}>
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        {/* Title row */}
        <div className="mt-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            {eyebrow && (
              <span className={cn(
                'inline-block font-mono text-[10px] font-bold tracking-[0.3em]',
                isRed ? 'text-jain-yellow-300' : 'text-jain-red-600'
              )}>
                {eyebrow}
              </span>
            )}
            <h1 className={cn(
              'font-display font-bold leading-[1.05] mt-2',
              'text-3xl md:text-4xl lg:text-5xl'
            )}>
              {title}
              {accent && (
                <>
                  {' '}
                  <span className={cn(
                    'italic',
                    isRed ? 'text-jain-yellow-300' : 'text-jain-red-600'
                  )}>
                    {accent}
                  </span>
                </>
              )}
            </h1>
            {description && (
              <p className={cn(
                'mt-3 max-w-2xl text-sm md:text-base leading-relaxed',
                isRed ? 'text-white/85' : 'text-jain-black-700'
              )}>
                {description}
              </p>
            )}
          </div>

          {/* Decorative stripe on the right */}
          <div className="hidden md:block">
            <JainFlagStripe height="h-1.5" className="w-32 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
