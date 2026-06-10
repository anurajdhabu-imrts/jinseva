import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Upload, FileText, IndianRupee, Building2, Calendar } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea } from '@components/Input';
import Button from '@components/Button';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, PROPERTY_CATEGORIES } from '@utils/constants';
import { useToast } from '@context/ToastContext';
import { expensesApi, apiError } from '@services/rbacService';

export default function AddExpense() {
  const [form, setForm] = useState({
    description: '', category: EXPENSE_CATEGORIES[0], property: PROPERTY_CATEGORIES[0], amount: '',
    vendor: '', date: '', method: PAYMENT_METHODS[0], notes: '',
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.description.trim() || !form.vendor.trim() || !amount || amount <= 0 || !form.date) {
      toast.error('Description, vendor, amount and date are required.');
      return;
    }
    setSaving(true);
    try {
      await expensesApi.create({
        category: form.category,
        property: form.property,
        description: form.description.trim(),
        vendor: form.vendor.trim(),
        amount,
        method: form.method,
        date: form.date,
        status: 'paid',
        notes: form.notes,
      });
      toast.success('Expense added successfully');
      nav('/expenses');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Expense"
        subtitle="Record a new temple expenditure"
        breadcrumb={[{ label: 'Expenses', to: '/expenses' }, { label: 'New' }]}
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Expense Details" />
            <CardBody className="space-y-4">
              <Input label="Description" icon={FileText} placeholder="What was this expense for?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <Select label="Property / Place" options={PROPERTY_CATEGORIES} value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Category" options={EXPENSE_CATEGORIES} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <Input label="Amount" icon={IndianRupee} type="number" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Vendor / Payee" icon={Building2} placeholder="Vendor name" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} required />
                <Input label="Date" icon={Calendar} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <Select label="Payment Method" options={PAYMENT_METHODS} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} />
              <Textarea label="Notes" placeholder="Any additional details…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Bill / Receipt Upload" subtitle="Attach the bill image or PDF" />
            <CardBody>
              <label className="block border-2 border-dashed border-sand-300 dark:border-neutral-700 rounded-2xl p-10 text-center cursor-pointer hover:border-saffron-500 transition-all">
                <input type="file" accept="image/*,application/pdf" className="hidden" />
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-saffron-100 to-gold-100 dark:from-saffron-500/20 dark:to-gold-500/20 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-saffron-600" />
                </div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Upload bill / invoice</p>
                <p className="text-xs text-neutral-500 mt-1">JPG, PNG, PDF up to 5 MB</p>
              </label>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-500/10 dark:to-rose-500/5 border-rose-200/50">
            <CardBody>
              <p className="text-xs uppercase text-rose-700 dark:text-rose-400">Expense Total</p>
              <p className="text-3xl font-serif font-bold text-rose-600 mt-1">₹{(Number(form.amount) || 0).toLocaleString('en-IN')}</p>
              <p className="text-xs text-neutral-500 mt-2">via {form.method}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-2">
              <Button type="submit" fullWidth icon={Save} loading={saving}>Save Expense</Button>
              <Button type="button" variant="ghost" fullWidth icon={X} onClick={() => nav('/expenses')}>Cancel</Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}
