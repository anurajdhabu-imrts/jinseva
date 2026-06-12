import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { HandHeart, TrendingUp, Users, Award, Download } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import Button from '@components/Button';
import { useToast } from '@context/ToastContext';
import { donationsApi, apiError } from '@services/rbacService';
import { formatCurrency } from '@utils/constants';

const PALETTE = ['#FF9644', '#562F00', '#FFCE99', '#562F00', '#562F00', '#562F00'];

export default function DonationAnalytics() {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await donationsApi.analytics();
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

  const total = data.totalAmount || 0;
  const count = data.count || 0;
  const avg = count ? Math.round(total / count) : 0;
  const monthly = (data.monthly || []).map((m) => ({ month: m.month, income: m.total }));
  const methods = (data.byMethod || []).map((m, i) => ({ ...m, color: PALETTE[i % PALETTE.length] }));
  const byType = (data.byType || []).map((t, i) => ({ ...t, color: PALETTE[i % PALETTE.length] }));
  const topType = byType[0]?.name ?? '—';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Analytics"
        subtitle="Insights to power your fundraising strategy"
        breadcrumb={[{ label: 'Donations', to: '/donations' }, { label: 'Analytics' }]}
        actions={<Button variant="secondary" icon={Download}>Export Report</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={HandHeart} label="Total Raised" value={formatCurrency(total)} tone="primary" />
        <StatsCard icon={Users} label="Donations" value={String(count)} tone="emerald" />
        <StatsCard icon={TrendingUp} label="Avg Donation" value={formatCurrency(avg)} tone="gold" />
        <StatsCard icon={Award} label="Top Purpose" value={topType} tone="violet" />
      </div>

      <Card>
        <CardHeader title="Donations over time" subtitle="Monthly contribution trend" />
        <CardBody>
          <div className="h-80">
            {monthly.length === 0 ? (
              <p className="h-full grid place-items-center text-sm text-neutral-500">No donation data yet.</p>
            ) : (
              <ResponsiveContainer>
                <AreaChart data={monthly}>
                  <defs>
                    <linearGradient id="dnArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF9644" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#FF9644" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" />
                  <XAxis dataKey="month" stroke="#562F00" />
                  <YAxis stroke="#562F00" tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="income" stroke="#FF9644" strokeWidth={3} fill="url(#dnArea)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Payment methods" subtitle="How donors prefer to give" />
          <CardBody>
            <div className="flex items-center gap-6">
              <div className="w-48 h-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={methods} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                      {methods.map((m, i) => <Cell key={i} fill={m.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {methods.map((m) => (
                  <div key={m.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5"><span className="w-3 h-3 rounded-full" style={{ background: m.color }} /><span className="text-sm">{m.name}</span></div>
                    <span className="text-sm font-semibold">{formatCurrency(m.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="By purpose" subtitle="Where donations are directed" />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={byType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" horizontal={false} />
                  <XAxis type="number" stroke="#562F00" tickFormatter={(v) => `${v / 1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="#562F00" width={90} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                    {byType.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
