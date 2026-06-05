import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowUpRight, Check } from 'lucide-react';
import JainFlagStripe from './JainFlagStripe';

const highlights = [
  'Astonishing marble shikhar architecture',
  'Active sadharmik community of 8,945',
  'Pathshala & sutra learning for children',
  'Bhojanshala serving 2,400+ daily',
];

// Small lotus + Tirthankar silhouette for the centered header icon
function TirthankarIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      {/* Lotus base */}
      <path d="M14 50 Q 32 38 50 50 Q 32 56 14 50 Z" fill="currentColor" opacity="0.85" />
      <path d="M20 50 Q 32 42 44 50 Q 32 52 20 50 Z" fill="currentColor" />
      {/* Halo */}
      <circle cx="32" cy="22" r="14" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.45" />
      {/* Tirthankar silhouette */}
      <circle cx="32" cy="18" r="5" fill="currentColor" />
      <path d="M24 32 Q 32 26 40 32 L 38 46 L 26 46 Z" fill="currentColor" />
      <path d="M22 46 Q 32 42 42 46 L 40 50 L 24 50 Z" fill="currentColor" />
    </svg>
  );
}

// Custom flat illustration of a Jain derasar — guaranteed to render and stays
// on-theme (uses only solid Jain flag colors).
function DerasarIllustration() {
  return (
    <svg viewBox="0 0 600 480" className="w-full h-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Jain derasar illustration">
      {/* Sky / paper backdrop */}
      <rect width="600" height="480" fill="#faf6ee" />

      {/* Decorative sun (yellow circle) */}
      <circle cx="490" cy="120" r="60" fill="#ffc01e" />
      <circle cx="490" cy="120" r="60" fill="#ffd14a" opacity="0.35" />

      {/* Ground line */}
      <rect x="0" y="400" width="600" height="80" fill="#054624" />

      {/* Central shikhar tower stack */}
      <g>
        {/* Plinth */}
        <rect x="200" y="370" width="200" height="32" fill="#1a1b22" />
        {/* Main hall */}
        <rect x="220" y="290" width="160" height="80" fill="#ffffff" stroke="#1a1b22" strokeWidth="2" />
        {/* Three arched doorways */}
        <path d="M240 370 L 240 330 Q 240 320 250 320 Q 260 320 260 330 L 260 370 Z" fill="#c8102e" />
        <path d="M290 370 L 290 320 Q 290 305 300 305 Q 310 305 310 320 L 310 370 Z" fill="#1a1b22" />
        <path d="M340 370 L 340 330 Q 340 320 350 320 Q 360 320 360 330 L 360 370 Z" fill="#c8102e" />

        {/* Lower shikhar */}
        <polygon points="220,290 380,290 360,250 240,250" fill="#ffc01e" stroke="#1a1b22" strokeWidth="2" />
        <rect x="240" y="220" width="120" height="30" fill="#ffffff" stroke="#1a1b22" strokeWidth="2" />

        {/* Mid shikhar */}
        <polygon points="240,220 360,220 345,180 255,180" fill="#c8102e" stroke="#1a1b22" strokeWidth="2" />
        <rect x="255" y="155" width="90" height="25" fill="#ffffff" stroke="#1a1b22" strokeWidth="2" />

        {/* Upper shikhar */}
        <polygon points="255,155 345,155 335,120 265,120" fill="#00843d" stroke="#1a1b22" strokeWidth="2" />
        <rect x="270" y="95" width="60" height="25" fill="#ffffff" stroke="#1a1b22" strokeWidth="2" />

        {/* Crowning kalash */}
        <polygon points="270,95 330,95 320,70 280,70" fill="#ffc01e" stroke="#1a1b22" strokeWidth="2" />
        <circle cx="300" cy="60" r="8" fill="#c8102e" stroke="#1a1b22" strokeWidth="2" />
        <line x1="300" y1="52" x2="300" y2="30" stroke="#1a1b22" strokeWidth="2" />
        <path d="M295 30 L 305 30 L 300 18 Z" fill="#ffc01e" stroke="#1a1b22" strokeWidth="2" />
      </g>

      {/* Side flag-staffs (decorative) */}
      <g>
        <line x1="160" y1="400" x2="160" y2="250" stroke="#1a1b22" strokeWidth="3" />
        <path d="M160 250 L 200 260 L 200 285 L 160 275 Z" fill="#c8102e" />
        <line x1="440" y1="400" x2="440" y2="250" stroke="#1a1b22" strokeWidth="3" />
        <path d="M440 250 L 400 260 L 400 285 L 440 275 Z" fill="#00843d" />
      </g>

      {/* Lotus on water */}
      <g transform="translate(70, 380)">
        <ellipse cx="40" cy="20" rx="50" ry="10" fill="#1a1b22" opacity="0.15" />
        <path d="M20 20 Q 20 5 40 0 Q 60 5 60 20 Q 40 12 20 20 Z" fill="#ffc01e" />
        <path d="M28 20 Q 28 10 40 6 Q 52 10 52 20 Q 40 14 28 20 Z" fill="#c8102e" />
        <circle cx="40" cy="16" r="3" fill="#ffd14a" />
      </g>

      {/* Mirror lotus other side */}
      <g transform="translate(450, 380)">
        <ellipse cx="40" cy="20" rx="50" ry="10" fill="#1a1b22" opacity="0.15" />
        <path d="M20 20 Q 20 5 40 0 Q 60 5 60 20 Q 40 12 20 20 Z" fill="#00843d" />
        <path d="M28 20 Q 28 10 40 6 Q 52 10 52 20 Q 40 14 28 20 Z" fill="#ffc01e" />
        <circle cx="40" cy="16" r="3" fill="#ffd14a" />
      </g>
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section className="relative py-24 bg-white dark:bg-jain-black-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Centered header */}
        <div className="text-center mb-16">
          <span className="eyebrow-chip mb-4">Our Heritage</span>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-jain-yellow-100 dark:bg-jain-yellow-600/15 my-4 text-jain-red-600">
            <TirthankarIcon className="w-10 h-10" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-jain-black-900 dark:text-white leading-[1.05]">
            Know the real history
            <br />
            <span className="text-jain-red-600">of our derasar</span>
          </h2>
          <JainFlagStripe height="h-1" className="mt-6 mx-auto max-w-xs" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-jain-black-700 dark:text-jain-white-300 leading-relaxed">
              Shree Mahavir Jain Derasar was founded in 1924 by twelve sadharmik families who pooled
              their savings to build a sanctuary for the worship of the 24 Tirthankars. From a humble
              upashraya, our derasar has grown into a thriving spiritual home that nurtures dharma
              through daily aaradhana, mahaparvas and tireless seva.
            </p>
            <p className="text-jain-black-700 dark:text-jain-white-300 leading-relaxed mt-4">
              Today, after a century of unwavering devotion, we are proud to serve generations of
              devotees with the same humility, simplicity and compassion taught by Bhagwan Mahavir.
            </p>

            <ul className="space-y-3 mt-7">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-jain-black-800 dark:text-jain-white-200">
                  <span className="w-6 h-6 rounded-full bg-jain-green-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </span>
                  <span className="font-medium">{h}</span>
                </li>
              ))}
            </ul>

            <div className="my-8 h-px bg-jain-white-300 dark:bg-jain-black-800" />

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 pl-6 pr-2 py-2 rounded-full bg-jain-red-600 hover:bg-jain-red-700 text-white font-semibold text-sm shadow transition-all"
              >
                More About
                <span className="w-9 h-9 rounded-full bg-white text-jain-red-600 flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>

              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-full bg-jain-yellow-400 text-jain-black-900 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs text-jain-black-500">Call Now</p>
                  <p className="font-bold text-jain-black-900 dark:text-white">+91 22 9876 5432</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: derasar illustration + established badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[5/4] rounded-[2rem] overflow-hidden border-4 border-jain-black-900 shadow-2xl bg-jain-white-200">
              <DerasarIllustration />
            </div>

            {/* Established circular badge — solid Jain green */}
            <div className="absolute -left-6 lg:-left-10 top-1/2 -translate-y-1/2 w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-jain-green-700 text-white flex flex-col items-center justify-center shadow-2xl ring-8 ring-white dark:ring-jain-black-950">
              <p className="text-sm font-medium opacity-90">Established in</p>
              <p className="font-display text-5xl lg:text-6xl font-bold mt-1 text-jain-yellow-300">1924</p>
            </div>

            {/* Corner Jain flag tag */}
            <div className="absolute -top-3 right-6 lg:right-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-jain-black-200 shadow-md">
              <JainFlagStripe orientation="vertical" className="h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-jain-black-800">
                Shwetambar Sangh
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
