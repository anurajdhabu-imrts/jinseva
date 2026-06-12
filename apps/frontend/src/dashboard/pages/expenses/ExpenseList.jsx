import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Download, Eye, Receipt, Trash2, TrendingDown, Wallet, Calendar, FileText } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Table from '@components/Table';
import SearchBar from '@components/SearchBar';
import Modal from '@components/Modal';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { Select } from '@components/Input';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { useToast } from '@context/ToastContext';
import { expensesApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate, STATUS_COLORS, EXPENSE_CATEGORIES } from '@utils/constants';

const CAT_COLORS = ['#562F00', '#FF9644', '#FFCE99', '#562F00', '#562F00', '#562F00', '#562F00'];

export default function ExpenseList() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setExpenses(await expensesApi.list());
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
      expenses.filter((e) => {
        const matchSearch =
          !search ||
          e.description.toLowerCase().includes(search.toLowerCase()) ||
          (e.vendor || '').toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'All' || e.category === category;
        return matchSearch && matchCat;
      }),
    [expenses, search, category],
  );

  const totalExpense = useMemo(() => expenses.reduce((s, e) => s + (e.amount || 0), 0), [expenses]);
  const thisMonth = useMemo(() => {
    const ym = new Date().toISOString().slice(0, 7);
    return expenses.filter((e) => (e.date || '').startsWith(ym)).reduce((s, e) => s + (e.amount || 0), 0);
  }, [expenses]);
  const pendingCount = useMemo(() => expenses.filter((e) => e.status === 'pending').length, [expenses]);
  const vendorsCount = useMemo(() => new Set(expenses.map((e) => e.vendor).filter(Boolean)).size, [expenses]);
  const byCategory = useMemo(() => {
    const map = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + (e.amount || 0); });
    return Object.entries(map).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  }, [expenses]);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete expense ${row.id}?`)) return;
    try {
      await expensesApi.remove(row.id);
      toast.success(`Expense ${row.id} deleted.`);
      setExpenses((list) => list.filter((e) => e.id !== row.id));
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
        <p className="text-xs text-neutral-500">{row.vendor}</p>
      </div>
    )},
    { key: 'category', title: 'Category', render: (v) => <Badge variant="neutral">{v}</Badge> },
    { key: 'property', title: 'Property', render: (v) => v ? <Badge variant="primary">{v}</Badge> : <span className="text-neutral-400">—</span> },
    { key: 'amount', title: 'Amount', align: 'right', render: (v) => <span className="font-semibold text-rose-600">- {formatCurrency(v)}</span> },
    { key: 'method', title: 'Method' },
    { key: 'date', title: 'Date', render: (v) => formatDate(v) },
    { key: 'status', title: 'Status', render: (v) => <Badge variant={STATUS_COLORS[v]}>{v}</Badge> },
    { key: 'actions', title: '', align: 'right', render: (_, row) => (
      <div className="inline-flex items-center gap-1">
        <button onClick={() => setSelected(row)} className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-saffron-600">
          <Eye className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(row)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Management"
        subtitle="Track every rupee spent in temple operations"
        breadcrumb={[{ label: 'Expenses' }]}
        actions={
          <>
            <Link to="/expenses/categories"><Button variant="secondary">Categories</Button></Link>
            <Button variant="secondary" icon={Download}>Export</Button>
            <Link to="/expenses/new"><Button icon={Plus}>Add Expense</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Wallet} label="Total Expenses" value={formatCurrency(totalExpense)} tone="rose" />
        <StatsCard icon={TrendingDown} label="This Month" value={formatCurrency(thisMonth)} tone="primary" />
        <StatsCard icon={Calendar} label="Pending Bills" value={String(pendingCount)} tone="gold" />
        <StatsCard icon={FileText} label="Vendors" value={String(vendorsCount)} tone="violet" />
      </div>

      <Card>
        <CardBody>
          <div className="h-56">
            {byCategory.length === 0 ? (
              <p className="h-full grid place-items-center text-sm text-neutral-500">No expenses recorded yet.</p>
            ) : (
              <ResponsiveContainer>
                <BarChart data={byCategory} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,120,120,0.15)" vertical={false} />
                  <XAxis dataKey="name" stroke="#562F00" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="#562F00" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30,27,24,0.95)', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="total" name="Spent" radius={[10, 10, 0, 0]} maxBarSize={48}>
                    {byCategory.map((c, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search expenses…" className="md:max-w-sm" />
            <Select value={category} onChange={(e) => setCategory(e.target.value)} options={['All', ...EXPENSE_CATEGORIES]} className="md:max-w-xs" />
            <Button variant="secondary" icon={Filter} className="md:ml-auto">Filters</Button>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading expenses…</p>
      ) : (
        <Table columns={columns} data={filtered} rowKey="id" />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Expense details" subtitle={selected?.id}>
        {selected && (
          <div className="space-y-4">
            <div className="text-center py-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-500/10 dark:to-rose-500/5">
              <p className="text-xs uppercase text-rose-700 dark:text-rose-400">Amount</p>
              <p className="text-3xl font-serif font-bold text-rose-600">- {formatCurrency(selected.amount)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-neutral-500">Description</p><p className="font-medium">{selected.description}</p></div>
              <div><p className="text-neutral-500">Vendor</p><p className="font-medium">{selected.vendor}</p></div>
              <div><p className="text-neutral-500">Category</p><p className="font-medium">{selected.category}</p></div>
              <div><p className="text-neutral-500">Method</p><p className="font-medium">{selected.method}</p></div>
              <div><p className="text-neutral-500">Date</p><p className="font-medium">{formatDate(selected.date)}</p></div>
              <div><p className="text-neutral-500">Status</p><Badge variant={STATUS_COLORS[selected.status]}>{selected.status}</Badge></div>
            </div>
            <div className="p-4 rounded-xl border-2 border-dashed border-sand-300 dark:border-neutral-700 text-center">
              <Receipt className="w-8 h-8 mx-auto text-saffron-600 mb-2" />
              <p className="text-sm font-medium">{selected.bill}</p>
              <Button variant="secondary" size="sm" className="mt-2">View Bill</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
