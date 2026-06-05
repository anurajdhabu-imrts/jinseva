import { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@context/ToastContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    toast.success('Subscribed! Look out for weekly dharma updates.');
    setEmail('');
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-maroon-800 via-saffron-700 to-maroon-900 text-white p-8 md:p-14">
      <div className="absolute inset-0 bg-mandala opacity-25" />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold-400/25 blur-3xl" />
      <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-200">Stay Connected</span>
          <h3 className="font-display text-3xl md:text-5xl font-bold mt-3 leading-tight">
            Weekly dharma updates,<br />
            <span className="text-gold-300">festival reminders</span> &amp; more.
          </h3>
          <p className="text-white/85 mt-3 max-w-md">
            Join 8,945 devotees who receive curated dharma readings every Sunday. Unsubscribe anytime.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-white/60" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/15 focus:border-gold-300 transition-all"
            />
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-saffron-700 font-semibold hover:-translate-y-0.5 hover:shadow-2xl transition-all">
            {done ? <><CheckCircle2 className="w-5 h-5" /> Subscribed</> : <>Subscribe <Send className="w-4 h-4" /></>}
          </button>
          <p className="text-xs text-white/60 text-center">We respect ahimsa — no spam, ever.</p>
        </form>
      </div>
    </div>
  );
}
