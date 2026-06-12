import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';
import { APP_NAME, APP_TAGLINE } from '@utils/constants';
import { JainFlagBadge } from '@web/components/JainFlagStripe';

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="dashboard-theme min-h-screen flex flex-col bg-white dark:bg-jain-black-950">
      <div className="flex-1 flex">
        {/* Left side - solid Jain red brand panel */}
        <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-jain-red-600">
          <div className="absolute inset-0 bg-mandala opacity-20" />

          <div className="relative z-10 p-12 flex items-center gap-3">
            <JainFlagBadge size="md" />
            <div>
              <h1 className="text-2xl font-serif font-bold text-white">{APP_NAME}</h1>
              <p className="text-xs text-white/70 uppercase tracking-wider">{APP_TAGLINE}</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 px-12 flex-1 flex flex-col justify-center text-white"
          >
            <h2 className="font-display text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
              Sacred service,<br />
              <span className="text-jain-yellow-300">simplified.</span>
            </h2>
            <p className="mt-5 max-w-md text-white/85 leading-relaxed">
              A complete management suite crafted for Jain derasars and spiritual organizations —
              handling daan, mahaparvas, devotee services and ceremonies under one elegant roof.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: '120+', l: 'Derasars' },
                { v: '50L+', l: 'Daan' },
                { v: '4.9★', l: 'Rating' },
              ].map((s) => (
                <div key={s.l} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                  <div className="font-serif text-2xl font-bold text-jain-yellow-300">{s.v}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative z-10 p-12 text-white/60 text-xs">
            © 2026 {APP_NAME} • Jai Jinendra
          </div>
        </div>

        {/* Right side - form */}
        <div className="flex-1 flex flex-col bg-white dark:bg-jain-black-950">
          <div className="flex items-center justify-between p-5 lg:p-8">
            <Link to="/auth/login" className="lg:hidden inline-flex items-center gap-2">
              <JainFlagBadge size="sm" />
              <span className="font-serif font-semibold text-lg text-jain-red-600">{APP_NAME}</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="ml-auto p-2 rounded-lg hover:bg-jain-white-200 dark:hover:bg-jain-black-800 text-jain-black-700 dark:text-jain-white-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-5 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
