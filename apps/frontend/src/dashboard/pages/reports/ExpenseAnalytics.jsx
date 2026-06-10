import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingDown, Receipt, Building2, Wallet } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { useToast } from '@context/ToastContext';
import { reportsApi, apiError } from '@services/rbacService';
import { formatCurrency } from '@utils/constants';

export default function ExpenseAnalytics() {
  const { toast } = useToast();
  const [d, setD] = useState({ totalExpense: 0, avgMonthly: 0, transactions: 0, vendors: 0, byCategory: [], monthly: [] });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await reportsApi.expense();
        if (!cancelled) setD(data);
      } catch (err) {
        toast.error(apiError(err));
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  const categoryBreakdown = d.byCategory;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Analytics"
        subtitle="Understand where every rupee goes"
        breadcrumb={[{ label: 'Reports', to: '/reports' }, { label: 'Expense' }]}
        actions={<Button icon={Download}>Export</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Wallet} label="Total Expense" value={formatCurrency(d.totalExpense)} tone="rose" />
        <StatsCard icon={TrendingDown} label="Avg Monthly" value={formatCurrency(d.avgMonthly)} tone="primary" />
        <StatsCard icon={Receipt} label="Transactions" value={String(d.transactions)} tone="gold" />
        <StatsCard icon={Building2} label="Active Vendors" value={String(d.vendors)} tone="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Expense breakdown" />
          <CardBody>
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={3} stroke="none">
                    {categoryBreakdown.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryBreakdown.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                  <span className="text-neutral-700 dark:text-neutral-300">{c.name}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Monthly expense trend" />
          <CardBody>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={d.monthly}>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="expense" fill="#c8102e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
