import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { monthlyIncomeExpense } from '@data/mockData';
import Card, { CardHeader, CardBody } from '@components/Card';

export default function IncomeExpenseChart() {
  return (
    <Card>
      <CardHeader title="Income vs Expense" subtitle="Monthly comparison this year" />
      <CardBody>
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={monthlyIncomeExpense} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#ffc01e" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#ffc01e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#c8102e" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#c8102e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30,27,24,0.95)',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 12,
                }}
                formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="income"  name="Income"  stroke="#ffc01e" strokeWidth={2.5} fill="url(#inc)" />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#c8102e" strokeWidth={2.5} fill="url(#exp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
