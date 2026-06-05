import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, CalendarRange, FileText, Download, BarChart3, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { Select } from '@components/Input';
import { monthlyIncomeExpense, eventRevenue } from '@data/mockData';
import { formatCurrency } from '@utils/constants';

const reportLinks = [
  { to: '/reports/revenue', label: 'Revenue Analytics',    desc: 'Donation & income trends',       icon: TrendingUp, color: 'from-saffron-500 to-saffron-600' },
  { to: '/reports/expense', label: 'Expense Analytics',    desc: 'Spending categories & vendors',   icon: TrendingDown, color: 'from-rose-400 to-rose-600' },
  { to: '/reports/events',  label: 'Event Performance',     desc: 'Attendance, revenue, ratings',   icon: CalendarRange, color: 'from-gold-400 to-saffron-500' },
  { to: '/donations/analytics', label: 'Donor Insights',  desc: 'Behavior & retention',           icon: FileText, color: 'from-violet-400 to-violet-600' },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Powerful insights for sacred operations"
        breadcrumb={[{ label: 'Reports' }]}
        actions={
          <>
            <Select options={['Last 30 days', 'Last 90 days', 'This Year', 'All time']} defaultValue="Last 30 days" />
            <Button variant="secondary" icon={Download}>Export All</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={TrendingUp} label="Total Revenue" value={formatCurrency(4825670)} growth={18.4} tone="primary" />
        <StatsCard icon={TrendingDown} label="Total Expenses" value={formatCurrency(1842300)} growth={-3.2} tone="rose" />
        <StatsCard icon={BarChart3} label="Net Surplus" value={formatCurrency(2983370)} growth={26.8} tone="emerald" />
        <StatsCard icon={CalendarRange} label="Events Hosted" value="124" growth={18.4} tone="gold" />
      </div>

      <Card>
        <CardHeader title="Income vs Expense — Combined" subtitle="Full year comparative view" />
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer>
              <ComposedChart data={monthlyIncomeExpense}>
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
