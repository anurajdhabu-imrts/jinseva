import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card, { CardHeader, CardBody } from '@components/Card';
import { calendarDays } from '@data/mockData';
import { cn } from '@utils/cn';

const dotColors = {
  ritual: 'bg-saffron-500',
  event:  'bg-gold-500',
  pooja:  'bg-maroon-500',
  seva:   'bg-emerald-500',
};

export default function CalendarWidget() {
  return (
    <Card>
      <CardHeader
        title="May 2026"
        subtitle="Sacred calendar"
        action={
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800"><ChevronRight className="w-4 h-4" /></button>
          </div>
        }
      />
      <CardBody>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d} className="py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((d, i) => (
            <div
              key={i}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative',
                d && 'cursor-pointer transition-all hover:bg-sand-100 dark:hover:bg-neutral-800',
                d?.isToday && 'bg-gradient-to-br from-saffron-500 to-maroon-600 text-white font-bold shadow-md hover:from-saffron-600',
                !d?.isToday && d?.events?.length && 'font-medium text-neutral-800 dark:text-neutral-200'
              )}
            >
              {d && (
                <>
                  <span>{d.date}</span>
                  {d.events?.length > 0 && (
                    <div className="absolute bottom-1 flex gap-0.5">
                      {d.events.slice(0, 3).map((e, idx) => (
                        <span key={idx} className={cn('w-1 h-1 rounded-full', d.isToday ? 'bg-white' : dotColors[e.type])} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-4 text-xs">
          {Object.entries(dotColors).map(([k, c]) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <span className={cn('w-2 h-2 rounded-full', c)} />
              <span className="capitalize">{k}</span>
            </span>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
