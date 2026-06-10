import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Card, { CardHeader, CardBody } from '@components/Card';
import { formatCurrency } from '@utils/constants';

export default function EventRevenueChart({ data = [] }) {
  return (
    <Card>
      <CardHeader title="Event Revenue" subtitle="Top performing celebrations" />
      <CardBody>
        <div className="h-72">
          {data.length === 0 ? (
            <p className="h-full grid place-items-center text-sm text-neutral-500">No event donations yet.</p>
          ) : (
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#ffc01e" />
                  <stop offset="100%" stopColor="#c8102e" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" vertical={false} />
              <XAxis dataKey="event" stroke="#94a3b8" fontSize={11} interval={0} angle={-12} textAnchor="end" height={50} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }}
                formatter={(v, k) => k === 'revenue' ? formatCurrency(v) : v}
              />
              <Bar dataKey="revenue" name="Revenue" fill="url(#barGold)" radius={[10, 10, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
