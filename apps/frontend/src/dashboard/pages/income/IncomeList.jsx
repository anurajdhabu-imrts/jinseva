import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Download, Eye, Receipt, Trash2, TrendingUp, Wallet, Calendar, Building2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Table from '@components/Table';
import SearchBar from '@components/SearchBar';
import Modal from '@components/Modal';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { Select } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { incomeApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate, STATUS_COLORS, INCOME_CATEGORIES } from '@utils/constants';

const CAT_COLORS = ['#c8102e', '#ffc01e', '#00843d', '#1a1b22', '#d68500', '#054624', '#761120'];

export default function IncomeList() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setIncome(await incomeApi.list());
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
      income.filter((i) => {
        const matchSearch =
          !search ||
          i.description.toLowerCase().includes(search.toLowerCase()) ||
          i.source.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'All' || i.category === category;
        return matchSearch && matchCat;
      }),
    [income, search, category],
  );

  const totalIncome = useMemo(() => income.reduce((s, i) => s + (i.amount || 0), 0), [income]);
  const thisMonth = useMemo(() => {
    const ym = new Date().toISOString().slice(0, 7);
    return income.filter((i) => (i.date || '').startsWith(ym)).reduce((s, i) => s + (i.amount || 0), 0);
  }, [income]);
  const sourcesCount = useMemo(() => new Set(income.map((i) => i.source)).size, [income]);
  const byCategory = useMemo(() => {
    const map = {};
    income.forEach((i) => { map[i.category] = (map[i.category] || 0) + (i.amount || 0); });
    return Object.entries(map).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  }, [income]);
  const topCategory = byCategory[0] ? { cat: byCategory[0].name, total: byCategory[0].total } : null;

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete income ${row.id}?`)) return;
    try {
      await incomeApi.remove(row.id);
      toast.success(`Income ${row.id} deleted.`);
      setIncome((list) => list.filter((i) => i.id !== row.id));
      setSelected(null);
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const columns = [
    { key: 'id', title: 'ID', render: (v) => <span className="font-mono text-xs">{v}</span> },
    { key: 'description', title: 'Description', render: (v, row) => (
      <div>
        <p className="font-medium text-neutral-900 dark:text-white">{v}</p>
        <p className="text-xs text-neutral-500 inline-flex items-center gap-1.5">
          <Building2 className="w-3 h-3" /> {row.source}
        </p>
      </div>
    )},
    { key: 'category', title: 'Category', render: (v) => <Badge variant="primary">{v}</Badge> },
    { key: 'property', title: 'Property', render: (v) => v ? <Badge variant="neutral">{v}</Badge> : <span className="text-neutral-400">—</span> },
    { key: 'amount', title: 'Amount', align: 'right', render: (v) => (
      <span className="font-semibold text-jain-green-700">+ {formatCurrency(v)}</span>
    )},
    { key: 'method', title: 'Method' },
    { key: 'date', title: 'Date', render: (v) => formatDate(v) },
    { key: 'status', title: 'Status', render: (v) => <Badge variant={STATUS_COLORS[v]}>{v}</Badge> },
    { key: 'actions', title: '', align: 'right', render: (_, row) => (
      <div className="inline-flex items-center gap-1">
        <button
          onClick={() => setSelected(row)}
          className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-saffron-600"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(row)}
          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Income Management"
        subtitle="Track every rupee earned beyond daan — hall rentals, bhojanshala, dharmashala, panjarapole and more"
        breadcrumb={[{ label: 'Income' }]}
        actions={
          <>
            <Link to="/income/categories"><Button variant="secondary">Categories</Button></Link>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Link to="/income/new"><Button icon={Plus}>Add Income</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Wallet}      label="Total Income"    value={formatCurrency(totalIncome)} growth={14.2} tone="emerald" />
        <StatsCard icon={TrendingUp} label="This Month"      value={formatCurrency(thisMonth)}   growth={22.5} tone="primary" />
        <StatsCard icon={Receipt}     label="Top Source"      value={topCategory?.cat ?? '—'}     subtitle={topCategory ? formatCurrency(topCategory.total) : ''} tone="gold" />
        <StatsCard icon={Building2}   label="Active Sources" value={sourcesCount}                 growth={6.0} tone="violet" />
      </div>

      {/* Income by category */}
      <Card>
        <CardHeader title="Income by Category" subtitle="Total collected per category" />
        <CardBody>
          <div className="h-72">
            {byCategory.length === 0 ? (
              <p className="h-full grid place-items-center text-sm text-neutral-500">No income recorded yet.</p>
            ) : (
              <ResponsiveContainer>
                <BarChart data={byCategory} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(26,27,34,0.95)', border: 'none', borderRadius: 12, color: '#fff' }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Bar dataKey="total" name="Total" radius={[10, 10, 0, 0]}>
                    {byCategory.map((c, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Filter bar */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search income records…" className="md:max-w-sm" />
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={['All', ...INCOME_CATEGORIES]}
              className="md:max-w-xs"
            />
            <Button variant="secondary" icon={Filter} className="md:ml-auto">More Filters</Button>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading income…</p>
      ) : (
        <Table columns={columns} data={filtered} rowKey="id" />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Income details" subtitle={selected?.id}>
        {selected && (
          <div className="space-y-4">
            <div className="text-center py-4 rounded-2xl bg-jain-green-50 dark:bg-jain-green-600/10">
              <p className="text-xs uppercase text-jain-green-700 dark:text-jain-green-400">Amount</p>
              <p className="text-3xl font-serif font-bold text-jain-green-700">+ {formatCurrency(selected.amount)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-neutral-500">Description</p><p className="font-medium">{selected.description}</p></div>
              <div><p className="text-neutral-500">Source</p><p className="font-medium">{selected.source}</p></div>
              <div><p className="text-neutral-500">Category</p><p className="font-medium">{selected.category}</p></div>
              <div><p className="text-neutral-500">Method</p><p className="font-medium">{selected.method}</p></div>
              <div><p className="text-neutral-500">Date</p><p className="font-medium">{formatDate(selected.date)}</p></div>
              <div><p className="text-neutral-500">Status</p><Badge variant={STATUS_COLORS[selected.status]}>{selected.status}</Badge></div>
            </div>
            <div className="p-4 rounded-xl border-2 border-dashed border-sand-300 dark:border-neutral-700 text-center">
              <Receipt className="w-8 h-8 mx-auto text-saffron-600 mb-2" />
              <p className="text-sm font-medium">{selected.receipt}</p>
              <Button variant="secondary" size="sm" className="mt-2">View Receipt</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
