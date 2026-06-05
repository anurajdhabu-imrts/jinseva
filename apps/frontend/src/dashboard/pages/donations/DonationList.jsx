import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Download, Eye, Receipt, Trash2, TrendingUp, HandHeart, Wallet, Calendar } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Table from '@components/Table';
import SearchBar from '@components/SearchBar';
import Avatar from '@components/Avatar';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { Select } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { donationsApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate, STATUS_COLORS, DONATION_TYPES } from '@utils/constants';

export default function DonationList() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setDonations(await donationsApi.list());
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
      donations.filter((d) => {
        const matchSearch =
          !search ||
          d.donor.toLowerCase().includes(search.toLowerCase()) ||
          d.id.toLowerCase().includes(search.toLowerCase());
        const matchType = type === 'All' || d.type === type;
        return matchSearch && matchType;
      }),
    [donations, search, type],
  );

  // Stats computed from live data.
  const stats = useMemo(() => {
    const total = donations.reduce((s, d) => s + (d.amount || 0), 0);
    const ym = new Date().toISOString().slice(0, 7);
    const thisMonth = donations
      .filter((d) => (d.date || '').startsWith(ym))
      .reduce((s, d) => s + (d.amount || 0), 0);
    const avg = donations.length ? Math.round(total / donations.length) : 0;
    const donors = new Set(donations.filter((d) => !d.anonymous).map((d) => d.donor)).size;
    return { total, thisMonth, avg, donors };
  }, [donations]);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete donation ${row.id}?`)) return;
    try {
      await donationsApi.remove(row.id);
      toast.success(`Donation ${row.id} deleted.`);
      setDonations((list) => list.filter((d) => d.id !== row.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const columns = [
    {
      key: 'donor', title: 'Donor', render: (v, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={v} size="sm" />
          <div>
            <div className="font-medium text-neutral-900 dark:text-white">{row.anonymous ? 'Anonymous' : v}</div>
            <div className="text-xs text-neutral-500">{row.id}</div>
          </div>
        </div>
      )
    },
    { key: 'type', title: 'Type', render: (v, row) => (
      <Badge variant={row.source === 'event' ? 'success' : 'primary'}>{v}</Badge>
    ) },
    { key: 'amount', title: 'Amount', align: 'right', render: (v) => <span className="font-semibold gradient-text">{formatCurrency(v)}</span> },
    { key: 'method', title: 'Method', render: (v) => <span className="text-sm">{v}</span> },
    { key: 'date', title: 'Date', render: (v) => formatDate(v) },
    { key: 'status', title: 'Status', render: (v) => <Badge variant={STATUS_COLORS[v]}>{v}</Badge> },
    {
      key: 'actions', title: '', align: 'right', render: (_, row) =>
        // Event-wise donations are managed under their event, not here.
        row.source === 'event' ? (
          <Link to={`/events/${row.eventId}`} className="text-xs font-medium text-saffron-600 hover:text-saffron-700 whitespace-nowrap">
            View event →
          </Link>
        ) : (
          <div className="inline-flex items-center gap-1">
            <Link to={`/donations/${row.id}`}>
              <button className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-saffron-600">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
            <Link to={`/donations/receipt/${row.id}`}>
              <button className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-saffron-600">
                <Receipt className="w-4 h-4" />
              </button>
            </Link>
            <button onClick={() => handleDelete(row)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donations"
        subtitle="Track every contribution received with reverence"
        breadcrumb={[{ label: 'Donations' }]}
        actions={
          <>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Link to="/donations/new"><Button icon={Plus}>Record Donation</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={HandHeart} label="Total Donations" value={formatCurrency(stats.total)} tone="primary" />
        <StatsCard icon={TrendingUp} label="This Month" value={formatCurrency(stats.thisMonth)} tone="emerald" />
        <StatsCard icon={Wallet} label="Avg Donation" value={formatCurrency(stats.avg)} tone="gold" />
        <StatsCard icon={Calendar} label="Donors" value={String(stats.donors)} tone="violet" />
      </div>

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by donor or ID…" className="md:max-w-sm" />
            <Select value={type} onChange={(e) => setType(e.target.value)} options={['All', ...DONATION_TYPES]} className="md:max-w-xs" />
            <Button variant="secondary" icon={Filter} className="md:ml-auto">More filters</Button>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading donations…</p>
      ) : (
        <>
          <Table columns={columns} data={filtered} rowKey="id" />
          <p className="text-sm text-neutral-500">
            Showing {filtered.length} of {donations.length} donations
          </p>
        </>
      )}
    </div>
  );
}
