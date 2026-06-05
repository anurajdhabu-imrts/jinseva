import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { heroSlides } from '@web/data/publicData';
import { LotusGlyph } from './OrnamentalDivider';
import JainFlagStripe from './JainFlagStripe';

const overlayCards = [
  { id: 1, title: 'We walk the path of', accent: 'Bhagwan Mahavir' },
  { id: 2, title: 'A century of seva,', accent: 'serving the sangh' },
  { id: 3, title: 'Daanam paramodharmah —', accent: 'giving is dharma' },
];

const marqueeWords = [
  'Ahimsa Paramo Dharmah', 'Parasparopagraho Jīvānām', 'Anekantavada',
  'Aparigraha', 'Satya', 'Daanam Paramodharmah', 'Jai Jinendra',
];

export default function HeroSplit() {
  const [idx, setIdx] = useState(0);
  const slide = heroSlides[idx];

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 6500);
    return () => clearInterval(id);
  }, []);

  const go = (n) => setIdx((i) => (i + n + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative bg-jain-white-200 dark:bg-jain-black-950">
      <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] xl:grid-cols-[560px_1fr] min-h-[760px]">
        {/* LEFT DARK PANEL — Jain Green */}
        <div className="relative bg-jain-green-900 dark:bg-jain-green-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-mandala opacity-10" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-jain-yellow-500/15 blur-3xl" />
          <div className="absolute -top-10 right-0 w-72 h-72 rounded-full bg-jain-red-500/10 blur-3xl" />

          {/* faint spinning mandala accent */}
          <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-10 animate-spin-very-slow pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full text-jain-yellow-400" fill="none" stroke="currentColor" strokeWidth="0.4">
              <circle cx="100" cy="100" r="90" />
              <circle cx="100" cy="100" r="70" />
              <circle cx="100" cy="100" r="50" />
              <circle cx="100" cy="100" r="30" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line key={i} x1="100" y1="10" x2="100" y2="190" transform={`rotate(${i * 7.5} 100 100)`} />
              ))}
            </svg>
          </div>

          <div className="relative h-full px-9 lg:px-14 py-20 lg:py-24 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-jain-yellow-500/20 border border-jain-yellow-400/30 text-jain-yellow-300 text-[11px] font-bold uppercase tracking-[0.22em]">
                  <span className="w-5 h-5 rounded-full bg-jain-red-600 flex items-center justify-center text-white">
                    <Sparkles className="w-2.5 h-2.5" />
                  </span>
                  Welcome to Shree Jinalaya
                </div>

                <h1 className="font-display font-bold mt-6 leading-[0.95] tracking-tight text-[clamp(2.75rem,5.5vw,4.75rem)]">
                  {slide.title}{' '}
                  <span className="italic text-jain-yellow-400">{slide.accent}</span>
                </h1>

                <div className="mt-6 flex items-center gap-3 text-jain-yellow-300/80">
                  <span className="h-px w-10 bg-jain-yellow-400/60" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{slide.eyebrow}</span>
                </div>

                <p className="text-white/75 mt-5 leading-relaxed max-w-md text-[15px]">{slide.subtitle}</p>

                <div className="flex flex-wrap gap-3 mt-9">
                  <Link
                    to={slide.primaryCta.to}
                    className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-jain-red-600 hover:bg-jain-red-700 text-white font-semibold text-sm shadow-lg transition-all"
                  >
                    {slide.primaryCta.label}
                    <span className="w-10 h-10 rounded-full bg-jain-yellow-400 text-jain-red-700 flex items-center justify-center group-hover:rotate-45 transition-transform">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </Link>
                  <Link
                    to={slide.secondaryCta.to}
                    className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full border border-jain-yellow-300/40 text-white font-semibold text-sm hover:bg-white/10 transition-all"
                  >
                    {slide.secondaryCta.label}
                    <span className="w-10 h-10 rounded-full border border-jain-yellow-300/50 flex items-center justify-center group-hover:rotate-45 transition-transform">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-auto pt-14 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  { bg: 'c8102e', label: 'A S' },
                  { bg: 'ffc01e', label: 'P J' },
                  { bg: '00843d', label: 'R M' },
                ].map((a, i) => (
                  <img key={i} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(a.label)}&background=${a.bg}&color=fff&bold=true`} alt="" className="w-11 h-11 rounded-full ring-2 ring-jain-green-900" />
                ))}
                <div className="w-11 h-11 rounded-full bg-jain-yellow-400 text-jain-black-900 font-bold text-xs flex items-center justify-center ring-2 ring-jain-green-900">
                  9K+
                </div>
              </div>
              <div className="leading-tight">
                <p className="font-bold text-base">8,945+ Sevak Family</p>
                <p className="text-jain-yellow-200/70 text-sm">Join as a sevak</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE PANEL */}
        <div className="relative min-h-[420px] lg:min-h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img src={slide.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Floating overlay card */}
          <div className="absolute right-6 lg:right-14 bottom-14 max-w-sm bg-white/92 dark:bg-jain-black-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex items-start gap-4"
              >
                <div className="flex-1">
                  <p className="font-serif font-bold text-[22px] leading-snug text-jain-black-900 dark:text-white">
                    {overlayCards[idx].title}{' '}
                    <span className="italic text-jain-red-600">{overlayCards[idx].accent}</span>
                  </p>
                  <button className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-jain-black-800 dark:text-jain-white-200">
                    More Details
                    <span className="w-7 h-7 rounded-full bg-jain-black-900 text-white flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => go(1)} className="w-10 h-10 rounded-full bg-jain-red-600 hover:bg-jain-red-700 text-white flex items-center justify-center shadow transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => go(-1)} className="w-10 h-10 rounded-full border border-jain-red-500 hover:bg-jain-red-50 dark:hover:bg-jain-black-800 text-jain-red-600 flex items-center justify-center transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide indicator dots */}
          <div className="absolute bottom-6 left-6 flex items-center gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-jain-yellow-400 w-10' : 'bg-white/50 w-2 hover:bg-white/80'}`}
              />
            ))}
          </div>

          {/* Top-right lotus accent */}
          <div className="hidden lg:block absolute top-8 right-8 text-white/40">
            <LotusGlyph className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Jain flag stripe divider */}
      <JainFlagStripe height="h-1" />

      {/* Sanskrit marquee strip */}
      <div className="bg-jain-black-900 text-jain-white-100/80 overflow-hidden">
        <div className="flex gap-12 py-3 whitespace-nowrap animate-marquee">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="font-serif italic text-sm tracking-wider inline-flex items-center gap-12">
              {w}
              <span className="text-jain-yellow-500">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
