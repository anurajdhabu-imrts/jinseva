import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, Mail, Phone, IndianRupee, Receipt, X } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea, Checkbox } from '@components/Input';
import Button from '@components/Button';
import { DONATION_TYPES, PAYMENT_METHODS, formatCurrency } from '@utils/constants';
import { useToast } from '@context/ToastContext';
import { donationsApi, apiError } from '@services/rbacService';

const quickAmounts = [501, 1001, 2100, 5100, 11000, 25000];

export default function AddDonation() {
  const [form, setForm] = useState({
    donor: '', email: '', phone: '', type: DONATION_TYPES[0],
    amount: '', method: PAYMENT_METHODS[0], purpose: '', anonymous: false, sendReceipt: true,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const nav = useNavigate();
  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      toast.error('Enter a valid donation amount.');
      return;
    }
    if (!form.anonymous && !form.donor.trim()) {
      toast.error('Donor name is required (or mark the donation anonymous).');
      return;
    }
    setSaving(true);
    try {
      await donationsApi.create({
        donor: form.anonymous ? 'Anonymous' : form.donor.trim(),
        email: form.email,
        phone: form.phone,
        type: form.type,
        amount,
        method: form.method,
        date: new Date().toISOString().slice(0, 10),
        status: 'paid',
        purpose: form.purpose,
        anonymous: form.anonymous,
      });
      toast.success('Donation recorded!');
      nav('/donations');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Record New Donation"
        subtitle="Capture a contribution with grace"
        breadcrumb={[{ label: 'Donations', to: '/donations' }, { label: 'New' }]}
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Donor Information" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Donor Name" icon={User} placeholder="Full name" value={form.donor} onChange={(e) => update('donor', e.target.value)} disabled={form.anonymous} required={!form.anonymous} />
                <Input label="Email" icon={Mail} type="email" placeholder="donor@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} disabled={form.anonymous} />
              </div>
              <Input label="Phone" icon={Phone} type="tel" placeholder="+91 98765-43210" value={form.phone} onChange={(e) => update('phone', e.target.value)} disabled={form.anonymous} />
              <Checkbox label="Anonymous donation" checked={form.anonymous} onChange={(e) => update('anonymous', e.target.checked)} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Donation Details" />
            <CardBody className="space-y-4">
              <Select label="Purpose" options={DONATION_TYPES} value={form.type} onChange={(e) => update('type', e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Amount</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                  {quickAmounts.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => update('amount', a)}
                      className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                        Number(form.amount) === a
                          ? 'bg-gradient-to-br from-saffron-500 to-saffron-600 text-white border-transparent shadow-md'
                          : 'border-sand-200 dark:border-neutral-700 hover:border-saffron-500'
                      }`}
                    >
                      {formatCurrency(a)}
                    </button>
                  ))}
                </div>
                <Input icon={IndianRupee} type="number" placeholder="Enter custom amount" value={form.amount} onChange={(e) => update('amount', e.target.value)} required />
              </div>
              <Select label="Payment Method" options={PAYMENT_METHODS} value={form.method} onChange={(e) => update('method', e.target.value)} />
              <Textarea label="Notes / Purpose" placeholder="Special prayer, dedication, occasion…" value={form.purpose} onChange={(e) => update('purpose', e.target.value)} />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Receipt Options" />
            <CardBody className="space-y-3">
              <Checkbox label="Send digital receipt via email" checked={form.sendReceipt} onChange={(e) => update('sendReceipt', e.target.checked)} />
              <Checkbox label="Generate 80G tax certificate" defaultChecked />
              <Checkbox label="Add to donor mailing list" defaultChecked />
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-saffron-50 to-gold-50 dark:from-saffron-500/10 dark:to-gold-500/10 border-saffron-200/50">
            <CardBody>
              <div className="text-center">
                <Receipt className="w-10 h-10 mx-auto text-saffron-600 mb-3" />
                <p className="text-xs uppercase tracking-wider text-neutral-500">Total Amount</p>
                <p className="text-3xl font-serif font-bold gradient-text mt-1">
                  {formatCurrency(Number(form.amount) || 0)}
                </p>
                <p className="text-xs text-neutral-500 mt-2">via {form.method}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <Button type="submit" fullWidth icon={Save} loading={saving}>Record Donation</Button>
              <Button type="button" variant="ghost" fullWidth icon={X} onClick={() => nav('/donations')}>Cancel</Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}
