import { useEffect, useState } from 'react';
import { Trophy, Users, Star, CalendarRange, Download, CalendarDays } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { useToast } from '@context/ToastContext';
import { reportsApi, apiError } from '@services/rbacService';
import { formatCurrency } from '@utils/constants';

const radarData = [
  { metric: 'Attendance',    value: 85 },
  { metric: 'Revenue',       value: 92 },
  { metric: 'Engagement',    value: 78 },
  { metric: 'Repeat Visits', value: 70 },
  { metric: 'Donation',       value: 88 },
  { metric: 'Volunteer',      value: 65 },
];

export default function EventPerformance() {
  const { toast } = useToast();
  const [d, setD] = useState({ byEvent: [], count: 0, totalRaised: 0, totalAttendees: 0, bestEvent: '—', bestEventRaised: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await reportsApi.events();
        if (!cancelled) setD(data);
      } catch (err) {
        toast.error(apiError(err));
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Performance"
        subtitle="Measure success of every event"
        breadcrumb={[{ label: 'Reports', to: '/reports' }, { label: 'Events' }]}
        actions={<Button icon={Download}>Export</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Trophy} label="Best Event" value={d.bestEvent} subtitle={formatCurrency(d.bestEventRaised) + ' raised'} tone="gold" />
        <StatsCard icon={Users} label="Total Attendees" value={Number(d.totalAttendees).toLocaleString('en-IN')} tone="primary" />
        <StatsCard icon={Star} label="Total Raised" value={formatCurrency(d.totalRaised)} tone="emerald" />
        <StatsCard icon={CalendarRange} label="Events" value={String(d.count)} tone="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue per event" />
          <CardBody>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={d.byEvent} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" vertical={false} />
                  <XAxis dataKey="event" stroke="#94a3b8" />
                  <YAxis yAxisId="left" stroke="#94a3b8" tickFormatter={(v) => `${v/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v, n) => n === 'revenue' ? formatCurrency(v) : v} />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#ffc01e" radius={[8, 8, 0, 0]} maxBarSize={32} />
                  <Bar yAxisId="right" dataKey="attendees" name="Attendees" fill="#00843d" radius={[8, 8, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Performance radar" />
          <CardBody>
            <div className="h-72">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(120,120,120,0.2)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar name="Score" dataKey="value" stroke="#ffc01e" fill="#ffc01e" fillOpacity={0.4} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Events leaderboard" subtitle="Ranked by funds raised" />
        <CardBody className="p-0">
          {d.byEvent.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">No events to rank yet.</p>
          ) : (
          <div className="divide-y divide-sand-100 dark:divide-neutral-800">
            {d.byEvent.slice(0, 6).map((e, i) => (
              <div key={e.event + i} className="flex items-center gap-4 p-4 hover:bg-sand-50/50 dark:hover:bg-neutral-800/30">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  i === 0 ? 'bg-gradient-to-br from-gold-400 to-saffron-600 text-white' :
                  i === 1 ? 'bg-gradient-to-br from-sand-300 to-sand-500 text-white' :
                  i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                  'bg-sand-100 dark:bg-neutral-800 text-neutral-600'
                }`}>#{i + 1}</div>
                <div className="w-12 h-12 rounded-lg bg-saffron-100 dark:bg-saffron-500/15 flex items-center justify-center text-saffron-600">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{e.event}</p>
                  <p className="text-xs text-neutral-500">{e.attendees.toLocaleString('en-IN')} expected</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold gradient-text">{formatCurrency(e.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
