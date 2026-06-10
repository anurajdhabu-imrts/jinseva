import { useState, useEffect } from 'react';
import { Calendar, ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import JainFlagStripe, { JainFlagBadge } from '@web/components/JainFlagStripe';
import { LotusGlyph } from '@web/components/OrnamentalDivider';
import CountdownTimer from '@web/components/CountdownTimer';
import PageHeroSmall from '@web/components/PageHeroSmall';
import { dailySchedule } from '@data/mockData';
import { publicApi } from '@services/rbacService';
import { formatDate } from '@utils/constants';

const toneCycle = ['red', 'yellow', 'green', 'black', 'red', 'yellow'];

// Events have no emoji; pick one from the event type for the festival cards.
const TYPE_ICONS = {
  Festival: '🎉', Pooja: '🪔', Mahaparva: '🕉️', 'Janma Kalyanak': '🌟',
  Tapasya: '🧘', Discourse: '📿', Seva: '🤝', Community: '🏛️', Wedding: '💍',
};
const iconFor = (type) => TYPE_ICONS[type] || '🪔';

const colorMap = {
  red:    { bg: 'bg-jain-red-600',    chip: 'bg-jain-red-600',    text: 'text-jain-red-700',    ring: 'border-jain-red-600',    yellowChip: 'bg-jain-yellow-400 text-jain-black-900' },
  yellow: { bg: 'bg-jain-yellow-400', chip: 'bg-jain-yellow-500', text: 'text-jain-yellow-800', ring: 'border-jain-yellow-500', yellowChip: 'bg-jain-red-600 text-white' },
  green:  { bg: 'bg-jain-green-700',  chip: 'bg-jain-green-700',  text: 'text-jain-green-700',  ring: 'border-jain-green-600',  yellowChip: 'bg-jain-yellow-400 text-jain-black-900' },
  black:  { bg: 'bg-jain-black-900',  chip: 'bg-jain-black-900',  text: 'text-jain-black-900',  ring: 'border-jain-black-900',  yellowChip: 'bg-jain-yellow-400 text-jain-black-900' },
};

export default function Festivals() {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    let cancelled = false;
    publicApi.festivals()
      .then((data) => { if (!cancelled) setFestivals(data || []); })
      .catch(() => { /* keep the page usable even if the API is down */ });
    return () => { cancelled = true; };
  }, []);

  const next = festivals[0];

  return (
    <div className="bg-white">
      <PageHeroSmall
        eyebrow="MAHAPARVAS"
        title="Festivals &amp;"
        accent="sacred days"
        description="From Paryushan to Diwali Nirvana, celebrate the rhythm of dharma with our community throughout the year."
        breadcrumb={[{ label: 'Festivals' }]}
      />

      {/* Featured upcoming event strip with countdown */}
      {next && (
      <section className="py-10 bg-jain-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white p-6 md:p-8 rounded-3xl border-2 border-jain-yellow-300">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <JainFlagBadge size="sm" />
                <div>
                  <p className="font-mono text-[10px] text-jain-red-600 tracking-[0.3em]">NEXT MAHAPARVA</p>
                  <p className="font-serif text-xl font-bold text-jain-black-900">{next.title}</p>
                </div>
              </div>
              <p className="text-sm text-jain-black-700 leading-relaxed line-clamp-2">{next.description}</p>
              <div className="flex flex-wrap gap-2 mt-4 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-jain-yellow-50 border border-jain-yellow-300 inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-jain-red-600" />
                  <span className="font-bold">{formatDate(next.date)}</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-jain-green-50 border border-jain-green-300 inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-jain-green-700" />
                  <span className="font-bold">{next.location || 'Derasar'}</span>
                </span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <CountdownTimer target={next.date} />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* FESTIVAL GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">01 — SACRED CELEBRATIONS</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14">
            <h2 className="lg:col-span-7 font-display text-4xl md:text-6xl font-bold text-jain-black-900 leading-[1.02]">
              The full <span className="italic text-jain-red-600">festival</span> calendar
            </h2>
            <p className="lg:col-span-5 text-jain-black-700 text-lg leading-relaxed">
              Each parva is a doorway to dharma — a chance to tune our lives back to the eternal
              rhythm of the Tirthankars.
            </p>
          </div>

          {festivals.length === 0 ? (
            <p className="text-center text-jain-black-500 py-16">No upcoming festivals announced yet — check back soon. 🙏</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {festivals.map((f, i) => {
              const tone = toneCycle[i % toneCycle.length] || 'red';
              const c = colorMap[tone];
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.07 }}
                  className={`group relative p-7 rounded-3xl bg-white border-2 ${c.ring} hover:-translate-y-1 transition-transform overflow-hidden`}
                >
                  <span className={`absolute -top-3 left-7 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white ${c.chip}`}>
                    Parva #{String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-start justify-between mt-3">
                    <span className="text-6xl">{iconFor(f.type)}</span>
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.yellowChip}`}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {formatDate(f.date, { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <h3 className={`font-display text-2xl font-bold mt-5 ${c.text}`}>{f.title}</h3>
                  <p className="text-sm text-jain-black-700 mt-3 leading-relaxed line-clamp-3">{f.description}</p>
                  <Link to="/auth/login" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-jain-black-900">
                    Read more
                    <span className={`w-7 h-7 rounded-full ${c.bg} ${tone === 'yellow' ? 'text-jain-black-900' : 'text-white'} flex items-center justify-center group-hover:rotate-45 transition-transform`}>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          )}
        </div>
      </section>

      {/* DAILY SCHEDULE — alternating colored rows */}
      <section className="py-24 bg-jain-yellow-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">02 — DAILY RHYTHM</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold text-jain-black-900 leading-[1.02] mb-4">
            The schedule of <span className="italic text-jain-red-600">the day</span>
          </h2>
          <p className="text-jain-black-700 text-lg leading-relaxed max-w-2xl mb-12">
            From dawn aarti to evening pratikraman, every moment is a meditation. Plan your darshan
            around the ceremony that moves you.
          </p>

          <div className="space-y-2">
            {dailySchedule.map((s, i) => {
              const c = colorMap[toneCycle[i] || 'red'];
              return (
                <motion.div
                  key={s.time}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`group flex items-center gap-5 p-5 rounded-2xl bg-white border-2 ${c.ring} hover:translate-x-2 transition-transform`}
                >
                  <span className={`w-12 h-12 rounded-full ${c.bg} ${toneCycle[i] === 'yellow' ? 'text-jain-black-900' : 'text-white'} flex items-center justify-center font-mono font-bold text-xs shrink-0`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-24 text-left shrink-0">
                    <div className={`font-mono text-xs font-bold ${c.text} tracking-wide`}>{s.time}</div>
                  </div>
                  <div className="w-px h-12 bg-jain-yellow-300" />
                  <div className="flex-1">
                    <p className="font-serif font-bold text-jain-black-900 text-lg">{s.name}</p>
                    <p className="text-sm text-jain-black-600 mt-0.5">{s.desc}</p>
                  </div>
                  <LotusGlyph className={`hidden md:block w-7 h-7 ${c.text} opacity-50 group-hover:opacity-100 transition`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
