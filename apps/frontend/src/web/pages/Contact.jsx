import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Clock, Send, MessageSquare, ArrowUpRight, Check,
} from 'lucide-react';
import Input, { Textarea, Select } from '@components/Input';
import Card, { CardBody, CardHeader } from '@components/Card';
import JainFlagStripe from '@web/components/JainFlagStripe';
import { LotusGlyph } from '@web/components/OrnamentalDivider';
import PageHeroSmall from '@web/components/PageHeroSmall';
import { useToast } from '@context/ToastContext';
import { publicApi, apiError } from '@services/rbacService';

const contactBlocks = [
  {
    tone: 'red',
    icon: MapPin,
    label: 'Visit Us',
    primary: '123 Derasar Marg',
    secondary: 'Walkeshwar, Mumbai 400006',
    cta: 'Get directions',
  },
  {
    tone: 'yellow',
    icon: Phone,
    label: 'Call Us',
    primary: '+91 22 9876 5432',
    secondary: '+91 98765 12345',
    cta: 'Call now',
  },
  {
    tone: 'green',
    icon: Mail,
    label: 'Email Us',
    primary: 'info@jinalaya.org',
    secondary: 'sangh@jinalaya.org',
    cta: 'Send email',
  },
];

const colorMap = {
  red:    { bg: 'bg-jain-red-600',    chip: 'bg-jain-red-600',    text: 'text-jain-red-700',    ring: 'border-jain-red-600',    soft: 'bg-jain-red-50' },
  yellow: { bg: 'bg-jain-yellow-400', chip: 'bg-jain-yellow-500', text: 'text-jain-yellow-800', ring: 'border-jain-yellow-500', soft: 'bg-jain-yellow-50' },
  green:  { bg: 'bg-jain-green-700',  chip: 'bg-jain-green-700',  text: 'text-jain-green-700',  ring: 'border-jain-green-600',  soft: 'bg-jain-green-50' },
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return toast.error('Please fill in your name, email and message.');
    }
    setSending(true);
    try {
      const res = await publicApi.contact(form);
      toast.success(res?.message || 'Your message has been received. Jai Jinendra!');
      if (res?.note) toast.info ? toast.info(res.note) : toast.success(res.note);
      setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white">
      <PageHeroSmall
        eyebrow="GET IN TOUCH"
        title="We'd love to"
        accent="hear from you"
        description="Questions, pooja bookings, special requests — our sangh sevaks are here to help. We typically respond within 24 hours."
        breadcrumb={[{ label: 'Contact' }]}
      />

      {/* Quick contact strip */}
      <section className="py-8 bg-jain-yellow-50 border-b-2 border-jain-yellow-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border-2 border-jain-red-200 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-jain-red-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase font-bold text-jain-red-700 tracking-wider">Call</p>
                <p className="font-bold text-jain-black-900">+91 22 9876 5432</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border-2 border-jain-yellow-300 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-jain-yellow-400 text-jain-black-900 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase font-bold text-jain-yellow-800 tracking-wider">Email</p>
                <p className="font-bold text-jain-black-900">info@jinalaya.org</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border-2 border-jain-green-300 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-jain-green-700 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase font-bold text-jain-green-700 tracking-wider">Visit</p>
                <p className="font-bold text-jain-black-900">Walkeshwar, Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT BLOCKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">01 — THREE WAYS TO REACH US</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {contactBlocks.map((b, i) => {
              const c = colorMap[b.tone];
              return (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`group relative p-8 rounded-3xl bg-white border-2 ${c.ring} hover:-translate-y-1 transition-transform`}
                >
                  <span className={`absolute -top-3 left-7 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white ${c.chip}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={`w-16 h-16 rounded-2xl ${c.bg} ${b.tone === 'yellow' ? 'text-jain-black-900' : 'text-white'} flex items-center justify-center mt-4`}>
                    <b.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className={`font-display text-2xl font-bold mt-5 ${c.text}`}>{b.label}</h3>
                  <p className="font-bold text-jain-black-900 mt-3">{b.primary}</p>
                  <p className="text-sm text-jain-black-600 mt-1">{b.secondary}</p>
                  <button className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-jain-black-900">
                    {b.cta}
                    <span className={`w-8 h-8 rounded-full ${c.bg} ${b.tone === 'yellow' ? 'text-jain-black-900' : 'text-white'} flex items-center justify-center group-hover:rotate-45 transition-transform`}>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="py-24 bg-jain-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-xs font-bold text-jain-red-600 tracking-[0.3em]">02 — SEND A MESSAGE</span>
            <span className="h-px flex-1 bg-jain-yellow-300" />
            <JainFlagStripe height="h-1" className="w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
            <h2 className="lg:col-span-7 font-display text-4xl md:text-6xl font-bold text-jain-black-900 leading-[1.02]">
              How can we<br />
              <span className="italic text-jain-red-600">serve you?</span>
            </h2>
            <p className="lg:col-span-5 text-jain-black-700 text-lg leading-relaxed">
              Drop us a line — for pooja bookings, volunteering or simply to say Jai Jinendra.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <form onSubmit={submit} className="lg:col-span-3">
              <Card className="rounded-3xl border-2 border-jain-yellow-300">
                <CardHeader title="Tell us about your inquiry" subtitle="We respond within 24 hours" />
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <Input label="Phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <Input label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <Select label="Subject" options={['General Inquiry', 'Pooja Booking', 'Volunteer Interest', 'Hall Booking', 'Other']} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  <Textarea label="Message" rows={6} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  <button type="submit" disabled={sending} className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-jain-red-600 hover:bg-jain-red-700 disabled:opacity-60 text-white font-bold transition-all">
                    {sending ? 'Sending…' : 'Send message'}
                    <span className="w-10 h-10 rounded-full bg-jain-yellow-400 text-jain-red-700 flex items-center justify-center group-hover:rotate-45 transition-transform">
                      <Send className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </CardBody>
              </Card>
            </form>

            <div className="lg:col-span-2 space-y-5">
              {/* Map card */}
              <Card className="overflow-hidden rounded-3xl border-2 border-jain-yellow-300">
                <div className="aspect-[4/3] relative bg-jain-yellow-100">
                  <iframe
                    title="Derasar location"
                    src="https://maps.google.com/maps?q=Walkeshwar%20Mumbai&output=embed"
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>
                <CardBody>
                  <a href="https://maps.google.com/maps?q=Walkeshwar%20Mumbai" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-sm font-bold text-jain-red-700">
                    Open in Google Maps
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                  </a>
                </CardBody>
              </Card>

              {/* Visiting hours — flat Jain green block */}
              <Card className="rounded-3xl overflow-hidden border-0">
                <div className="relative p-7 bg-jain-green-700 text-white">
                  <JainFlagStripe orientation="vertical" className="absolute top-0 left-0 h-full" />
                  <div className="relative pl-4">
                    <LotusGlyph className="w-8 h-8 text-jain-yellow-300 mb-3" />
                    <h3 className="font-serif text-xl font-bold">Visiting hours</h3>
                    <div className="mt-4 space-y-2 text-sm">
                      {[
                        ['Morning Darshan',  '5:30 AM – 12:30 PM'],
                        ['Afternoon Close',  '12:30 PM – 3:30 PM'],
                        ['Evening Darshan',  '3:30 PM – 9:00 PM'],
                        ['Sunday Pravachan', '5:00 PM – 7:00 PM'],
                      ].map(([l, v]) => (
                        <div key={l} className="flex items-center justify-between py-2 border-b border-white/15 last:border-0">
                          <span className="text-white/80 inline-flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-jain-yellow-300" />{l}</span>
                          <span className="font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* WhatsApp */}
              <Card className="rounded-3xl overflow-hidden border-0">
                <div className="relative p-7 bg-jain-black-900 text-white">
                  <JainFlagStripe height="h-1" className="absolute top-0 inset-x-0" />
                  <MessageSquare className="w-8 h-8 mb-3 text-jain-yellow-300" />
                  <h3 className="font-serif font-bold text-xl">WhatsApp Support</h3>
                  <p className="text-sm text-white/85 mt-2">For pooja bookings &amp; urgent queries — fastest response.</p>
                  <a href="https://wa.me/919876512345" className="group inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full bg-jain-yellow-400 text-jain-black-900 font-bold text-sm mt-5 hover:-translate-y-0.5 transition">
                    Chat on WhatsApp
                    <span className="w-9 h-9 rounded-full bg-jain-black-900 text-jain-yellow-400 flex items-center justify-center group-hover:rotate-45 transition-transform">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ trust block */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { l: 'Within 24h',  d: 'Email response time',     c: 'red' },
              { l: '5 sevaks',    d: 'On the sangh office desk', c: 'yellow' },
              { l: '6 days/week', d: 'Office open Mon–Sat',     c: 'green' },
              { l: 'Multilingual',d: 'Gujarati, Hindi, English', c: 'black' },
            ].map((b, i) => {
              const cm = colorMap[b.c] || { bg: 'bg-jain-black-900', text: 'text-jain-black-900', ring: 'border-jain-black-900' };
              return (
                <motion.div
                  key={b.l}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`text-center p-6 rounded-2xl border-2 ${cm.ring} bg-white`}
                >
                  <span className={`inline-flex w-10 h-10 rounded-full ${cm.bg} ${b.c === 'yellow' ? 'text-jain-black-900' : 'text-white'} items-center justify-center mb-3`}>
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </span>
                  <p className={`font-display text-2xl font-bold ${cm.text}`}>{b.l}</p>
                  <p className="text-xs text-jain-black-600 mt-1.5">{b.d}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-jain-yellow-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-10 md:p-14 rounded-3xl bg-jain-red-600 text-white relative overflow-hidden">
            <JainFlagStripe orientation="vertical" className="absolute top-0 left-0 h-full" />
            <div className="absolute inset-0 bg-mandala opacity-15" />

            <div className="relative pl-6">
              <span className="font-mono text-xs font-bold text-jain-yellow-300 tracking-[0.3em]">DIRECTIONS</span>
              <h3 className="font-display text-3xl md:text-5xl font-bold mt-3 leading-tight">
                Visit us in<br /><span className="italic text-jain-yellow-300">Walkeshwar.</span>
              </h3>
              <p className="text-white/85 mt-4 max-w-md">
                Step inside our 100-year-old derasar and feel the silent presence of dharma. Daily darshan open to all.
              </p>
            </div>
            <div className="relative flex md:justify-end">
              <a href="https://maps.google.com/maps?q=Walkeshwar%20Mumbai" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-jain-yellow-400 text-jain-black-900 font-bold transition">
                Get directions
                <span className="w-10 h-10 rounded-full bg-jain-black-900 text-jain-yellow-400 flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
