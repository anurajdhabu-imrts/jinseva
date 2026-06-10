import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogIn, Phone, Search, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';
import { cn } from '@utils/cn';
import TopBar from './TopBar';
import { JainFlagBadge } from '@web/components/JainFlagStripe';
import LanguageSwitcher from '@components/LanguageSwitcher';

const navItems = [
  { to: '/',          label: 'Home' },
  { to: '/about',     label: 'About Us' },
  { to: '/festivals', label: 'Festivals' },
  { to: '/gallery',   label: 'Gallery' },
  { to: '/contact',   label: 'Contact' },
];

export default function PublicNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative">
      <TopBar />

      <header className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-jain-black-950/95 backdrop-blur-xl shadow-sm border-b border-jain-white-300 dark:border-jain-black-800'
          : 'bg-white dark:bg-jain-black-950 border-b border-jain-white-300/60 dark:border-jain-black-800'
      )}>
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center gap-4">
          {/* Brand — Jain flag badge logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <JainFlagBadge size="md" />
            <div className="leading-tight">
              <p className="font-serif font-bold text-xl text-jain-black-900 dark:text-jain-white-100">
                <span className="text-jain-red-600">Ji</span>
                <span className="text-jain-yellow-600">na</span>
                <span className="text-jain-green-600">la</span>
                <span className="text-jain-black-900 dark:text-jain-white-100">ya</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-jain-black-500 dark:text-jain-white-400 mt-0.5">
                Jain Derasar
              </p>
            </div>
          </Link>

          {/* Nav — centered */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => cn(
                  'relative px-4 py-2 text-[15px] font-semibold transition-colors',
                  isActive
                    ? 'text-jain-red-600 dark:text-jain-yellow-400'
                    : 'text-jain-black-800 dark:text-jain-white-200 hover:text-jain-red-600 dark:hover:text-jain-yellow-400'
                )}
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1.5 h-1.5 rounded-full bg-jain-red-600" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Call now */}
            <div className="hidden xl:flex items-center gap-2.5 pr-3 mr-1 border-r border-jain-white-300 dark:border-jain-black-800">
              <span className="w-10 h-10 rounded-full bg-jain-yellow-100 dark:bg-jain-yellow-600/15 text-jain-red-600 dark:text-jain-yellow-400 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-wider text-jain-black-500 dark:text-jain-white-400">Call now</p>
                <p className="font-bold text-sm text-jain-black-900 dark:text-jain-white-100">+91 22 9876 5432</p>
              </div>
            </div>

            {/* Icon buttons */}
            <button className="hidden md:flex w-10 h-10 rounded-full border border-jain-white-300 dark:border-jain-black-700 text-jain-black-700 dark:text-jain-white-300 items-center justify-center hover:border-jain-red-500 hover:text-jain-red-600 transition">
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="hidden md:flex w-10 h-10 rounded-full border border-jain-white-300 dark:border-jain-black-700 text-jain-black-700 dark:text-jain-white-300 items-center justify-center hover:border-jain-red-500 hover:text-jain-red-600 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language */}
            <LanguageSwitcher />

            {/* Login pill */}
            <Link
              to="/auth/login"
              className="group hidden sm:inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 ml-1 rounded-full bg-jain-green-600 text-white font-semibold text-sm shadow hover:shadow-glow transition-all"
            >
              Login
              <span className="w-8 h-8 rounded-full bg-white text-jain-green-700 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden w-10 h-10 rounded-full border border-jain-white-300 dark:border-jain-black-700 flex items-center justify-center"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="lg:hidden border-t border-jain-white-300 dark:border-jain-black-800 bg-white dark:bg-jain-black-950 animate-slide-down">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => cn(
                    'block px-4 py-3 rounded-xl text-sm font-semibold',
                    isActive
                      ? 'bg-jain-red-50 text-jain-red-600 dark:bg-jain-red-600/15 dark:text-jain-yellow-400'
                      : 'text-jain-black-800 dark:text-jain-white-200 hover:bg-jain-white-200 dark:hover:bg-jain-black-800'
                  )}
                >
                  {n.label}
                </NavLink>
              ))}
              <div className="flex gap-2 pt-3">
                <Link to="/auth/login" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-jain-green-600 text-jain-green-700 font-semibold text-sm">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
