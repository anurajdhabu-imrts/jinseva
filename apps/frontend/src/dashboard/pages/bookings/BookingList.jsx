import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Clock, Phone, Eye, CheckCircle2, XCircle, BookOpenCheck, Users } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Table from '@components/Table';
import SearchBar from '@components/SearchBar';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { useToast } from '@context/ToastContext';
import { bookingsApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate, STATUS_COLORS } from '@utils/constants';

export default function BookingList() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBookings(await bookingsApi.list());
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        const matchSearch =
          !search ||
          b.devotee.toLowerCase().includes(search.toLowerCase()) ||
          (b.pooja || '').toLowerCase().includes(search.toLowerCase());
        const matchTab = tab === 'all' || b.status === tab;
        return matchSearch && matchTab;
      }),
    [bookings, search, tab],
  );

  const stats = useMemo(() => {
    const now = new Date();
    const weekAhead = new Date(now.getTime() + 7 * 86400000);
    const thisWeek = bookings.filter((b) => {
      if (!b.date) return false;
      const d = new Date(b.date);
      return d >= now && d <= weekAhead;
    }).length;
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      thisWeek,
    };
  }, [bookings]);

  const setStatus = async (row, status) => {
    try {
      const updated = await bookingsApi.update(row.id, { status });
      setBookings((list) => list.map((b) => (b.id === row.id ? updated : b)));
      toast.success(`Booking ${row.id} ${status}.`);
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const columns = [
    { key: 'id', title: 'ID', render: (v) => <span className="font-mono text-xs">{v}</span> },
    { key: 'devotee', title: 'Devotee', render: (v, row) => (
      <div>
        <p className="font-medium text-neutral-900 dark:text-white">{v}</p>
        <p className="text-xs text-neutral-500 inline-flex items-center gap-1"><Phone className="w-3 h-3" />{row.phone}</p>
      </div>
    )},
    { key: 'pooja', title: 'Pooja', render: (v) => <Badge variant="primary">{v}</Badge> },
    { key: 'date', title: 'Date & Time', render: (v, row) => (
      <div>
        <p className="font-medium">{formatDate(v, { day: '2-digit', month: 'short' })}</p>
        <p className="text-xs text-neutral-500 inline-flex items-center gap-1"><Clock className="w-3 h-3" />{row.time}</p>
      </div>
    )},
    { key: 'priest', title: 'Priest' },
    { key: 'amount', title: 'Amount', align: 'right', render: (v) => <span className="font-semibold">{formatCurrency(v)}</span> },
    { key: 'status', title: 'Status', render: (v) => <Badge variant={STATUS_COLORS[v]}>{v}</Badge> },
    { key: 'actions', title: '', align: 'right', render: (_, row) => (
      <div className="inline-flex gap-1">
        <Link to={`/bookings/${row.id}`}>
          <button className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-500"><Eye className="w-4 h-4" /></button>
        </Link>
        {row.status !== 'confirmed' && row.status !== 'cancelled' && (
          <button onClick={() => setStatus(row, 'confirmed')} title="Confirm" className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></button>
        )}
        {row.status !== 'cancelled' && (
          <button onClick={() => setStatus(row, 'cancelled')} title="Cancel" className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600"><XCircle className="w-4 h-4" /></button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pooja & Hall Bookings"
        subtitle="Manage ceremonial bookings & devotee services"
        breadcrumb={[{ label: 'Bookings' }]}
        actions={
          <>
            <Link to="/bookings/calendar"><Button variant="secondary" icon={Calendar}>Hall Calendar</Button></Link>
            <Link to="/bookings/new"><Button icon={Plus}>New Booking</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={BookOpenCheck} label="Total Bookings" value={String(stats.total)} tone="primary" />
        <StatsCard icon={CheckCircle2} label="Confirmed" value={String(stats.confirmed)} tone="emerald" />
        <StatsCard icon={Calendar} label="This Week" value={String(stats.thisWeek)} tone="gold" />
        <StatsCard icon={Users} label="Pending" value={String(stats.pending)} tone="violet" />
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search bookings…" className="md:max-w-sm" />
            <div className="flex flex-wrap gap-2 md:ml-auto">
              {['all', 'confirmed', 'pending', 'cancelled'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    tab === t
                      ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow'
                      : 'bg-sand-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading bookings…</p>
      ) : (
        <Table columns={columns} data={filtered} rowKey="id" />
      )}
    </div>
  );
}
