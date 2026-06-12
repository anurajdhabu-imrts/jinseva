import { useEffect, useState } from 'react';
import { CalendarRange, Users, TrendingUp, Coins } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { useToast } from '@context/ToastContext';
import { eventsApi, apiError } from '@services/rbacService';
import { formatCurrency } from '@utils/constants';

export default function EventAnalytics() {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await eventsApi.analytics();
        if (!cancelled) setData(d);
      } catch (err) {
        toast.error(apiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading analytics…</p>;
  if (!data) return null;

  const byEvent = data.byEvent || [];
  const avgAttendance = data.totalEvents ? Math.round(data.totalAttendees / data.totalEvents) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Analytics"
        subtitle="Performance metrics across all events"
        breadcrumb={[{ label: 'Events', to: '/events' }, { label: 'Analytics' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={CalendarRange} label="Total Events" value={String(data.totalEvents || 0)} tone="gold" />
        <StatsCard icon={Users} label="Total Attendees" value={(data.totalAttendees || 0).toLocaleString('en-IN')} tone="primary" />
        <StatsCard icon={Coins} label="Event Revenue" value={formatCurrency(data.totalRaised || 0)} tone="emerald" />
        <StatsCard icon={TrendingUp} label="Avg Attendance" value={String(avgAttendance)} tone="violet" />
      </div>

      {byEvent.length === 0 ? (
        <Card><CardBody><p className="py-10 text-center text-sm text-neutral-500">No events to analyze yet.</p></CardBody></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader title="Revenue by event" subtitle="Donations raised per event" />
            <CardBody>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={byEvent}>
                    <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" vertical={false} />
                    <XAxis dataKey="event" stroke="#562F00" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="#562F00" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="revenue" name="Raised" fill="#FF9644" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Attendance by event" subtitle="Expected attendees per event" />
            <CardBody>
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={byEvent}>
                    <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" vertical={false} />
                    <XAxis dataKey="event" stroke="#562F00" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis stroke="#562F00" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} />
                    <Line type="monotone" dataKey="attendees" name="Attendees" stroke="#562F00" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
