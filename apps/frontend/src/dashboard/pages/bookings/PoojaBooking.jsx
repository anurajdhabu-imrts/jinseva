import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, Phone, Mail, Calendar, Clock, IndianRupee, X, Sparkles } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea } from '@components/Input';
import Button from '@components/Button';
import { POOJA_TYPES, formatCurrency } from '@utils/constants';
import { useToast } from '@context/ToastContext';
import { bookingsApi, apiError } from '@services/rbacService';

const poojaPrices = {
  'Snatra Pooja': 2100,
  'Panch Kalyanak Pooja': 11000,
  'Ashta Prakari Pooja': 3100,
  'Antaraay Karm Pooja': 7500,
  '99 Yatra Pooja': 2100,
  'Navpad Oli': 5100,
  'Bhaktamar Pooja': 5100,
  'Naming Ceremony': 4100,
  'Snatak (Anniversary)': 4100,
  'Pratishtha Mahotsav': 51000,
};

export default function PoojaBooking() {
  const [form, setForm] = useState({
    devotee: '', email: '', phone: '', pooja: POOJA_TYPES[0],
    date: '', time: '', priest: 'Any Available', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const nav = useNavigate();
  const price = poojaPrices[form.pooja] || 1100;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.devotee.trim() || !form.phone.trim() || !form.date || !form.time) {
      toast.error('Devotee name, phone, date and time are required.');
      return;
    }
    setSaving(true);
    try {
      await bookingsApi.create({
        devotee: form.devotee.trim(),
        email: form.email,
        phone: form.phone,
        bookingType: 'pooja',
        pooja: form.pooja,
        date: form.date,
        time: form.time,
        priest: form.priest,
        amount: price,
        status: 'pending',
        notes: form.notes,
      });
      toast.success('Pooja booked!');
      nav('/bookings');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book a Pooja"
        subtitle="Schedule a sacred ceremony"
        breadcrumb={[{ label: 'Bookings', to: '/bookings' }, { label: 'New' }]}
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Devotee Information" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Devotee Name" icon={User} placeholder="Full name" value={form.devotee} onChange={(e) => setForm({ ...form, devotee: e.target.value })} required />
                <Input label="Phone" icon={Phone} type="tel" placeholder="+91 98765-43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <Input label="Email" icon={Mail} type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Pooja Details" />
            <CardBody className="space-y-4">
              <Select label="Pooja Type" options={POOJA_TYPES} value={form.pooja} onChange={(e) => setForm({ ...form, pooja: e.target.value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Preferred Date" icon={Calendar} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                <Input label="Preferred Time" icon={Clock} type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
              </div>
              <Select label="Preferred Priest" options={['Any Available', 'Pandit Suresh Sharma', 'Acharya Vinod Tiwari', 'Pandit Ramesh Joshi']} value={form.priest} onChange={(e) => setForm({ ...form, priest: e.target.value })} />
              <Textarea label="Special Instructions / Sankalp" placeholder="Family details, special prayer, dedication…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-saffron-500 via-saffron-600 to-maroon-700 text-white p-6 relative">
              <div className="absolute inset-0 bg-mandala opacity-20" />
              <Sparkles className="w-7 h-7 mb-3" />
              <h3 className="font-serif text-lg font-semibold">Booking Summary</h3>
            </div>
            <CardBody className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-neutral-500">Pooja</span><span className="font-medium">{form.pooja}</span></div>
              <div className="flex justify-between text-sm"><span className="text-neutral-500">Date</span><span className="font-medium">{form.date || '—'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-neutral-500">Time</span><span className="font-medium">{form.time || '—'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-neutral-500">Priest</span><span className="font-medium">{form.priest}</span></div>
              <div className="pt-3 border-t border-sand-100 dark:border-neutral-800">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Total Amount</span>
                  <span className="font-serif text-2xl font-bold gradient-text">{formatCurrency(price)}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">Includes all pooja materials</p>
              </div>
              <Button type="submit" fullWidth icon={Save} loading={saving}>Confirm Booking</Button>
              <Button type="button" variant="ghost" fullWidth icon={X} onClick={() => nav('/bookings')}>Cancel</Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}
