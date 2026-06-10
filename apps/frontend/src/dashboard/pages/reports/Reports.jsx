import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, CalendarRange, Building2, Download, BarChart3, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { Select } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { reportsApi, apiError } from '@services/rbacService';
import { formatCurrency, PROPERTY_CATEGORIES } from '@utils/constants';

const reportLinks = [
  { to: '/reports/property', label: 'Property-wise Report', desc: 'Jain Mandir, Gunfa, Hall, Commercial', icon: Building2, color: 'from-jain-green-500 to-jain-green-700' },
  { to: '/reports/revenue', label: 'Revenue Analytics',    desc: 'Donation & income trends',       icon: TrendingUp, color: 'from-saffron-500 to-saffron-600' },
  { to: '/reports/expense', label: 'Expense Analytics',    desc: 'Spending categories & vendors',   icon: TrendingDown, color: 'from-rose-400 to-rose-600' },
  { to: '/reports/events',  label: 'Event Performance',     desc: 'Attendance, revenue, ratings',   icon: CalendarRange, color: 'from-gold-400 to-saffron-500' },
];

export default function Reports() {
  const { toast } = useToast();
  const [data, setData] = useState({ totalRevenue: 0, totalExpenses: 0, netSurplus: 0, eventsHosted: 0, monthly: [] });
  const [byProp, setByProp] = useState({ rows: [], totals: { revenue: 0, expenses: 0, net: 0 } });
  const [prop, setProp] = useState('All'); // top property filter; 'All' shows everything

  // When a property is picked, the finance figures & the breakdown focus on it.
  const selRow = prop === 'All' ? null : (byProp.rows.find((r) => r.property === prop) || { revenue: 0, expenses: 0, net: 0 });
  const revenue = selRow ? selRow.revenue : data.totalRevenue;
  const expenses = selRow ? selRow.expenses : data.totalExpenses;
  const net = selRow ? selRow.net : data.netSurplus;
  const propRows = prop === 'All' ? byProp.rows : byProp.rows.filter((r) => r.property === prop);
  const shownTotals = selRow ? { revenue: selRow.revenue, expenses: selRow.expenses, net: selRow.net } : byProp.totals;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [d, p] = await Promise.all([reportsApi.summary(), reportsApi.byProperty()]);
        if (!cancelled) { setData(d); setByProp(p); }
      } catch (err) {
        toast.error(apiError(err));
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Powerful insights for sacred operations"
        breadcrumb={[{ label: 'Reports' }]}
        actions={
          <>
            <Select value={prop} onChange={(e) => setProp(e.target.value)} options={['All', ...PROPERTY_CATEGORIES]} containerClassName="w-36 sm:w-44" />
            <Select options={['Last 30 days', 'Last 90 days', 'This Year', 'All time']} defaultValue="Last 30 days" containerClassName="w-40 sm:w-44" />
            <Button variant="secondary" icon={Download}>Export All</Button>
          </>
        }
      />

      {prop !== 'All' && (
        <p className="text-sm text-neutral-500">
          Showing figures for <span className="font-semibold text-saffron-700 dark:text-saffron-400">{prop}</span>. Select <span className="font-medium">All</span> to see every property.
        </p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={TrendingUp} label="Total Revenue" value={formatCurrency(revenue)} tone="primary" />
        <StatsCard icon={TrendingDown} label="Total Expenses" value={formatCurrency(expenses)} tone="rose" />
        <StatsCard icon={BarChart3} label="Net Surplus" value={formatCurrency(net)} tone="emerald" />
        <StatsCard icon={CalendarRange} label="Events Hosted" value={String(data.eventsHosted)} tone="gold" />
      </div>

      <Card>
        <CardHeader title="Income vs Expense — Combined" subtitle="Full year comparative view" />
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer>
              <ComposedChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#ffc01e" radius={[8, 8, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expense" name="Expense" fill="#c8102e" radius={[8, 8, 0, 0]} maxBarSize={28} />
                <Line type="monotone" dataKey="income" stroke="#00843d" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* ── Property-wise breakdown ── */}
      <Card>
        <CardHeader title="By Property / Place" subtitle="Revenue, expense & net per temple property" />
        <CardBody className="space-y-5">
          <div className="h-72">
            <ResponsiveContainer>
              <ComposedChart data={propRows}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" vertical={false} />
                <XAxis dataKey="property" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#ffc01e" radius={[8, 8, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expenses" name="Expenses" fill="#c8102e" radius={[8, 8, 0, 0]} maxBarSize={40} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 border-b border-sand-200 dark:border-neutral-800">
                  <th className="py-2 pr-4">Property</th>
                  <th className="py-2 px-4 text-right">Donations</th>
                  <th className="py-2 px-4 text-right">Income</th>
                  <th className="py-2 px-4 text-right">Revenue</th>
                  <th className="py-2 px-4 text-right">Expenses</th>
                  <th className="py-2 pl-4 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {propRows.map((r) => (
                  <tr key={r.property} className="border-b border-sand-100 dark:border-neutral-800/60">
                    <td className="py-2.5 pr-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                        {r.property}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(r.donations)}</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(r.income)}</td>
                    <td className="py-2.5 px-4 text-right font-semibold gradient-text">{formatCurrency(r.revenue)}</td>
                    <td className="py-2.5 px-4 text-right text-jain-red-600">{formatCurrency(r.expenses)}</td>
                    <td className={`py-2.5 pl-4 text-right font-semibold ${r.net >= 0 ? 'text-jain-green-600' : 'text-jain-red-600'}`}>{formatCurrency(r.net)}</td>
                  </tr>
                ))}
                {propRows.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-neutral-500">No property data yet.</td></tr>
                )}
              </tbody>
              {propRows.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-sand-200 dark:border-neutral-700 font-bold">
                    <td className="py-2.5 pr-4">Total</td>
                    <td />
                    <td />
                    <td className="py-2.5 px-4 text-right gradient-text">{formatCurrency(shownTotals.revenue)}</td>
                    <td className="py-2.5 px-4 text-right text-jain-red-600">{formatCurrency(shownTotals.expenses)}</td>
                    <td className={`py-2.5 pl-4 text-right ${shownTotals.net >= 0 ? 'text-jain-green-600' : 'text-jain-red-600'}`}>{formatCurrency(shownTotals.net)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardBody>
      </Card>

      <h2 className="font-serif text-xl font-semibold mt-8">Detailed Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportLinks.map((r) => (
          <Link key={r.to} to={r.to}>
            <Card hover className="cursor-pointer group">
              <CardBody className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-lg`}>
                  <r.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif font-semibold text-lg">{r.label}</h3>
                  <p className="text-sm text-neutral-500">{r.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-saffron-600 group-hover:translate-x-1 transition-all" />
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
