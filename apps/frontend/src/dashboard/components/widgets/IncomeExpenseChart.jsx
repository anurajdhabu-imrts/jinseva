import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import Card, { CardHeader, CardBody } from '@components/Card';

export default function IncomeExpenseChart({ data = [] }) {
  return (
    <Card>
      <CardHeader title="Income vs Expense" subtitle="Monthly comparison this year" />
      <CardBody>
        <div className="h-72">
          {data.length === 0 ? (
            <p className="h-full grid place-items-center text-sm text-neutral-500">No income/expense data yet.</p>
          ) : (
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#FF9644" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#FF9644" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#562F00" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#562F00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" />
              <XAxis dataKey="month" stroke="#562F00" fontSize={12} />
              <YAxis stroke="#562F00" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
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
              <Area type="monotone" dataKey="income"  name="Income"  stroke="#FF9644" strokeWidth={2.5} fill="url(#inc)" />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#562F00" strokeWidth={2.5} fill="url(#exp)" />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
