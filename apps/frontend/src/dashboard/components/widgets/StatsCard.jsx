import { TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

// Every tone uses ONLY palette tokens (saffron→orange, jain-black→brown), so a
// stat card can never render green/violet/yellow regardless of the data's
// intended "tone". Blob/box stay warm orange; glyph varies orange vs brown.
const BLOB = 'from-saffron-500/15 to-saffron-500/5 border-saffron-500/25';
const tones = {
  primary: `${BLOB} text-saffron-600 dark:text-saffron-300`,
  gold:    `${BLOB} text-saffron-600 dark:text-saffron-300`,
  rose:    `${BLOB} text-jain-black-700 dark:text-jain-white-300`,
  emerald: `${BLOB} text-jain-black-700 dark:text-jain-white-300`,
  violet:  `${BLOB} text-saffron-700 dark:text-saffron-300`,
  sky:     `${BLOB} text-saffron-600 dark:text-saffron-300`,
};

export default function StatsCard({ icon: Icon, label, value, growth, tone = 'primary', subtitle, delay = 0 }) {
  const positive = (growth ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl border border-sand-200/60 dark:border-neutral-800 p-5 shadow-card dark:shadow-card-dark hover:shadow-lg transition-all"
    >
      <div className={cn('absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br opacity-30', tones[tone])} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{label}</p>
          <h3 className="text-2xl md:text-3xl font-serif font-bold mt-2 text-neutral-900 dark:text-white">{value}</h3>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</p>}
          {growth !== undefined && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium">
              <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full',
                positive ? 'bg-saffron-100 text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-300'
                         : 'bg-sand-200 text-jain-black-700 dark:bg-neutral-800 dark:text-jain-white-300')}>
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {positive ? '+' : ''}{growth}%
              </span>
              <span className="text-neutral-400">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center border', tones[tone])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
