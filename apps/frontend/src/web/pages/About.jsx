import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Users, Heart, Flame, Phone, Check } from 'lucide-react';
import JainFlagStripe from '@web/components/JainFlagStripe';
import { LotusGlyph } from '@web/components/OrnamentalDivider';
import PageHeroSmall from '@web/components/PageHeroSmall';
import { trustees } from '@data/mockData';

const timeline = [
  { year: '1924', title: 'Foundation Laid',          tone: 'red',    desc: 'Twelve sadharmik families establish a small upashraya with a vision for the future.' },
  { year: '1948', title: 'Shikhar Construction',     tone: 'yellow', desc: 'The grand white marble shikhar of the derasar is completed.' },
  { year: '1972', title: 'Pratishtha Mahotsav',      tone: 'green',  desc: 'Mool Nayak Bhagwan Adinath idol consecrated in a grand Anjan Shalaka.' },
  { year: '1995', title: 'Bhojanshala Inaugurated',  tone: 'black',  desc: 'A modern Sadharmik Vatsalya hall capable of serving 500 devotees daily opens.' },
  { year: '2010', title: 'Upashraya & Library',      tone: 'red',    desc: '3-storey upashraya with a Jain Aagam library housing 15,000+ rare texts.' },
  { year: '2024', title: 'Centenary Celebration',     tone: 'yellow', desc: '100 years of unwavering seva celebrated with a year-long Mahotsav.' },
];

const missionPillars = [
  { icon: Flame,    title: 'Daily Aaradhana',  desc: 'Snatra, Ashta Prakari and evening aarti — every breath an offering',  color: 'red' },
  { icon: BookOpen, title: 'Gyan Daan',         desc: '15,000+ Aagam texts, weekly pravachans and pathshala for children',    color: 'yellow' },
  { icon: Heart,    title: 'Sadharmik Bhakti',  desc: '2,400+ devotees served daily through the bhojanshala',                  color: 'green' },
  { icon: Users,    title: 'Active Sangh',       desc: 'A vibrant community of 8,945 across India and abroad',                   color: 'black' },
];

const colorMap = {
  red:    { bg: 'bg-jain-red-600',    chip: 'bg-jain-red-600',    text: 'text-jain-red-700',    ring: 'border-jain-red-600' },
  yellow: { bg: 'bg-jain-yellow-400', chip: 'bg-jain-yellow-500', text: 'text-jain-yellow-800', ring: 'border-jain-yellow-500' },
  green:  { bg: 'bg-jain-green-600',  chip: 'bg-jain-green-700',  text: 'text-jain-green-700',  ring: 'border-jain-green-600' },
  black:  { bg: 'bg-jain-black-900',  chip: 'bg-jain-black-900',  text: 'text-jain-black-900',  ring: 'border-jain-black-900' },
};

export default function About() {
  return (
    <div className="bg-white">
      <PageHeroSmall
        eyebrow="ABOUT OUR DERASAR"
        title="A century of"
        accent="seva &amp; silence"
        description="Founded in 1924 by twelve sadharmik families, Shree Mahavir Jain Derasar has grown from a humble upashraya into the spiritual home of 8,945 devotees worldwide."
        breadcrumb={[{ label: 'About Us' }]}
      />

      {/* MISSION PILLARS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">01 — OUR MISSION</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14">
            <h2 className="lg:col-span-7 font-display text-4xl md:text-6xl font-bold text-jain-black-900 leading-[1.02]">
              Four pillars,<br />
              <span className="italic text-jain-red-600">one dharma</span>
            </h2>
            <p className="lg:col-span-5 text-jain-black-700 text-lg leading-relaxed">
              The values that have guided our sangh for a hundred years and continue to shape every
              decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {missionPillars.map((p, i) => {
              const c = colorMap[p.color];
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`group relative p-7 rounded-3xl bg-white border-2 ${c.ring} hover:-translate-y-1 transition-transform`}
                >
                  <span className={`absolute -top-3 left-7 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white ${c.chip}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={`w-14 h-14 rounded-2xl ${c.bg} ${p.color === 'yellow' ? 'text-jain-black-900' : 'text-white'} flex items-center justify-center mt-4`}>
                    <p.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className={`font-display text-2xl font-bold mt-5 ${c.text}`}>{p.title}</h3>
                  <p className="text-sm text-jain-black-700 mt-3 leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 bg-jain-yellow-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">02 — OUR STORY</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 text-jain-black-900 leading-[1.02]">
              Built on the shoulders<br />
              <span className="italic text-jain-red-600">of sevaks past.</span>
            </h2>
            <div className="space-y-4 mt-6 text-jain-black-800 leading-relaxed text-lg">
              <p>
                In 1924, twelve Jain families gathered in a small Walkeshwar bungalow to perform their
                first collective Snatra Pooja. From those modest beginnings, the sangh has grown into
                a 100-year-old institution serving devotees across India and the diaspora.
              </p>
              <p>
                Every brick of our white marble shikhar, every aagam in our library, every meal served
                at our bhojanshala carries the silent gratitude of generations of sevaks.
              </p>
            </div>

            <ul className="space-y-3 mt-8">
              {[
                'Astonishing marble shikhar architecture',
                'Active sadharmik community of 8,945',
                'Pathshala & sutra learning for children',
                'Aagam library with 15,000+ rare texts',
                'Daily bhojanshala serving 2,400+ devotees',
              ].map((h) => (
                <li key={h} className="flex items-center gap-3 text-jain-black-800">
                  <span className="w-6 h-6 rounded-full bg-jain-green-700 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </span>
                  <span className="font-medium">{h}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative aspect-square rounded-3xl bg-jain-red-600 p-8 text-white overflow-hidden">
              <JainFlagStripe orientation="vertical" className="absolute top-0 left-0 h-full" />
              <div className="absolute inset-0 bg-mandala opacity-15" />
              <div className="relative h-full pl-6 flex flex-col justify-between">
                <div>
                  <LotusGlyph className="w-12 h-12 text-jain-yellow-300" />
                  <p className="font-mono text-xs text-jain-yellow-300 mt-4 tracking-[0.3em]">EST.</p>
                  <p className="font-display text-[120px] font-bold text-jain-yellow-300 leading-none -mt-2">1924</p>
                  <p className="font-serif text-2xl italic mt-2">A century strong</p>
                </div>
                <div className="border-t-2 border-white/20 pt-5">
                  <p className="text-sm text-white/85 leading-relaxed">
                    Twelve families. One vision. Generations of sevaks united in dharma.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">03 — MILESTONES</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold text-jain-black-900 leading-[1.02] mb-14">
            A century of <span className="italic text-jain-red-600">milestones</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {timeline.map((t, i) => {
              const c = colorMap[t.tone];
              return (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                  className={`group p-7 rounded-3xl bg-white border-2 ${c.ring} hover:-translate-y-1 transition-transform`}
                >
                  <div className="flex items-baseline justify-between">
                    <p className={`font-display text-5xl font-bold ${c.text}`}>{t.year}</p>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white ${c.chip}`}>
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xl mt-4 text-jain-black-900">{t.title}</h3>
                  <p className="text-sm text-jain-black-700 mt-3 leading-relaxed">{t.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUSTEES */}
      <section className="py-24 bg-jain-black-900 text-white relative overflow-hidden">
        <JainFlagStripe height="h-1" className="absolute top-0 inset-x-0" />
        <JainFlagStripe height="h-1" className="absolute bottom-0 inset-x-0" />
        <div className="absolute inset-0 bg-mandala opacity-10" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-yellow-300 tracking-[0.3em]">04 — SANGH TRUSTEES</span>
            <span className="h-px flex-1 bg-jain-yellow-300/30" />
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.02] mb-14">
            Sevaks at <span className="italic text-jain-yellow-300">heart</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {trustees.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-6 rounded-3xl bg-white/5 border-2 border-white/10 hover:border-jain-yellow-400 transition-colors"
              >
                <img src={t.avatar} alt={t.name} className="w-24 h-24 mx-auto rounded-full ring-4 ring-jain-yellow-400" />
                <h3 className="font-serif font-bold mt-5">{t.name}</h3>
                <p className="text-sm text-jain-yellow-300 font-semibold mt-1">{t.role}</p>
                <p className="text-xs text-white/60 mt-2">Trustee since {t.since}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-jain-yellow-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-10 md:p-14 rounded-3xl bg-jain-red-600 text-white relative overflow-hidden">
            <JainFlagStripe orientation="vertical" className="absolute top-0 left-0 h-full" />
            <div className="absolute inset-0 bg-mandala opacity-15" />

            <div className="relative pl-6">
              <span className="font-mono text-xs font-bold text-jain-yellow-300 tracking-[0.3em]">JOIN THE SANGH</span>
              <h3 className="font-display text-3xl md:text-5xl font-bold mt-3 leading-tight">
                Become a part of<br /><span className="italic text-jain-yellow-300">our seva family.</span>
              </h3>
              <p className="text-white/85 mt-4 max-w-md">
                Membership unlocks priority darshan, pooja booking, sadharmik bhakti and lifelong sangha.
              </p>
            </div>
            <div className="relative flex flex-col gap-3 md:items-end">
              <Link to="/auth/register" className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-white text-jain-red-700 font-bold transition">
                Register now
                <span className="w-10 h-10 rounded-full bg-jain-red-600 text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-jain-yellow-300 text-jain-yellow-300 font-bold hover:bg-jain-yellow-400 hover:text-jain-black-900 hover:border-jain-yellow-400 transition">
                <Phone className="w-4 h-4" /> Call sangh office
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
