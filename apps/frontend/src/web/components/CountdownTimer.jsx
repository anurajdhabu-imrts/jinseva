import { useEffect, useState } from 'react';
import { cn } from '@utils/cn';

function diff(target) {
  const ms = new Date(target).getTime() - Date.now();
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms / 3600000) % 24),
    m: Math.floor((ms / 60000) % 60),
    s: Math.floor((ms / 1000) % 60),
  };
}

export default function CountdownTimer({ target, className = '' }) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const blocks = [
    { l: 'Days',    v: t.d },
    { l: 'Hours',   v: t.h },
    { l: 'Minutes', v: t.m },
    { l: 'Seconds', v: t.s },
  ];

  return (
    <div className={cn('grid grid-cols-4 gap-3 md:gap-5', className)}>
      {blocks.map((b) => (
        <div key={b.l} className="relative">
          <div className="aspect-square md:aspect-auto md:py-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white">
            <div className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tabular-nums text-gold-200 leading-none">
              {String(b.v).padStart(2, '0')}
            </div>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 opacity-80">{b.l}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
