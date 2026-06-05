import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, PackagePlus, AlertTriangle, TrendingUp, Boxes, Trash2 } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Table from '@components/Table';
import SearchBar from '@components/SearchBar';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import { useToast } from '@context/ToastContext';
import { inventoryApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate } from '@utils/constants';

export default function InventoryList() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await inventoryApi.list());
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
    () => items.filter((i) => !search || i.item.toLowerCase().includes(search.toLowerCase())),
    [items, search],
  );
  const lowStock = useMemo(() => items.filter((i) => i.lowStock), [items]);
  const totalValue = useMemo(() => items.reduce((s, i) => s + i.quantity * i.costPerUnit, 0), [items]);

  const handleRestock = async (row) => {
    const input = window.prompt(`Restock "${row.item}" — quantity to add (${row.unit}):`, '1');
    if (input === null) return;
    const quantity = Number(input);
    if (!quantity || quantity <= 0) return toast.error('Enter a valid quantity.');
    try {
      await inventoryApi.restock(row.id, { quantity });
      toast.success(`Restocked ${row.item}.`);
      await load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.item}"?`)) return;
    try {
      await inventoryApi.remove(row.id);
      toast.success(`${row.item} deleted.`);
      setItems((list) => list.filter((i) => i.id !== row.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const columns = [
    { key: 'item', title: 'Item', render: (v, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-100 to-gold-100 dark:from-saffron-500/20 dark:to-gold-500/20 flex items-center justify-center">
          <Package className="w-4 h-4 text-saffron-600" />
        </div>
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{v}</p>
          <p className="text-xs text-neutral-500">{row.id} • {row.category}</p>
        </div>
      </div>
    )},
    { key: 'quantity', title: 'Stock', render: (v, row) => {
      const pct = row.minStock > 0 ? Math.min(100, Math.round((v / row.minStock) * 100)) : 100;
      const low = row.lowStock;
      return (
        <div className="min-w-[140px]">
          <div className="flex justify-between text-xs mb-1">
            <span className={low ? 'text-rose-600 font-semibold' : 'font-medium'}>{v} {row.unit}</span>
            <span className="text-neutral-500">min {row.minStock}</span>
          </div>
          <div className="w-full h-1.5 bg-sand-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${low ? 'bg-rose-500' : pct < 150 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
        </div>
      );
    }},
    { key: 'supplier', title: 'Supplier', render: (v) => v || '—' },
    { key: 'lastRestock', title: 'Last Restock', render: (v) => <span className="text-sm">{v ? formatDate(v) : '—'}</span> },
    { key: 'costPerUnit', title: 'Unit Cost', align: 'right', render: (v) => formatCurrency(v) },
    { key: 'total', title: 'Total Value', align: 'right', render: (_, row) => <span className="font-semibold">{formatCurrency(row.quantity * row.costPerUnit)}</span> },
    { key: 'status', title: 'Status', render: (_, row) => (
      <Badge variant={row.lowStock ? 'danger' : 'success'} dot>{row.lowStock ? 'Low Stock' : 'In Stock'}</Badge>
    )},
    { key: 'actions', title: '', align: 'right', render: (_, row) => (
      <div className="inline-flex gap-1">
        <button onClick={() => handleRestock(row)} title="Restock" className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600"><PackagePlus className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(row)} title="Delete" className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        subtitle="Track temple supplies & materials"
        breadcrumb={[{ label: 'Inventory' }]}
        actions={
          <>
            <Link to="/inventory/suppliers"><Button variant="secondary">Suppliers</Button></Link>
            <Link to="/inventory/new"><Button icon={Plus}>Add Item</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Boxes} label="Total Items" value={String(items.length)} tone="primary" />
        <StatsCard icon={Package} label="Inventory Value" value={formatCurrency(totalValue)} tone="gold" />
        <StatsCard icon={AlertTriangle} label="Low Stock" value={String(lowStock.length)} tone="rose" />
        <StatsCard icon={TrendingUp} label="In Stock" value={String(items.length - lowStock.length)} tone="emerald" />
      </div>

      {lowStock.length > 0 && (
        <Card className="bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-500/10 dark:to-amber-500/10 border-rose-200/50 dark:border-rose-500/20">
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-rose-700 dark:text-rose-400">Low Stock Alert</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {lowStock.length} items below minimum threshold: {lowStock.slice(0, 3).map((i) => i.item).join(', ')}
                {lowStock.length > 3 && ` and ${lowStock.length - 3} more`}
              </p>
            </div>
            <Button variant="danger" size="sm">Order Now</Button>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <SearchBar value={search} onChange={setSearch} placeholder="Search items by name…" className="max-w-md" />
        </CardBody>
      </Card>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading inventory…</p>
      ) : (
        <Table columns={columns} data={filtered} rowKey="id" />
      )}
    </div>
  );
}
