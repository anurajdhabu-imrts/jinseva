import { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

// Languages offered by the Google Translate widget (see index.html — must match
// `includedLanguages`). `en` = the site's original language.
const LANGS = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

function currentLang() {
  // Google stores the active language in the `googtrans` cookie: /en/<target>.
  const m = typeof document !== 'undefined' && document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  return (m && m[1]) || 'en';
}

function setLang(code) {
  const host = window.location.hostname;
  // Set on every domain scope Google might read so it sticks across reloads.
  const value = `/en/${code}`;
  [`googtrans=${value};path=/`,
   `googtrans=${value};path=/;domain=${host}`,
   `googtrans=${value};path=/;domain=.${host}`].forEach((c) => { document.cookie = c; });
  window.location.reload();
}

export default function LanguageSwitcher({ className = '' }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('en');
  const ref = useRef(null);

  useEffect(() => { setActive(currentLang()); }, []);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const activeLang = LANGS.find((l) => l.code === active) || LANGS[0];

  return (
    <div ref={ref} className={cn('relative notranslate', className)} translate="no">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Change language"
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-sand-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{activeLang.native}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 z-50 rounded-xl border border-sand-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl py-1.5">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => { setOpen(false); if (l.code !== active) setLang(l.code); }}
              className={cn(
                'w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-sand-50 dark:hover:bg-neutral-800 transition-colors',
                l.code === active && 'bg-sand-50 dark:bg-neutral-800/60',
              )}
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">{l.native}</span>
                {l.label !== l.native && (
                  <span className="block text-xs text-neutral-400 truncate">{l.label}</span>
                )}
              </span>
              {l.code === active && <Check className="w-4 h-4 text-saffron-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
