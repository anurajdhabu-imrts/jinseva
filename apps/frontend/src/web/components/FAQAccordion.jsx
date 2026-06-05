import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQAccordion({ items = [] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`rounded-2xl border transition-all overflow-hidden ${
              isOpen
                ? 'bg-white dark:bg-neutral-900 border-saffron-300 dark:border-saffron-500/30 shadow-lg'
                : 'bg-white/60 dark:bg-neutral-900/60 border-sand-200 dark:border-neutral-800 hover:border-saffron-200'
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span className={`font-serif font-semibold ${isOpen ? 'text-saffron-700 dark:text-saffron-400' : 'text-neutral-800 dark:text-neutral-100'}`}>
                {item.q}
              </span>
              <span className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                isOpen ? 'bg-gradient-to-br from-saffron-500 to-maroon-600 text-white' : 'bg-sand-100 dark:bg-neutral-800 text-neutral-500'
              }`}>
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="px-5 pb-5 text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
