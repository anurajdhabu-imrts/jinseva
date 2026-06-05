import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Receipt } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Modal from '@components/Modal';
import Input, { Textarea } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { expensesApi, apiError } from '@services/rbacService';
import { formatCurrency } from '@utils/constants';

const GRADIENTS = [
  'from-saffron-500 to-saffron-600', 'from-gold-400 to-saffron-500', 'from-rose-400 to-maroon-500',
  'from-violet-400 to-violet-600', 'from-emerald-400 to-emerald-600', 'from-sky-400 to-sky-600',
  'from-amber-400 to-orange-500', 'from-pink-400 to-rose-500', 'from-neutral-400 to-neutral-600',
];

const empty = { name: '', description: '', monthlyBudget: '' };

export default function ExpenseCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(empty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await expensesApi.categories());
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setModal(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || '', monthlyBudget: c.monthlyBudget || '' });
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Category name is required.');
    const payload = {
      name: form.name.trim(),
      description: form.description,
      monthlyBudget: Number(form.monthlyBudget) || 0,
    };
    setSaving(true);
    try {
      if (editing) await expensesApi.updateCategory(editing.id, payload);
      else await expensesApi.createCategory(payload);
      toast.success(editing ? 'Category updated.' : 'Category created.');
      setModal(false);
      await load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await expensesApi.removeCategory(c.id);
      toast.success('Category deleted.');
      setCategories((list) => list.filter((x) => x.id !== c.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Categories"
        subtitle="Organize expenses by type"
        breadcrumb={[{ label: 'Expenses', to: '/expenses' }, { label: 'Categories' }]}
        actions={<Button icon={Plus} onClick={openNew}>Add Category</Button>}
      />

      {loading && <p className="py-6 text-center text-sm text-neutral-500">Loading categories…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c, i) => (
          <Card key={c.id} hover>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center text-white`}>
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-500"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(c)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <h3 className="font-serif font-semibold text-lg text-neutral-900 dark:text-white mt-3">{c.name}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="neutral">{c.count} {c.count === 1 ? 'expense' : 'expenses'}</Badge>
                {c.monthlyBudget > 0 && <span className="text-xs text-neutral-500">budget {formatCurrency(c.monthlyBudget)}/mo</span>}
              </div>
              <p className="text-2xl font-serif font-bold gradient-text mt-3">{formatCurrency(c.total)}</p>
              <p className="text-xs text-neutral-500 mt-1">Total spent</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit category' : 'New category'}>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Utilities" required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this category cover?" />
          <Input label="Monthly budget (optional)" type="number" value={form.monthlyBudget} onChange={(e) => setForm({ ...form, monthlyBudget: e.target.value })} placeholder="0" />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
