import { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Table from '@components/Table';
import { useToast } from '@context/ToastContext';
import { meApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate, STATUS_COLORS } from '@utils/constants';

export default function BookingHistory() {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await meApi.bookings();
      setRows(res.data || []);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const columns = [
    { key: 'id', title: 'ID', render: (v) => <span className="font-mono text-xs">{v}</span> },
    { key: 'pooja', title: 'Service', render: (v) => <Badge variant="primary">{v}</Badge> },
    { key: 'date', title: 'Date', render: (v, row) => `${v ? formatDate(v) : '—'} • ${row.time}` },
    { key: 'priest', title: 'Priest' },
    { key: 'amount', title: 'Amount', align: 'right', render: (v) => formatCurrency(v) },
    { key: 'status', title: 'Status', render: (v) => <Badge variant={STATUS_COLORS[v]}>{v}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Bookings"
        subtitle="View all your pooja & hall reservations"
        breadcrumb={[{ label: 'Devotee Portal', to: '/user' }, { label: 'Bookings' }]}
        actions={<Button variant="secondary" icon={Download}>Export</Button>}
      />
      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading…</p>
      ) : (
        <Table columns={columns} data={rows} rowKey="id" />
      )}
    </div>
  );
}
