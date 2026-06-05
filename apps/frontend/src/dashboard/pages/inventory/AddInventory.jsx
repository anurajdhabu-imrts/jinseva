import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Package, Building2, IndianRupee } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea } from '@components/Input';
import Button from '@components/Button';
import { useToast } from '@context/ToastContext';
import { inventoryApi, apiError } from '@services/rbacService';

const categories = ['Pooja Materials', 'Decorations', 'Prasadam', 'Cleaning', 'Maintenance', 'Bhojanshala', 'Aangi', 'Office Supplies'];
const units = ['kg', 'g', 'L', 'ml', 'pcs', 'pkt', 'box'];

export default function AddInventory() {
  const [form, setForm] = useState({ item: '', category: categories[0], quantity: '', unit: units[0], minStock: '', supplier: '', costPerUnit: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.item.trim() || form.quantity === '') {
      toast.error('Item name and quantity are required.');
      return;
    }
    setSaving(true);
    try {
      await inventoryApi.create({
        item: form.item.trim(),
        category: form.category,
        quantity: Number(form.quantity) || 0,
        unit: form.unit,
        minStock: Number(form.minStock) || 0,
        supplier: form.supplier.trim(),
        costPerUnit: Number(form.costPerUnit) || 0,
        lastRestock: new Date().toISOString().slice(0, 10),
        notes: form.notes,
      });
      toast.success('Inventory item added');
      nav('/inventory');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Inventory Item"
        subtitle="Track new supplies & materials"
        breadcrumb={[{ label: 'Inventory', to: '/inventory' }, { label: 'New' }]}
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Item Details" />
            <CardBody className="space-y-4">
              <Input label="Item Name" icon={Package} placeholder="e.g., Camphor (Kapur)" value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} required />
              <Select label="Category" options={categories} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Initial Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                <Select label="Unit" options={units} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                <Input label="Min Stock Alert" type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
              </div>
              <Textarea label="Notes / Storage Location" placeholder="Where is this stored?" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Supplier & Pricing" />
            <CardBody className="space-y-4">
              <Input label="Supplier" icon={Building2} placeholder="Supplier name" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
              <Input label="Cost per Unit" icon={IndianRupee} type="number" placeholder="0" value={form.costPerUnit} onChange={(e) => setForm({ ...form, costPerUnit: e.target.value })} />
            </CardBody>
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <CardBody className="space-y-2">
              <Button type="submit" fullWidth icon={Save} loading={saving}>Save Item</Button>
              <Button type="button" variant="ghost" fullWidth icon={X} onClick={() => nav('/inventory')}>Cancel</Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}
