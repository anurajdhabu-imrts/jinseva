import { useState, useEffect, useCallback } from 'react';
import { IndianRupee, TrendingUp, FileText, Download } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card from '@components/Card';
import Badge from '@components/Badge';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import Table from '@components/Table';
import { useToast } from '@context/ToastContext';
import { staffApi, apiError } from '@services/rbacService';
import { formatCurrency } from '@utils/constants';

export default function Salary() {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ totalPayroll: 0, paidCount: 0, pendingCount: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffApi.salary();
      setData(res.data || []);
      setMeta({ totalPayroll: res.totalPayroll || 0, paidCount: res.paidCount || 0, pendingCount: res.pendingCount || 0 });
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const processPayroll = async () => {
    setProcessing(true);
    try {
      await staffApi.processPayroll();
      toast.success('Payroll processed — all staff marked paid.');
      await load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setProcessing(false);
    }
  };

  const totalPayroll = meta.totalPayroll;
  const avg = data.length ? Math.round(totalPayroll / data.length) : 0;

  const columns = [
    { key: 'name', title: 'Employee', render: (v, row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatar} name={v} size="sm" />
        <div>
          <p className="font-medium">{v}</p>
          <p className="text-xs text-neutral-500">{row.role}</p>
        </div>
      </div>
    )},
    { key: 'salary', title: 'Base', align: 'right', render: (v) => formatCurrency(v) },
    { key: 'bonus', title: 'Bonus', align: 'right', render: (v) => v > 0 ? <span className="text-emerald-600">+ {formatCurrency(v)}</span> : '—' },
    { key: 'deductions', title: 'Deductions', align: 'right', render: (v) => <span className="text-rose-600">- {formatCurrency(v)}</span> },
    { key: 'net', title: 'Net Pay', align: 'right', render: (_, row) => (
      <span className="font-bold gradient-text">{formatCurrency(row.salary + row.bonus - row.deductions)}</span>
    )},
    { key: 'paid', title: 'Status', render: (v) => <Badge variant={v ? 'success' : 'warning'} dot>{v ? 'Paid' : 'Pending'}</Badge> },
    { key: 'actions', title: '', align: 'right', render: () => <Button size="xs" variant="ghost" icon={FileText}>Slip</Button> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary Management"
        subtitle="Payroll for May 2026"
        breadcrumb={[{ label: 'Staff', to: '/staff' }, { label: 'Salary' }]}
        actions={
          <>
            <Button variant="secondary" icon={Download}>Export Payroll</Button>
            <Button icon={IndianRupee} loading={processing} onClick={processPayroll}>Process Payroll</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={IndianRupee} label="Total Payroll" value={formatCurrency(totalPayroll)} tone="primary" />
        <StatsCard icon={TrendingUp} label="Avg Net Pay" value={formatCurrency(avg)} tone="gold" />
        <StatsCard icon={FileText} label="Paid" value={String(meta.paidCount)} tone="emerald" />
        <StatsCard icon={FileText} label="Pending" value={String(meta.pendingCount)} tone="rose" />
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading payroll…</p>
      ) : (
        <Table columns={columns} data={data} rowKey="id" />
      )}
    </div>
  );
}
