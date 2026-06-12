import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Modal from '@components/Modal';
import Input from '@components/Input';
import { formatCurrency } from '@utils/constants';
import { useToast } from '@context/ToastContext';
import { useAuth } from '@context/AuthContext';
import { useLookupAdmin } from '@context/LookupContext';
import { incomeApi, lookupsApi, apiError } from '@services/rbacService';

const categoryColors = [
  'bg-jain-red-600',
  'bg-jain-yellow-500',
  'bg-jain-green-600',
  'bg-jain-black-800',
  'bg-jain-red-700',
  'bg-jain-yellow-600',
  'bg-jain-green-700',
  'bg-jain-red-500',
  'bg-jain-yellow-700',
  'bg-jain-black-600',
];

export default function IncomeCategories() {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const canManage = hasPermission('settings.update');
  const { data, refresh } = useLookupAdmin();

  const [stats, setStats] = useState({}); // { name: { total, count } }
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // lookup row being renamed, or null for "add"
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);

  // The category list now comes from admin-managed lookups; income totals/counts
  // are fetched separately and merged in by name.
  const lookupCategories = data.income_category || [];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const analytics = await incomeApi.analytics();
        if (cancelled) return;
        const map = {};
        (analytics.byCategory || []).forEach((c) => {
          map[c.name] = { total: c.value || 0, count: c.count || 0 };
        });
        setStats(map);
      } catch (err) {
        if (!cancelled) toast.error(apiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const categoryStats = useMemo(
    () =>
      lookupCategories.map((c, i) => ({
        id: c.id,
        name: c.label,
        total: stats[c.label]?.total || 0,
        count: stats[c.label]?.count || 0,
        color: categoryColors[i % categoryColors.length],
      })),
    [lookupCategories, stats],
  );

  const grandTotal = categoryStats.reduce((s, c) => s + c.total, 0);

  const openAdd = () => {
    setEditing(null);
    setLabel('');
    setModalOpen(true);
  };
  const openEdit = (cat) => {
    setEditing(cat);
    setLabel(cat.name);
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const name = label.trim();
    if (!name) return;
    setSaving(true);
    try {
      if (editing) {
        await lookupsApi.update(editing.id, { label: name });
        toast.success('Category renamed.');
      } else {
        await lookupsApi.create({ category: 'income_category', label: name, sortOrder: lookupCategories.length });
        toast.success(`Added “${name}”.`);
      }
      await refresh();
      setModalOpen(false);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (cat) => {
    if (!window.confirm(`Delete the “${cat.name}” category?`)) return;
    try {
      await lookupsApi.remove(cat.id);
      await refresh();
      toast.success('Category deleted.');
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Income Categories"
        subtitle="Organize income by source — hall rental, bhojanshala, dharmashala etc."
        breadcrumb={[{ label: 'Income', to: '/income' }, { label: 'Categories' }]}
        actions={canManage ? <Button icon={Plus} onClick={openAdd}>Add Category</Button> : null}
      />

      <Card>
        <CardBody className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Grand Total — All categories</p>
            <p className="font-display text-4xl font-bold text-jain-green-700 mt-1">{formatCurrency(grandTotal)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500">{categoryStats.filter((c) => c.count > 0).length} active</p>
            <p className="text-sm text-neutral-500">of {categoryStats.length} categories</p>
          </div>
        </CardBody>
      </Card>

      {loading && <p className="py-6 text-center text-sm text-neutral-500">Loading categories…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryStats.map((c) => {
          const pct = grandTotal > 0 ? Math.round((c.total / grandTotal) * 100) : 0;
          return (
            <Card key={c.id} hover>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center text-white`}>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  {canManage && (
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-500">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(c)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <h3 className="font-serif font-semibold text-lg text-neutral-900 dark:text-white mt-3">{c.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={c.count > 0 ? 'success' : 'neutral'}>
                    {c.count} {c.count === 1 ? 'record' : 'records'}
                  </Badge>
                  {pct > 0 && <span className="text-xs text-neutral-500">{pct}% of total</span>}
                </div>
                <p className="text-2xl font-serif font-bold text-jain-green-700 mt-3">{formatCurrency(c.total)}</p>
                <p className="text-xs text-neutral-500 mt-1">Total earned</p>

                {c.count > 0 && (
                  <div className="mt-3 w-full h-1.5 bg-sand-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Rename category' : 'Add income category'}
        subtitle="This list feeds the Category dropdown on the Add Income form."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button icon={Plus} onClick={save} loading={saving} disabled={!label.trim()}>
              {editing ? 'Save' : 'Add category'}
            </Button>
          </>
        }
      >
        <form onSubmit={save}>
          <Input
            label="Category name"
            placeholder="e.g. Mandap Booking"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
          />
        </form>
      </Modal>
    </div>
  );
}
