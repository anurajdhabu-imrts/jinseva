import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Badge from '@components/Badge';
import Avatar from '@components/Avatar';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { useToast } from '@context/ToastContext';
import { staffApi, apiError } from '@services/rbacService';

const STATUSES = ['present', 'late', 'absent', 'leave'];
const VARIANT = { present: 'success', late: 'warning', absent: 'danger', leave: 'neutral' };

export default function Attendance() {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, leave: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (d) => {
    setLoading(true);
    try {
      const res = await staffApi.attendance(d);
      setRows(res.data || []);
      setSummary(res.summary || {});
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(date); }, [load, date]);

  const cycleStatus = async (row) => {
    const next = STATUSES[(STATUSES.indexOf(row.attStatus) + 1) % STATUSES.length];
    try {
      await staffApi.markAttendance({ staffId: row.id, date, status: next });
      await load(date);
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Attendance"
        subtitle="Tap a status badge to update it"
        breadcrumb={[{ label: 'Staff', to: '/staff' }, { label: 'Attendance' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={CheckCircle2} label="Present" value={String(summary.present || 0)} tone="emerald" />
        <StatsCard icon={XCircle} label="Absent" value={String(summary.absent || 0)} tone="rose" />
        <StatsCard icon={Clock} label="Late" value={String(summary.late || 0)} tone="gold" />
        <StatsCard icon={Calendar} label="On Leave" value={String(summary.leave || 0)} tone="violet" />
      </div>

      <Card>
        <div className="p-5 border-b border-sand-100 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-serif font-semibold text-lg">Attendance</h3>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-sm bg-sand-100 dark:bg-neutral-800 rounded-lg px-3 py-1.5 border-0 focus:ring-2 focus:ring-saffron-500/40" />
        </div>
        <CardBody className="p-0">
          {loading ? (
            <p className="py-8 text-center text-sm text-neutral-500">Loading…</p>
          ) : (
            <div className="divide-y divide-sand-100 dark:divide-neutral-800">
              {rows.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-4 hover:bg-sand-50/50 dark:hover:bg-neutral-800/30">
                  <Avatar src={a.avatar} name={a.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 dark:text-white">{a.name}</p>
                    <p className="text-xs text-neutral-500">{a.role} • {a.department}</p>
                  </div>
                  <button onClick={() => cycleStatus(a)} title="Tap to change">
                    <Badge variant={VARIANT[a.attStatus] || 'neutral'} dot>{a.attStatus}</Badge>
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
