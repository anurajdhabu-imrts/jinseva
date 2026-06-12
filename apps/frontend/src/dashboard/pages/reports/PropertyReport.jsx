import { useEffect, useState, useMemo } from 'react';
import { Building2, TrendingUp, TrendingDown, Wallet, HandHeart, Coins, Download } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import { Select } from '@components/Input';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { useToast } from '@context/ToastContext';
import { reportsApi, apiError } from '@services/rbacService';
import { PROPERTY_CATEGORIES, formatCurrency } from '@utils/constants';

export default function PropertyReport() {
  const { toast } = useToast();
  const [data, setData] = useState({ rows: [], totals: { revenue: 0, expenses: 0, net: 0 } });
  const [picked, setPicked] = useState('All');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await reportsApi.byProperty();
        if (!cancelled) setData(d);
      } catch (err) {
        toast.error(apiError(err));
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  const rowFor = (name) => data.rows.find((r) => r.property === name)
    || { property: name, donations: 0, income: 0, revenue: 0, expenses: 0, net: 0, color: '#562F00' };

  // Cards for the 4 canonical properties (always shown, even at zero).
  const cards = useMemo(() => PROPERTY_CATEGORIES.map(rowFor), [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = picked === 'All' ? null : rowFor(picked);
  const chartRows = picked === 'All' ? data.rows : [rowFor(picked)];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property-wise Report"
        subtitle="Income, donations & expenses for each temple property"
        breadcrumb={[{ label: 'Reports', to: '/reports' }, { label: 'Property' }]}
        actions={
          <>
            <Select value={picked} onChange={(e) => setPicked(e.target.value)} options={['All', ...PROPERTY_CATEGORIES]} className="md:max-w-[200px]" />
            <Button variant="secondary" icon={Download}>Export</Button>
          </>
        }
      />

      {/* Per-property summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((r) => (
          <Card key={r.property} hover className={picked === r.property ? 'ring-2 ring-saffron-500' : ''}>
            <CardBody className="cursor-pointer" onClick={() => setPicked(picked === r.property ? 'All' : r.property)}>
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: r.color }}>
                  <Building2 className="w-5 h-5" />
                </span>
                <span className={`text-xs font-semibold ${r.net >= 0 ? 'text-jain-green-600' : 'text-jain-red-600'}`}>
                  {r.net >= 0 ? 'Surplus' : 'Deficit'}
                </span>
              </div>
              <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">{r.property}</p>
              <p className="font-display text-2xl font-bold gradient-text mt-1">{formatCurrency(r.revenue)}</p>
              <p className="text-xs text-neutral-500 mt-1">Net {formatCurrency(r.net)} · Exp {formatCurrency(r.expenses)}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Totals strip */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={TrendingUp} label="Total Revenue" value={formatCurrency(data.totals.revenue)} tone="primary" />
        <StatsCard icon={TrendingDown} label="Total Expenses" value={formatCurrency(data.totals.expenses)} tone="rose" />
        <StatsCard icon={Wallet} label="Net Surplus" value={formatCurrency(data.totals.net)} tone="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue vs Expenses" subtitle={picked === 'All' ? 'Across all properties' : picked} />
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer>
                <ComposedChart data={chartRows}>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" vertical={false} />
                  <XAxis dataKey="property" stroke="#562F00" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#562F00" tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#FF9644" radius={[8, 8, 0, 0]} maxBarSize={48} />
                  <Bar dataKey="expenses" name="Expenses" fill="#562F00" radius={[8, 8, 0, 0]} maxBarSize={48} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Focused breakdown / composition */}
        <Card>
          <CardHeader title={selected ? `${selected.property} breakdown` : 'Revenue composition'} />
          <CardBody>
            {selected ? (
              <div className="space-y-3">
                {[
                  { l: 'Donations', v: selected.donations, i: HandHeart },
                  { l: 'Income', v: selected.income, i: Coins },
                  { l: 'Revenue', v: selected.revenue, i: TrendingUp },
                  { l: 'Expenses', v: selected.expenses, i: TrendingDown },
                ].map((d) => (
                  <div key={d.l} className="flex items-center justify-between p-3 rounded-xl bg-sand-50 dark:bg-neutral-800/50">
                    <span className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300"><d.i className="w-4 h-4" /> {d.l}</span>
                    <span className="font-semibold">{formatCurrency(d.v)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 rounded-xl border-2 border-dashed border-saffron-300 dark:border-saffron-500/30">
                  <span className="text-sm font-semibold">Net</span>
                  <span className={`font-bold ${selected.net >= 0 ? 'text-jain-green-600' : 'text-jain-red-600'}`}>{formatCurrency(selected.net)}</span>
                </div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={data.rows.filter((r) => r.revenue > 0)} dataKey="revenue" nameKey="property" innerRadius={55} outerRadius={95} paddingAngle={3} stroke="none">
                      {data.rows.map((r, i) => <Cell key={i} fill={r.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Detailed table */}
      <Card>
        <CardHeader title="Full breakdown" subtitle="Donations · Income · Revenue · Expenses · Net per property" />
        <CardBody className="overflow-x-auto">
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
              {data.rows.map((r) => (
                <tr key={r.property} className="border-b border-sand-100 dark:border-neutral-800/60">
                  <td className="py-2.5 pr-4 font-medium">
                    <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />{r.property}</span>
                  </td>
                  <td className="py-2.5 px-4 text-right">{formatCurrency(r.donations)}</td>
                  <td className="py-2.5 px-4 text-right">{formatCurrency(r.income)}</td>
                  <td className="py-2.5 px-4 text-right font-semibold gradient-text">{formatCurrency(r.revenue)}</td>
                  <td className="py-2.5 px-4 text-right text-jain-red-600">{formatCurrency(r.expenses)}</td>
                  <td className={`py-2.5 pl-4 text-right font-semibold ${r.net >= 0 ? 'text-jain-green-600' : 'text-jain-red-600'}`}>{formatCurrency(r.net)}</td>
                </tr>
              ))}
              {data.rows.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-neutral-500">No property data yet.</td></tr>
              )}
            </tbody>
            {data.rows.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-sand-200 dark:border-neutral-700 font-bold">
                  <td className="py-2.5 pr-4">Total</td>
                  <td /><td />
                  <td className="py-2.5 px-4 text-right gradient-text">{formatCurrency(data.totals.revenue)}</td>
                  <td className="py-2.5 px-4 text-right text-jain-red-600">{formatCurrency(data.totals.expenses)}</td>
                  <td className={`py-2.5 pl-4 text-right ${data.totals.net >= 0 ? 'text-jain-green-600' : 'text-jain-red-600'}`}>{formatCurrency(data.totals.net)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
