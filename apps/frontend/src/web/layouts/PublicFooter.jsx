import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Heart, Flame } from 'lucide-react';
import { APP_NAME } from '@utils/constants';

export default function PublicFooter() {
  return (
    <footer className="bg-gradient-to-b from-sand-50 to-sand-100 dark:from-neutral-950 dark:to-neutral-900 border-t border-sand-200/60 dark:border-neutral-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-mandala opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 via-saffron-600 to-maroon-700 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-serif font-bold text-lg gradient-text leading-none">{APP_NAME}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-0.5">Jain Derasar</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              A century-old shwetambar derasar dedicated to the 24 Tirthankars, serving devotees with daily darshan, poojas, sadharmik bhakti and spiritual discourses.
            </p>
            <div className="flex gap-2 mt-5">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-800 hover:bg-saffron-500 hover:text-white text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition-all shadow-sm">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-serif font-semibold text-neutral-800 dark:text-white mb-4">Visit Us</p>
            <ul className="space-y-2.5 text-sm">
              {[
                ['/about', 'About the Derasar'],
                ['/festivals', 'Festivals & Events'],
                ['/gallery', 'Gallery'],
                ['/contact', 'Contact & Directions'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-neutral-600 dark:text-neutral-400 hover:text-saffron-700 dark:hover:text-saffron-400 transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seva */}
          <div>
            <p className="font-serif font-semibold text-neutral-800 dark:text-white mb-4">Seva</p>
            <ul className="space-y-2.5 text-sm">
              {[
                ['/auth/login', 'Book a Pooja'],
                ['/auth/login', 'Sadharmik Vatsalya'],
                ['/auth/register', 'Become a Member'],
              ].map(([to, label], i) => (
                <li key={i}>
                  <Link to={to} className="text-neutral-600 dark:text-neutral-400 hover:text-saffron-700 dark:hover:text-saffron-400 transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-serif font-semibold text-neutral-800 dark:text-white mb-4">Reach Us</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-saffron-600" />
                <span>123 Derasar Marg, Walkeshwar,<br />Mumbai — 400006</span>
              </li>
              <li className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                <Phone className="w-4 h-4 text-saffron-600" />
                <a href="tel:+912298765432" className="hover:text-saffron-700">+91 22 9876 5432</a>
              </li>
              <li className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                <Mail className="w-4 h-4 text-saffron-600" />
                <a href="mailto:info@jinalaya.org" className="hover:text-saffron-700">info@jinalaya.org</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-sand-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved. <span className="font-serif italic ml-2 text-saffron-700">Micchami Dukkadam</span></p>
          <p className="inline-flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for the Jain community
          </p>
        </div>
      </div>
    </footer>
  );
}
