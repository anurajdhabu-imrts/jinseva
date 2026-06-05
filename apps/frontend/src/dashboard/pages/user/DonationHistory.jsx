import { useState, useEffect, useCallback } from 'react';
import { Download, Receipt, Heart, TrendingUp } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Table from '@components/Table';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { useToast } from '@context/ToastContext';
import { meApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate, STATUS_COLORS } from '@utils/constants';

export default function DonationHistory() {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await meApi.donations();
      setRows(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const thisYear = rows
    .filter((d) => (d.date || '').startsWith(String(new Date().getFullYear())))
    .reduce((s, d) => s + d.amount, 0);

  const columns = [
    { key: 'date', title: 'Date', render: (v) => formatDate(v) },
    { key: 'type', title: 'Purpose', render: (v) => <Badge variant="primary">{v}</Badge> },
    { key: 'method', title: 'Method' },
    { key: 'amount', title: 'Amount', align: 'right', render: (v) => <span className="font-semibold">{formatCurrency(v)}</span> },
    { key: 'status', title: 'Status', render: (v) => <Badge variant={STATUS_COLORS[v]}>{v}</Badge> },
    { key: 'actions', title: '', align: 'right', render: () => <Button size="xs" variant="ghost" icon={Receipt}>Receipt</Button> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Donation History"
        subtitle="All your contributions in one place"
        breadcrumb={[{ label: 'Devotee Portal', to: '/user' }, { label: 'Donations' }]}
        actions={<Button variant="secondary" icon={Download}>Download Statement</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard icon={Heart} label="Lifetime Total" value={formatCurrency(total)} tone="primary" />
        <StatsCard icon={Receipt} label="This Year" value={formatCurrency(thisYear)} tone="gold" />
        <StatsCard icon={TrendingUp} label="Total Donations" value={String(rows.length)} tone="emerald" />
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading…</p>
      ) : (
        <Table columns={columns} data={rows} rowKey="id" />
      )}
    </div>
  );
}
