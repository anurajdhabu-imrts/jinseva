import { useEffect, useState, useCallback } from 'react';
import { Phone, Mail, Plus, Star, Edit, Trash2, Package } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Modal from '@components/Modal';
import Input, { Select } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { inventoryApi, apiError } from '@services/rbacService';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];
const empty = { name: '', category: '', phone: '', email: '', rating: '', status: 'active' };

export default function Suppliers() {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(empty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSuppliers(await inventoryApi.suppliers());
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category || '', phone: s.phone || '', email: s.email || '', rating: s.rating || '', status: s.status || 'active' });
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Supplier name is required.');
    const payload = {
      name: form.name.trim(),
      category: form.category,
      phone: form.phone,
      email: form.email,
      rating: Number(form.rating) || 0,
      status: form.status,
    };
    setSaving(true);
    try {
      if (editing) await inventoryApi.updateSupplier(editing.id, payload);
      else await inventoryApi.createSupplier(payload);
      toast.success(editing ? 'Supplier updated.' : 'Supplier added.');
      setModal(false);
      await load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete supplier "${s.name}"? Linked items will be unlinked.`)) return;
    try {
      await inventoryApi.removeSupplier(s.id);
      toast.success('Supplier deleted.');
      setSuppliers((list) => list.filter((x) => x.id !== s.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        subtitle="Manage temple vendor relationships"
        breadcrumb={[{ label: 'Inventory', to: '/inventory' }, { label: 'Suppliers' }]}
        actions={<Button icon={Plus} onClick={openNew}>Add Supplier</Button>}
      />

      {loading && <p className="py-6 text-center text-sm text-neutral-500">Loading suppliers…</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <Card key={s.id} hover>
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-500 to-maroon-600 text-white flex items-center justify-center font-bold text-lg">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-neutral-900 dark:text-white">{s.name}</h3>
                  <p className="text-xs text-neutral-500">{s.category || '—'}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-500"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(s)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                {s.phone && <p className="inline-flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-neutral-400" />{s.phone}</p>}
                {s.email && <p className="inline-flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-neutral-400" />{s.email}</p>}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-sand-100 dark:border-neutral-800">
                <div>
                  <p className="text-xs text-neutral-500 inline-flex items-center gap-1"><Package className="w-3 h-3" /> Items</p>
                  <p className="font-serif font-bold text-lg gradient-text">{s.itemCount ?? 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Rating</p>
                  <div className="inline-flex items-center gap-0.5 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{s.rating || 0}</span>
                  </div>
                </div>
                <Badge variant={s.status === 'active' ? 'success' : 'neutral'} dot>{s.status}</Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit supplier' : 'New supplier'}>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Supplier name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Divya Stores" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Pooja Materials" />
            <Input label="Rating (0–5)" type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="4.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 …" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="vendor@email.com" />
          </div>
          <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
