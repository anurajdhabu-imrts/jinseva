import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Upload, FileText, IndianRupee, Building2, Calendar } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea } from '@components/Input';
import Button from '@components/Button';
import { INCOME_CATEGORIES, PAYMENT_METHODS } from '@utils/constants';
import { useToast } from '@context/ToastContext';
import { incomeApi, apiError } from '@services/rbacService';

export default function AddIncome() {
  const [form, setForm] = useState({
    description: '',
    category: INCOME_CATEGORIES[0],
    amount: '',
    source: '',
    date: '',
    method: PAYMENT_METHODS[0],
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.description.trim() || !form.source.trim() || !amount || amount <= 0 || !form.date) {
      toast.error('Description, source, amount and date are required.');
      return;
    }
    setSaving(true);
    try {
      await incomeApi.create({
        category: form.category,
        description: form.description.trim(),
        source: form.source.trim(),
        amount,
        method: form.method,
        date: form.date,
        status: 'paid',
        notes: form.notes,
      });
      toast.success('Income recorded successfully');
      nav('/income');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Income"
        subtitle="Record any non-donation income — hall rental, bhojanshala, dharmashala, panjarapole etc."
        breadcrumb={[{ label: 'Income', to: '/income' }, { label: 'New' }]}
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Income Details" />
            <CardBody className="space-y-4">
              <Input
                label="Description"
                icon={FileText}
                placeholder="What was this income from?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  options={INCOME_CATEGORIES}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
                <Input
                  label="Amount"
                  icon={IndianRupee}
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Source / Payer"
                  icon={Building2}
                  placeholder="Who paid?"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  required
                />
                <Input
                  label="Date"
                  icon={Calendar}
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <Select
                label="Payment Method"
                options={PAYMENT_METHODS}
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              />
              <Textarea
                label="Notes"
                placeholder="Any additional details — booking ref, event linked, etc."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Receipt / Invoice" subtitle="Optional supporting document" />
            <CardBody>
              <label className="block border-2 border-dashed border-sand-300 dark:border-neutral-700 rounded-2xl p-10 text-center cursor-pointer hover:border-saffron-500 transition-all">
                <input type="file" accept="image/*,application/pdf" className="hidden" />
                <div className="w-14 h-14 mx-auto rounded-full bg-jain-green-100 dark:bg-jain-green-600/15 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-jain-green-700" />
                </div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Upload invoice / receipt</p>
                <p className="text-xs text-neutral-500 mt-1">JPG, PNG, PDF up to 5 MB</p>
              </label>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="bg-jain-green-50 dark:bg-jain-green-600/10 border-jain-green-200/50">
            <CardBody>
              <p className="text-xs uppercase text-jain-green-700 dark:text-jain-green-400">Income Total</p>
              <p className="text-3xl font-serif font-bold text-jain-green-700 mt-1">
                + ₹{(Number(form.amount) || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-neutral-500 mt-2">via {form.method}</p>
              <div className="my-4 h-px bg-jain-green-200/60" />
              <p className="text-xs text-neutral-500">Category</p>
              <p className="font-medium text-sm text-neutral-900 dark:text-white mt-1">{form.category}</p>
              <p className="text-xs text-neutral-500 mt-3">Source</p>
              <p className="font-medium text-sm text-neutral-900 dark:text-white mt-1">{form.source || '—'}</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <Button type="submit" fullWidth icon={Save} loading={saving}>Save Income</Button>
              <Button type="button" variant="ghost" fullWidth icon={X} onClick={() => nav('/income')}>Cancel</Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}
