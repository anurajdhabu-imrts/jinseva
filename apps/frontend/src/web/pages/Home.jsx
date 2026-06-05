import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, ArrowRight, ArrowUpRight, Quote, Star, Flame, BookOpen, Users,
  UserCheck, GraduationCap, Music2, Plus, Minus, Check, Phone
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import HeroSplit from '@web/components/HeroSplit';
import ArchServiceCard from '@web/components/ArchServiceCard';
import AboutSection from '@web/components/AboutSection';
import SectionTitle from '@web/components/SectionTitle';
import JainFlagStripe, { JainFlagBadge } from '@web/components/JainFlagStripe';
import { LotusGlyph } from '@web/components/OrnamentalDivider';

import { faqs } from '@web/data/publicData';
import { testimonials, galleryImages } from '@data/mockData';

const archServices = [
  { id: 1, icon: '🪷', title: 'Snatra Pooja',  tone: 'red',    description: 'Ceremonial abhishek of the Mool Nayak with kesar, chandan and pure jal at sunrise.' },
  { id: 2, icon: '🍱', title: 'Bhojanshala',   tone: 'yellow', description: 'Sadharmik vatsalya kitchen serving 500+ devotees daily with pure sattvik bhojan.' },
  { id: 3, icon: '📿', title: 'Aaradhana',     tone: 'green',  description: 'Pratikraman, samayik, navkar paath — structured aaradhana for every seeker.' },
  { id: 4, icon: '🤲', title: 'Daan',           tone: 'black',  description: 'Gyan Daan, Aushadh Daan, Abhay Daan — practice the dharma of giving.' },
];

const heroStat = {
  number: '100+',
  label: 'Years of Unwavering Seva',
  description: 'Since 1924, our derasar has been the spiritual home of 8,945 sevaks across India and the diaspora — every brick a tribute to the path of Bhagwan Mahavir.',
};

const supportStats = [
  { icon: UserCheck,      n: '150+', l: 'Lifelong Sevaks',   c: 'red' },
  { icon: GraduationCap, n: '38+',  l: 'Pathshala Children',c: 'yellow' },
  { icon: Users,          n: '148+', l: 'Sadharmik Bhakti',  c: 'green' },
  { icon: Music2,         n: '58+',  l: 'Bhakti Sandhya',    c: 'black' },
];

const principles = [
  { word: 'Ahimsa',         meaning: 'Non-violence in thought, word and deed' },
  { word: 'Anekantavada', meaning: 'Acceptance of multiple perspectives of truth' },
  { word: 'Aparigraha',    meaning: 'Non-attachment to material possessions' },
  { word: 'Satya',          meaning: 'Truthfulness in every interaction' },
];

function FaqItem({ q, a, isOpen, onToggle, index }) {
  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all ${
      isOpen ? 'border-jain-red-600 bg-jain-red-50/40' : 'border-jain-white-300 bg-white hover:border-jain-yellow-400'
    }`}>
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-5 text-left">
        <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
          isOpen ? 'bg-jain-red-600 text-white' : 'bg-jain-yellow-100 text-jain-red-700'
        }`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={`flex-1 font-serif font-bold ${
          isOpen ? 'text-jain-red-700' : 'text-jain-black-900'
        }`}>{q}</span>
        <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          isOpen ? 'bg-jain-red-600 text-white' : 'bg-jain-black-900 text-white'
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
            <p className="px-5 pb-5 pt-1 text-jain-black-700 leading-relaxed text-sm ml-12">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-white dark:bg-jain-black-950">
      <HeroSplit />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SERVICES — flat numbered layout                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section ID strip */}
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">01 — OUR SEVA</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-jain-black-900 leading-[1.02]">
              Helping and serving<br />
              the <span className="italic text-jain-red-600">sangh</span> together
            </h2>
            <p className="text-jain-black-700 leading-relaxed text-lg">
              From dawn aarti to evening pratikraman, our daily seva touches every aspect of a sevak's
              spiritual journey. Explore the practices that nurture our 100-year-old derasar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {archServices.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <ArchServiceCard
                  icon={s.icon}
                  title={s.title}
                  description={s.description}
                  tone={s.tone}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-jain-yellow-50 border-2 border-jain-yellow-300">
            <p className="text-jain-black-800 font-medium text-center md:text-left">
              Explore the many ways our sangh serves the community throughout the year.
            </p>
            <Link to="/festivals" className="group inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full bg-jain-red-600 hover:bg-jain-red-700 text-white font-bold text-sm transition shrink-0">
              View all services
              <span className="w-9 h-9 rounded-full bg-white text-jain-red-600 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* About — its own redesigned component */}
      <AboutSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* HERO STAT + SUPPORTING STATS                     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-jain-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mandala opacity-15" aria-hidden />
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-jain-yellow-400/20" aria-hidden />
        <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-jain-yellow-400/10" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs font-bold text-jain-yellow-300 tracking-[0.3em]">03 — BY THE NUMBERS</span>
              <p className="font-display text-[120px] md:text-[180px] font-bold leading-none text-jain-yellow-300 mt-2">
                {heroStat.number}
              </p>
              <p className="font-serif text-3xl font-bold mt-2">{heroStat.label}</p>
              <p className="text-white/85 mt-5 leading-relaxed max-w-md">{heroStat.description}</p>
              <JainFlagStripe height="h-1" className="mt-6 w-32" />
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              {supportStats.map((s, i) => {
                const colorMap = {
                  red:    'bg-jain-red-700 border-jain-red-800',
                  yellow: 'bg-jain-yellow-400 text-jain-black-900 border-jain-yellow-500',
                  green:  'bg-jain-green-700 border-jain-green-800',
                  black:  'bg-jain-black-900 border-jain-black-950',
                };
                return (
                  <motion.div
                    key={s.l}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-6 rounded-3xl border-2 ${colorMap[s.c]}`}
                  >
                    <s.icon className="w-7 h-7 mb-3 opacity-90" strokeWidth={1.5} />
                    <p className="font-display text-5xl font-bold">{s.n}</p>
                    <p className="text-xs uppercase tracking-[0.2em] opacity-85 mt-2">{s.l}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* PRINCIPLES — Jain flag color cards               */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-jain-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">04 — OUR FOUNDATION</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14">
            <h2 className="lg:col-span-7 font-display text-4xl md:text-6xl font-bold text-jain-black-900 leading-[1.02]">
              The Four <span className="italic text-jain-green-700">Eternal Vows</span>
            </h2>
            <p className="lg:col-span-5 text-jain-black-700 text-lg leading-relaxed">
              Principles taught by the 24 Tirthankars that guide every breath of our spiritual journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {principles.map((p, i) => {
              const palette = [
                { ring: 'border-jain-red-600',    chip: 'bg-jain-red-600',    text: 'text-jain-red-700' },
                { ring: 'border-jain-yellow-500', chip: 'bg-jain-yellow-500', text: 'text-jain-yellow-800' },
                { ring: 'border-jain-green-600',  chip: 'bg-jain-green-700',  text: 'text-jain-green-700' },
                { ring: 'border-jain-black-900',  chip: 'bg-jain-black-900',  text: 'text-jain-black-900' },
              ][i];

              return (
                <motion.div
                  key={p.word}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative p-7 rounded-3xl bg-white border-2 ${palette.ring} hover:-translate-y-1 transition-transform`}
                >
                  <span className={`absolute -top-3 left-7 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white ${palette.chip}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`font-display text-3xl font-bold mt-2 ${palette.text}`}>{p.word}</h3>
                  <p className="text-sm text-jain-black-700 mt-3 leading-relaxed">{p.meaning}</p>
                  <div className="mt-5 pt-5 border-t border-jain-white-300">
                    <LotusGlyph className={`w-8 h-8 ${palette.text} opacity-50 group-hover:opacity-100 transition-opacity`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* GALLERY — KEEP AS IS                              */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle eyebrow="05 — Darshan" title="Sacred" accent="Moments" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14">
            {galleryImages.slice(0, 8).map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${i === 0 || i === 5 ? 'row-span-2 aspect-[1/2]' : 'aspect-square'}`}
              >
                <img src={img.src} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery" className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-jain-red-600 hover:bg-jain-red-700 text-white font-bold transition-all">
              Browse full gallery
              <span className="w-10 h-10 rounded-full bg-white text-jain-red-600 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* TESTIMONIALS — featured + 2 supporting           */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">07 — VOICES</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold text-jain-black-900 leading-[1.02] mb-12">
            Stories of <span className="italic text-jain-red-600">faith</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Featured */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 lg:row-span-2 p-8 lg:p-10 rounded-3xl bg-jain-red-600 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-mandala opacity-15" aria-hidden />
              <Quote className="w-16 h-16 text-jain-yellow-300/50 absolute top-6 right-6" />
              <JainFlagStripe orientation="vertical" className="absolute top-0 left-0 h-full" />
              <div className="relative pl-6">
                <div className="flex gap-0.5 text-jain-yellow-300 mb-5">
                  {[0, 1, 2, 3, 4].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="font-serif italic text-2xl md:text-3xl leading-snug">
                  "{testimonials[0].text}"
                </p>
                <div className="flex items-center gap-4 mt-8 pt-8 border-t-2 border-white/20">
                  <img src={testimonials[0].avatar} alt={testimonials[0].name} className="w-14 h-14 rounded-full ring-4 ring-jain-yellow-300" />
                  <div>
                    <p className="font-bold text-lg">{testimonials[0].name}</p>
                    <p className="text-jain-yellow-200 text-sm">{testimonials[0].city}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Supporting cards */}
            {testimonials.slice(1, 3).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="p-7 rounded-3xl bg-jain-yellow-50 border-2 border-jain-yellow-300 relative"
              >
                <Quote className="w-10 h-10 text-jain-red-600/30 absolute top-5 right-5" />
                <div className="flex gap-0.5 text-jain-yellow-600 mb-3">
                  {[0, 1, 2, 3, 4].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="font-serif italic text-jain-black-800 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-jain-yellow-300">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full ring-2 ring-jain-red-600" />
                  <div>
                    <p className="font-bold text-sm text-jain-black-900">{t.name}</p>
                    <p className="text-xs text-jain-red-700">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* FAQ — numbered accordion                          */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 bg-jain-yellow-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">08 — COMMON QUESTIONS</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-jain-black-900 leading-[1.02]">
                Frequently<br />
                <span className="italic text-jain-red-600">asked</span>
              </h2>
              <p className="text-jain-black-700 mt-5 leading-relaxed">
                Visiting the derasar, booking poojas, donations and more — quick answers to common queries.
              </p>

              <div className="mt-8 p-6 rounded-3xl bg-jain-red-600 text-white relative overflow-hidden">
                <Flame className="w-10 h-10 text-jain-yellow-300 mb-3" />
                <h3 className="font-serif font-bold text-xl">Still have questions?</h3>
                <p className="text-sm text-white/85 mt-2">
                  Our sangh office is happy to help — call or message us anytime.
                </p>
                <Link to="/contact" className="group inline-flex items-center gap-2 mt-5 pl-5 pr-1.5 py-1.5 rounded-full bg-white text-jain-red-700 font-bold text-sm transition">
                  Contact us
                  <span className="w-9 h-9 rounded-full bg-jain-red-600 text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {faqs.map((f, i) => (
                <FaqItem
                  key={i}
                  index={i}
                  q={f.q}
                  a={f.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* CLOSING CTA STRIP                                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-jain-black-900 text-white py-20 relative overflow-hidden">
        <JainFlagStripe height="h-1" className="absolute top-0 inset-x-0" />
        <JainFlagStripe height="h-1" className="absolute bottom-0 inset-x-0" />
        <div className="absolute inset-0 bg-mandala opacity-10" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <JainFlagBadge size="lg" className="mx-auto animate-float" />
          <p className="font-mono text-xs font-bold text-jain-yellow-300 tracking-[0.3em] mt-6">
            ✦ FINAL VACHAN ✦
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 leading-tight">
            "Micchami Dukkadam"
          </h2>
          <p className="font-serif italic text-lg md:text-2xl text-jain-yellow-200 mt-5 max-w-2xl mx-auto">
            May any harm done by me, knowingly or unknowingly, be forgiven.<br />
            Walk with us on the path of ahimsa.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Link to="/auth/login" className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-jain-yellow-400 text-jain-black-900 font-bold transition">
              Sevak sign in
              <span className="w-10 h-10 rounded-full bg-jain-black-900 text-jain-yellow-400 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/30 hover:bg-white/10 font-medium transition">
              <Phone className="w-4 h-4" /> Plan your visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
