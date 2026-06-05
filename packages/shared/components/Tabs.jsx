import { useState } from 'react';
import { cn } from '../utils/cn';

export default function Tabs({ tabs = [], defaultTab, onChange, variant = 'pills', className = '' }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key);

  const handleChange = (key) => {
    setActive(key);
    onChange?.(key);
  };

  const styles = {
    pills: 'gap-1 p-1 bg-sand-100 dark:bg-neutral-800/60 rounded-xl',
    underline: 'gap-6 border-b border-sand-200 dark:border-neutral-800',
  };

  const tabStyle = (isActive) => {
    if (variant === 'underline') {
      return cn(
        'px-1 pb-3 text-sm font-medium border-b-2 transition-colors',
        isActive
          ? 'text-saffron-600 dark:text-saffron-400 border-saffron-500'
          : 'text-neutral-500 dark:text-neutral-400 border-transparent hover:text-neutral-800 dark:hover:text-neutral-200'
      );
    }
    return cn(
      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
      isActive
        ? 'bg-white dark:bg-neutral-900 text-saffron-700 dark:text-saffron-400 shadow-sm'
        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
    );
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('inline-flex flex-wrap', styles[variant])}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => handleChange(t.key)} className={tabStyle(t.key === active)}>
            <span className="inline-flex items-center gap-2">
              {t.icon && <t.icon className="w-4 h-4" />}
              {t.label}
              {typeof t.count === 'number' && (
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-sand-200 dark:bg-neutral-700">{t.count}</span>
              )}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-5">{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  );
}
