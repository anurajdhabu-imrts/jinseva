import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { heroSlides } from '@web/data/publicData';

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const slide = heroSlides[idx];

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 7000);
    return () => clearInterval(id);
  }, []);

  const go = (n) => setIdx((i) => (i + n + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative h-[92vh] min-h-[640px] overflow-hidden bg-neutral-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-maroon-950/85 via-maroon-900/70 to-saffron-900/55" />
          <div className="absolute inset-0 bg-mandala opacity-25" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold-400/20 blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-saffron-500/20 blur-3xl animate-pulse-slow pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl text-white"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              {slide.eyebrow}
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mt-5 leading-[0.95] tracking-tight">
              {slide.title}
              <br />
              <span className="text-gold-300">{slide.accent}</span>
            </h1>
            <p className="text-base md:text-lg text-white/85 mt-5 max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 mt-9">
              <Link to={slide.primaryCta.to} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-saffron-700 font-semibold shadow-2xl hover:shadow-glow hover:-translate-y-0.5 transition-all">
                {slide.primaryCta.label} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={slide.secondaryCta.to} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur border border-white/30 text-white font-medium hover:bg-white/20 transition-all">
                {slide.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button onClick={() => go(-1)} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => go(1)} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 flex items-center justify-center transition">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-gold-300 w-10' : 'bg-white/40 w-4 hover:bg-white/70'}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="hidden md:flex absolute bottom-24 right-8 z-10 items-center gap-3 text-white">
        <span className="font-display text-3xl font-bold text-gold-300">{String(idx + 1).padStart(2, '0')}</span>
        <span className="w-12 h-px bg-white/40" />
        <span className="text-sm opacity-75">{String(heroSlides.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
