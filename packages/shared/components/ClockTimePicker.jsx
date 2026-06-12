import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '../utils/cn';

const C = 120;      // svg center
const R = 92;       // radius of the number ring
const TIP = 20;     // selected highlight radius

// Position on the dial for an angle measured clockwise from the top (12 o'clock).
function pos(angleDeg, radius = R) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: C + radius * Math.sin(rad), y: C - radius * Math.cos(rad) };
}

function parse(value) {
  if (!value || !value.includes(':')) return { h24: null, minute: 0 };
  const [h, m] = value.split(':').map(Number);
  return { h24: h, minute: m || 0 };
}

const to24 = (h12, ampm) => {
  let h = h12 % 12;
  if (ampm === 'PM') h += 12;
  return h;
};

const fmt = (h24, m) => {
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ap = h24 < 12 ? 'AM' : 'PM';
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
};

/**
 * A clock-dial time picker. Shows a read-only field; clicking opens a popover
 * with an analog clock face — pick the hour, then the minute. AM/PM toggle.
 * Stores the value as "HH:MM" (24-hour), so callers/backend are unchanged.
 * `onChange` is called with the new "HH:MM" string.
 */
export default function ClockTimePicker({ label, value = '', onChange, icon: Icon = Clock }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('hours'); // 'hours' | 'minutes'

  const { h24, minute } = parse(value);
  const hasValue = h24 !== null;
  const ampm = hasValue ? (h24 < 12 ? 'AM' : 'PM') : 'AM';
  const hour12 = hasValue ? (h24 % 12 === 0 ? 12 : h24 % 12) : 12;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const commit = (next) => {
    const h12 = next.hour12 ?? hour12;
    const m = next.minute ?? minute;
    const ap = next.ampm ?? ampm;
    onChange?.(`${String(to24(h12, ap)).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  const pickHour = (h) => {
    commit({ hour12: h });
    setMode('minutes');
  };
  const pickMinute = (m) => commit({ minute: m });

  const numbers = useMemo(() => {
    if (mode === 'hours') {
      return Array.from({ length: 12 }, (_, i) => {
        const h = i === 0 ? 12 : i;
        return { val: h, label: String(h), angle: (h % 12) * 30, selected: hasValue && h === hour12 };
      });
    }
    return Array.from({ length: 12 }, (_, i) => {
      const m = i * 5;
      return { val: m, label: String(m).padStart(2, '0'), angle: m * 6, selected: hasValue && m === minute };
    });
  }, [mode, hour12, minute, hasValue]);

  const handAngle = mode === 'hours' ? (hour12 % 12) * 30 : minute * 6;
  const tip = pos(handAngle);

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">{label}</label>
      )}

      {/* Field */}
      <button
        type="button"
        onClick={() => { setMode('hours'); setOpen((o) => !o); }}
        className={cn(
          'w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-left',
          'bg-white dark:bg-neutral-900 border border-sand-200 dark:border-neutral-700',
          'text-sm transition-all focus:outline-none focus:ring-2 focus:ring-saffron-500/40 focus:border-saffron-500',
          hasValue ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400',
        )}
      >
        <Icon className="w-4 h-4 text-neutral-400 shrink-0" />
        {hasValue ? fmt(h24, minute) : 'Select time'}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="absolute z-50 mt-2 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-sand-200 dark:border-neutral-800 shadow-2xl"
            >
              {/* Digital header */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setMode('hours')}
                  className={cn('text-3xl font-serif font-bold tabular-nums px-1 rounded',
                    mode === 'hours' ? 'text-saffron-600' : 'text-neutral-500')}
                >
                  {String(hour12).padStart(2, '0')}
                </button>
                <span className="text-3xl font-serif font-bold text-neutral-400">:</span>
                <button
                  type="button"
                  onClick={() => setMode('minutes')}
                  className={cn('text-3xl font-serif font-bold tabular-nums px-1 rounded',
                    mode === 'minutes' ? 'text-saffron-600' : 'text-neutral-500')}
                >
                  {String(minute).padStart(2, '0')}
                </button>
                <div className="flex flex-col gap-1 ml-2">
                  {['AM', 'PM'].map((ap) => (
                    <button
                      key={ap}
                      type="button"
                      onClick={() => commit({ ampm: ap })}
                      className={cn('px-2 py-0.5 rounded-lg text-xs font-semibold border transition-colors',
                        ampm === ap
                          ? 'bg-saffron-500 text-white border-saffron-500'
                          : 'border-sand-200 dark:border-neutral-700 text-neutral-500')}
                    >
                      {ap}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clock face */}
              <div className="relative mx-auto" style={{ width: C * 2, height: C * 2 }}>
                <svg width={C * 2} height={C * 2} className="absolute inset-0">
                  <circle cx={C} cy={C} r={C - 4} className="fill-sand-100 dark:fill-neutral-800" />
                  <line x1={C} y1={C} x2={tip.x} y2={tip.y} className="stroke-saffron-500" strokeWidth="2" />
                  <circle cx={tip.x} cy={tip.y} r={TIP} className="fill-saffron-500" />
                  <circle cx={C} cy={C} r="3.5" className="fill-saffron-600" />
                </svg>
                {numbers.map((n) => {
                  const p = pos(n.angle);
                  return (
                    <button
                      key={`${mode}-${n.val}`}
                      type="button"
                      onClick={() => (mode === 'hours' ? pickHour(n.val) : pickMinute(n.val))}
                      style={{ left: p.x, top: p.y }}
                      className={cn(
                        'absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                        n.selected ? 'text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-sand-200 dark:hover:bg-neutral-700',
                      )}
                    >
                      {n.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-saffron-500 text-white text-sm font-medium hover:bg-saffron-600"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
