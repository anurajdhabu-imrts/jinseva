import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingDown, Receipt, Building2, Wallet } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { monthlyIncomeExpense } from '@data/mockData';
import { formatCurrency, EXPENSE_CATEGORIES } from '@utils/constants';

const categoryBreakdown = EXPENSE_CATEGORIES.slice(0, 6).map((cat, i) => ({
  name: cat,
  value: 50000 + i * 35000 + 20000,
  color: ['#ffc01e', '#c8102e', '#00843d', '#1a1b22', '#d68500', '#761120'][i],
}));

export default function ExpenseAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Analytics"
        subtitle="Understand where every rupee goes"
        breadcrumb={[{ label: 'Reports', to: '/reports' }, { label: 'Expense' }]}
        actions={<Button icon={Download}>Export</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Wallet} label="Total Expense" value={formatCurrency(1842300)} growth={-3.2} tone="rose" />
        <StatsCard icon={TrendingDown} label="Avg Monthly" value={formatCurrency(178000)} growth={-8.4} tone="primary" />
        <StatsCard icon={Receipt} label="Transactions" value="248" growth={2.4} tone="gold" />
        <StatsCard icon={Building2} label="Active Vendors" value="42" growth={5.0} tone="violet" />
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
                <BarChart data={monthlyIncomeExpense}>
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
