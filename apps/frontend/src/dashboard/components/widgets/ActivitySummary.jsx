import { Activity, Flame, HandHeart, Users } from 'lucide-react';
import Card, { CardHeader, CardBody } from '@components/Card';
import { cn } from '@utils/cn';

const icons = [Flame, HandHeart, Activity, Users];
const tones = [
  'from-saffron-500 to-maroon-600',
  'from-gold-400 to-saffron-600',
  'from-rose-400 to-rose-600',
  'from-violet-400 to-violet-600',
];

export default function ActivitySummary({ data = [] }) {
  return (
    <Card>
      <CardHeader title="Temple Activity" subtitle="Live totals" />
      <CardBody>
        <div className="grid grid-cols-2 gap-3">
          {data.map((a, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={a.label} className="relative p-4 rounded-xl bg-gradient-to-br from-sand-50 to-white dark:from-neutral-800/40 dark:to-neutral-900 border border-sand-200/60 dark:border-neutral-800 overflow-hidden">
                <div className={cn('absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br opacity-10', tones[i % tones.length])} />
                <div className={cn('w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2', tones[i % tones.length])}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{a.label}</p>
                <p className="text-xl font-serif font-bold text-neutral-900 dark:text-white">
                  {Number(a.value).toLocaleString('en-IN')}
                </p>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
