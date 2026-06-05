import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Download, Filter, TrendingUp, HandHeart, Coins, Award } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { Select } from '@components/Input';
import { monthlyIncomeExpense, donationCategories } from '@data/mockData';
import { formatCurrency } from '@utils/constants';

export default function RevenueAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Analytics"
        subtitle="Deep insights into temple income"
        breadcrumb={[{ label: 'Reports', to: '/reports' }, { label: 'Revenue' }]}
        actions={
          <>
            <Select options={['This Year', 'Last Year', 'Last 90 days', 'Last 30 days']} />
            <Button variant="secondary" icon={Filter}>Filters</Button>
            <Button icon={Download}>Export</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={HandHeart} label="Total Revenue" value={formatCurrency(4825670)} growth={18.4} tone="primary" />
        <StatsCard icon={Coins} label="Donations" value={formatCurrency(3650000)} growth={22.5} tone="gold" />
        <StatsCard icon={Award} label="Pooja Fees" value={formatCurrency(845000)} growth={12.0} tone="emerald" />
        <StatsCard icon={TrendingUp} label="Misc Income" value={formatCurrency(330670)} growth={4.2} tone="violet" />
      </div>

      <Card>
        <CardHeader title="Revenue Trend" subtitle="Monthly income flow" />
        <CardBody>
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={monthlyIncomeExpense}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffc01e" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#ffc01e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                <Area type="monotone" dataKey="income" stroke="#ffc01e" strokeWidth={3} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Revenue by Category" />
          <CardBody>
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={donationCategories} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={3} stroke="none">
                    {donationCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Top Donors (Lifetime)" />
          <CardBody>
            <div className="space-y-3">
              {[
                { name: 'Lakshmi Bhandari', amount: 525000, count: 12 },
                { name: 'Priya Jain',        amount: 412000, count: 24 },
                { name: 'Kirti Parekh',      amount: 385000, count: 18 },
                { name: 'Mohan Bhansali',    amount: 348000, count: 15 },
                { name: 'Geetha Kothari',    amount: 295000, count: 21 },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-sand-50/50 dark:hover:bg-neutral-800/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-saffron-600 text-white flex items-center justify-center font-bold text-sm">#{i + 1}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{d.name}</p>
                    <p className="text-xs text-neutral-500">{d.count} contributions</p>
                  </div>
                  <p className="font-semibold gradient-text">{formatCurrency(d.amount)}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
