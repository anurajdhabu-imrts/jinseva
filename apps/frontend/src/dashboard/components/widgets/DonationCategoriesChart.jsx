import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import Card, { CardHeader, CardBody } from '@components/Card';
import { formatCurrency } from '@utils/constants';

export default function DonationCategoriesChart({ data = [] }) {
  const total = data.reduce((s, c) => s + c.value, 0);
  return (
    <Card>
      <CardHeader title="Donation Categories" subtitle="Breakdown by purpose" />
      <CardBody>
        {data.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-500">No donations yet.</p>
        ) : (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-48 h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3} stroke="none">
                  {data.map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }}
                  formatter={(v) => formatCurrency(v)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Total</span>
              <span className="text-lg font-serif font-bold text-neutral-900 dark:text-white">{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="flex-1 space-y-2 w-full">
            {data.map((c) => {
              const pct = total ? ((c.value / total) * 100).toFixed(1) : 0;
              return (
                <div key={c.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{c.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">{formatCurrency(c.value)}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </CardBody>
    </Card>
  );
}
