import { Sparkles, Send, Download, Share2 } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';

const greetings = [
  { id: 1, title: 'Diwali Nirvana Mahotsav', festival: 'Mahaparva',     date: '2026-11-12', gradient: 'from-saffron-500 via-rose-500 to-maroon-700',      icon: '🪔' },
  { id: 2, title: 'Mahavir Janma Kalyanak', festival: 'Janma Kalyanak', date: '2026-04-15', gradient: 'from-saffron-500 via-saffron-600 to-maroon-700',    icon: '🪷' },
  { id: 3, title: 'Paryushan Mahaparva',     festival: 'Mahaparva',     date: '2026-08-30', gradient: 'from-rose-500 via-rose-600 to-maroon-800',          icon: '🕊️' },
  { id: 4, title: 'Kshamavani — Micchami Dukkadam', festival: 'Forgiveness', date: '2026-09-08', gradient: 'from-emerald-500 via-emerald-600 to-teal-700', icon: '🙏' },
  { id: 5, title: 'Das Lakshan Parva',       festival: 'Mahaparva',     date: '2026-09-10', gradient: 'from-gold-400 via-saffron-500 to-saffron-700',      icon: '🌟' },
  { id: 6, title: 'Aayambil Oli',             festival: 'Tapasya',       date: '2026-05-29', gradient: 'from-violet-400 via-violet-600 to-violet-800',      icon: '☸️' },
  { id: 7, title: 'Mauna Ekadashi',          festival: 'Vrat',          date: '2026-12-09', gradient: 'from-slate-600 via-slate-700 to-violet-900',         icon: '🤫' },
  { id: 8, title: 'Akshay Tritiya',           festival: 'Mahaparva',     date: '2026-05-09', gradient: 'from-gold-400 via-saffron-600 to-maroon-700',       icon: '✨' },
];

export default function GreetingCards() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Festival Greeting Cards"
        subtitle="Send personalized blessings to devotees"
        breadcrumb={[{ label: 'Communication', to: '/communication' }, { label: 'Greetings' }]}
        actions={<Button icon={Sparkles}>Create Custom</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {greetings.map((g) => (
          <Card key={g.id} hover className="overflow-hidden group">
            <div className={`aspect-[4/5] bg-gradient-to-br ${g.gradient} text-white p-6 flex flex-col items-center justify-center text-center relative`}>
              <div className="absolute inset-0 bg-mandala opacity-30" />
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative z-10">
                <div className="text-6xl mb-3 animate-float">{g.icon}</div>
                <h3 className="font-display text-2xl font-bold leading-tight">{g.title}</h3>
                <p className="font-serif italic text-sm mt-2 opacity-90">May the divine bless you abundantly</p>
                <p className="text-[10px] uppercase tracking-wider mt-4 opacity-75">~ Shree Jinalaya ~</p>
              </div>
            </div>
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="primary">{g.festival}</Badge>
                <span className="text-xs text-neutral-500">{new Date(g.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="flex gap-1">
                <Button size="sm" icon={Send} fullWidth>Send</Button>
                <Button size="sm" variant="ghost" className="px-2.5"><Download className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" className="px-2.5"><Share2 className="w-4 h-4" /></Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
