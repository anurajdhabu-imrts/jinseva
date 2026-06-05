import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft, Edit, Share2, IndianRupee, Receipt,
  Image, BookOpenCheck, HandHeart, Trash2, Plus
} from 'lucide-react';
import Card, { CardBody, CardHeader } from '@components/Card';
import Badge from '@components/Badge';
import Button from '@components/Button';
import Tabs from '@components/Tabs';
import Avatar from '@components/Avatar';
import Table from '@components/Table';
import Modal from '@components/Modal';
import EmptyState from '@components/EmptyState';
import Input, { Select, Textarea, Checkbox } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { eventsApi, apiError } from '@services/rbacService';
import { galleryImages } from '@data/mockData';
import {
  formatCurrency, formatDate, STATUS_COLORS, PAYMENT_METHODS, EXPENSE_CATEGORIES,
} from '@utils/constants';

const today = () => new Date().toISOString().slice(0, 10);

// ── Donations tab ──────────────────────────────────────────────
function DonationsTab({ donations, onAdd, onDelete }) {
  const total = donations.reduce((s, d) => s + d.amount, 0);
  const avg = donations.length ? Math.round(total / donations.length) : 0;
  const uniqueDonors =
    new Set(donations.filter((d) => !d.anonymous).map((d) => d.donor)).size +
    donations.filter((d) => d.anonymous).length;
  const topDonors = [...donations].sort((a, b) => b.amount - a.amount).slice(0, 3);
  const byMethod = PAYMENT_METHODS.map((m) => ({
    method: m,
    count: donations.filter((d) => d.method === m).length,
    amount: donations.filter((d) => d.method === m).reduce((s, d) => s + d.amount, 0),
  })).filter((m) => m.count > 0);

  const columns = [
    { key: 'donor', title: 'Donor', render: (v, row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.anonymous ? 'A' : v} size="sm" />
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{row.anonymous ? 'Anonymous' : v}</p>
          {row.message && <p className="text-xs text-neutral-500 italic mt-0.5">"{row.message}"</p>}
        </div>
      </div>
    )},
    { key: 'method', title: 'Method', render: (v) => <Badge variant="primary">{v}</Badge> },
    { key: 'date', title: 'Date', render: (v) => formatDate(v) },
    { key: 'amount', title: 'Amount', align: 'right', render: (v) => (
      <span className="font-semibold gradient-text">{formatCurrency(v)}</span>
    )},
    { key: 'actions', title: '', align: 'right', render: (_, row) => (
      <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600">
        <Trash2 className="w-4 h-4" />
      </button>
    )},
  ];

  if (donations.length === 0) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            icon={HandHeart}
            title="No donations recorded yet"
            description="Donations made specifically for this event will appear here."
            action={<Button icon={Plus} onClick={onAdd}>Record Donation</Button>}
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardBody>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Raised</p>
              <p className="font-display text-3xl font-bold gradient-text mt-2">{formatCurrency(total)}</p>
              <p className="text-xs text-neutral-500 mt-1">for this event</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-saffron-100 dark:bg-saffron-500/15 text-saffron-700 dark:text-saffron-400 flex items-center justify-center"><HandHeart className="w-5 h-5" /></div>
          </div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Donors</p>
              <p className="font-display text-3xl font-bold text-neutral-900 dark:text-white mt-2">{uniqueDonors}</p>
              <p className="text-xs text-neutral-500 mt-1">{donations.length} contributions</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-jain-green-100 dark:bg-jain-green-600/15 text-jain-green-700 dark:text-jain-green-400 flex items-center justify-center"><Users className="w-5 h-5" /></div>
          </div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Average Daan</p>
              <p className="font-display text-3xl font-bold text-neutral-900 dark:text-white mt-2">{formatCurrency(avg)}</p>
              <p className="text-xs text-neutral-500 mt-1">per donor</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-jain-yellow-100 dark:bg-jain-yellow-600/15 text-jain-yellow-800 dark:text-jain-yellow-300 flex items-center justify-center"><IndianRupee className="w-5 h-5" /></div>
          </div>
        </CardBody></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Top Contributors" subtitle="Sevaks who powered this event" />
          <CardBody className="p-0">
            <div className="divide-y divide-sand-100 dark:divide-neutral-800">
              {topDonors.map((d, i) => {
                const rank = ['from-jain-yellow-400 to-jain-yellow-600', 'from-neutral-300 to-neutral-500', 'from-jain-red-500 to-jain-red-700'][i];
                return (
                  <div key={d.id} className="flex items-center gap-4 px-5 py-4">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${rank} text-white flex items-center justify-center font-bold text-sm shrink-0`}>#{i + 1}</div>
                    <Avatar name={d.anonymous ? 'A' : d.donor} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 dark:text-white">{d.anonymous ? 'Anonymous' : d.donor}</p>
                      {d.message && <p className="text-xs text-neutral-500 italic mt-0.5">"{d.message}"</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold gradient-text">{formatCurrency(d.amount)}</p>
                      <p className="text-xs text-neutral-500">{d.method}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="By Payment Method" />
          <CardBody className="space-y-3">
            {byMethod.map((m) => {
              const pct = total ? Math.round((m.amount / total) * 100) : 0;
              return (
                <div key={m.method}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{m.method}</span>
                    <span className="font-semibold">{formatCurrency(m.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                    <span>{m.count} {m.count === 1 ? 'donation' : 'donations'}</span><span>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-sand-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-saffron-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="All Donations"
          subtitle={`${donations.length} contributions for this event`}
          action={<Button size="sm" icon={Plus} onClick={onAdd}>Record Donation</Button>}
        />
        <CardBody className="p-0">
          <Table columns={columns} data={donations} rowKey="id" className="border-0 rounded-none" />
        </CardBody>
      </Card>
    </div>
  );
}

// ── Expenses tab ───────────────────────────────────────────────
function ExpensesTab({ expenses, onAdd, onDelete }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  return (
    <Card>
      <CardHeader
        title="Event Expenses"
        subtitle={expenses.length ? `${expenses.length} expenses • ${formatCurrency(total)} total` : 'Track all spending related to this event'}
        action={<Button size="sm" icon={IndianRupee} onClick={onAdd}>Add Expense</Button>}
      />
      <CardBody className="p-0">
        {expenses.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Receipt}
              title="No expenses yet"
              description="Record spending for this event to track its budget."
              action={<Button icon={Plus} onClick={onAdd}>Add Expense</Button>}
            />
          </div>
        ) : (
          <div className="divide-y divide-sand-100 dark:divide-neutral-800">
            {expenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-4 hover:bg-sand-50/50 dark:hover:bg-neutral-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-jain-red-50 dark:bg-jain-red-600/20 flex items-center justify-center"><Receipt className="w-4 h-4 text-jain-red-600" /></div>
                  <div>
                    <p className="font-medium text-sm">{e.description}</p>
                    <p className="text-xs text-neutral-500">{e.category}{e.vendor ? ` • ${e.vendor}` : ''} • {formatDate(e.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-jain-red-600">- {formatCurrency(e.amount)}</p>
                    <Badge variant={STATUS_COLORS[e.status]}>{e.status}</Badge>
                  </div>
                  <button onClick={() => onDelete(e)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState(null);
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [donationModal, setDonationModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [donationForm, setDonationForm] = useState({ donor: '', amount: '', method: PAYMENT_METHODS[0], date: today(), message: '', anonymous: false });
  const [expenseForm, setExpenseForm] = useState({ category: EXPENSE_CATEGORIES[0], description: '', vendor: '', amount: '', method: PAYMENT_METHODS[0], date: today() });

  const loadAll = useCallback(async () => {
    // The event itself is required — only this failing should bounce to the list.
    let ev;
    try {
      ev = await eventsApi.get(id);
    } catch (err) {
      toast.error(apiError(err));
      nav('/events');
      return;
    }
    setEvent(ev);

    // Donations + expenses are best-effort: a failure here (e.g. an older
    // backend without the expenses route) must NOT kick the user off the page.
    const [dn, ex] = await Promise.allSettled([
      eventsApi.donations(id),
      eventsApi.expenses(id),
    ]);
    setDonations(dn.status === 'fulfilled' ? dn.value.data || [] : []);
    setExpenses(ex.status === 'fulfilled' ? ex.value.data || [] : []);
    if (ex.status === 'rejected') {
      toast.error('Expenses unavailable — restart the backend to enable event expenses.');
    }
    setLoading(false);
  }, [id, nav, toast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── Donation handlers ──
  const submitDonation = async (e) => {
    e.preventDefault();
    const amount = Number(donationForm.amount);
    if (!amount || amount <= 0) return toast.error('Enter a valid amount.');
    if (!donationForm.anonymous && !donationForm.donor.trim()) return toast.error('Donor name is required.');
    setSaving(true);
    try {
      await eventsApi.addDonation(id, {
        donor: donationForm.anonymous ? 'Anonymous' : donationForm.donor.trim(),
        amount,
        method: donationForm.method,
        date: donationForm.date,
        message: donationForm.message,
        anonymous: donationForm.anonymous,
      });
      toast.success('Donation recorded.');
      setDonationModal(false);
      setDonationForm({ donor: '', amount: '', method: PAYMENT_METHODS[0], date: today(), message: '', anonymous: false });
      await loadAll();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const deleteDonation = async (row) => {
    if (!window.confirm(`Remove donation from ${row.donor}?`)) return;
    try {
      await eventsApi.removeDonation(id, row.id);
      toast.success('Donation removed.');
      await loadAll();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  // ── Expense handlers ──
  const submitExpense = async (e) => {
    e.preventDefault();
    const amount = Number(expenseForm.amount);
    if (!expenseForm.description.trim() || !amount || amount <= 0) return toast.error('Description and a valid amount are required.');
    setSaving(true);
    try {
      await eventsApi.addExpense(id, {
        category: expenseForm.category,
        description: expenseForm.description.trim(),
        vendor: expenseForm.vendor,
        amount,
        method: expenseForm.method,
        date: expenseForm.date,
        status: 'paid',
      });
      toast.success('Expense added.');
      setExpenseModal(false);
      setExpenseForm({ category: EXPENSE_CATEGORIES[0], description: '', vendor: '', amount: '', method: PAYMENT_METHODS[0], date: today() });
      await loadAll();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (row) => {
    if (!window.confirm(`Delete expense "${row.description}"?`)) return;
    try {
      await eventsApi.removeExpense(id, row.id);
      toast.success('Expense removed.');
      await loadAll();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading event…</p>;
  if (!event) return null;

  const fundedPct = event.budget > 0 ? Math.round((event.raised / event.budget) * 100) : 0;

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader title="About this event" />
            <CardBody>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{event.description || '—'}</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                  { l: 'Date', v: formatDate(event.date), i: Calendar },
                  { l: 'Time', v: `${event.time || '—'}${event.endTime ? ` - ${event.endTime}` : ''}`, i: Clock },
                  { l: 'Venue', v: event.location || '—', i: MapPin },
                  { l: 'Expected', v: `${(event.attendees || 0).toLocaleString('en-IN')} attendees`, i: Users },
                ].map((d) => (
                  <div key={d.l} className="flex items-center gap-3 p-3 rounded-xl bg-sand-50 dark:bg-neutral-800/50">
                    <div className="w-9 h-9 rounded-lg bg-saffron-100 dark:bg-saffron-500/20 flex items-center justify-center"><d.i className="w-4 h-4 text-saffron-600" /></div>
                    <div><p className="text-xs text-neutral-500">{d.l}</p><p className="font-medium text-sm text-neutral-900 dark:text-white">{d.v}</p></div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Fundraising progress" />
            <CardBody>
              <div className="text-center">
                <div className="text-4xl font-serif font-bold gradient-text">{fundedPct}%</div>
                <p className="text-sm text-neutral-500 mt-1">of {formatCurrency(event.budget)} target</p>
              </div>
              <div className="mt-5 w-full bg-sand-200 dark:bg-neutral-800 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-saffron-500 rounded-full transition-all" style={{ width: `${Math.min(fundedPct, 100)}%` }} />
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-neutral-500">Raised</span><span className="font-semibold">{formatCurrency(event.raised)}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Target</span><span className="font-semibold">{formatCurrency(event.budget)}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Remaining</span><span className="font-semibold text-saffron-600">{formatCurrency(Math.max(event.budget - event.raised, 0))}</span></div>
              </div>
              <Button fullWidth className="mt-5" icon={HandHeart} onClick={() => setDonationModal(true)}>Record Donation</Button>
            </CardBody>
          </Card>
        </div>
      ),
    },
    {
      key: 'expenses',
      label: 'Expenses',
      icon: Receipt,
      count: expenses.length,
      content: <ExpensesTab expenses={expenses} onAdd={() => setExpenseModal(true)} onDelete={deleteExpense} />,
    },
    {
      key: 'donations',
      label: 'Donations',
      icon: HandHeart,
      count: donations.length,
      content: <DonationsTab donations={donations} onAdd={() => setDonationModal(true)} onDelete={deleteDonation} />,
    },
    {
      key: 'gallery',
      label: 'Gallery',
      icon: Image,
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {galleryImages.slice(0, 8).map((img) => (
            <div key={img.id} className="aspect-square rounded-xl overflow-hidden group cursor-pointer relative">
              <img src={img.src} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3"><p className="text-white text-xs font-medium">{img.caption}</p></div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'bookings',
      label: 'Bookings',
      icon: BookOpenCheck,
      content: (
        <Card><CardBody><p className="text-center text-neutral-500 py-10">{(event.attendees || 0).toLocaleString('en-IN')} devotees expected for this event.</p></CardBody></Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Link to="/events" className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> All events
      </Link>

      <div className="relative overflow-hidden rounded-3xl h-64 md:h-80">
        {event.image && <img src={event.image} alt={event.title} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={STATUS_COLORS[event.status]}>{event.status}</Badge>
            <Badge variant="primary">{event.type}</Badge>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold">{event.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-3 text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(event.date)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" />{event.time || '—'}{event.endTime ? ` - ${event.endTime}` : ''}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{event.location || '—'}</span>
          </div>
        </div>
        <div className="absolute top-5 right-5 flex gap-2">
          <button className="px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur hover:bg-white/25 text-white text-sm font-medium inline-flex items-center gap-1.5 border border-white/20">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={() => nav(`/events/${id}/edit`)}
            className="px-3.5 py-2 rounded-xl bg-white text-jain-red-700 hover:bg-white/95 text-sm font-medium inline-flex items-center gap-1.5"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      <Tabs tabs={tabs} variant="underline" />

      {/* Record Donation modal */}
      <Modal open={donationModal} onClose={() => setDonationModal(false)} title="Record event donation" subtitle={event.title}>
        <form onSubmit={submitDonation} className="space-y-4">
          <Checkbox label="Anonymous donation" checked={donationForm.anonymous} onChange={(e) => setDonationForm({ ...donationForm, anonymous: e.target.checked })} />
          {!donationForm.anonymous && (
            <Input label="Donor name" value={donationForm.donor} onChange={(e) => setDonationForm({ ...donationForm, donor: e.target.value })} placeholder="Full name" required />
          )}
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount" type="number" value={donationForm.amount} onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })} placeholder="0" required />
            <Select label="Method" options={PAYMENT_METHODS} value={donationForm.method} onChange={(e) => setDonationForm({ ...donationForm, method: e.target.value })} />
          </div>
          <Input label="Date" type="date" value={donationForm.date} onChange={(e) => setDonationForm({ ...donationForm, date: e.target.value })} />
          <Textarea label="Message (optional)" value={donationForm.message} onChange={(e) => setDonationForm({ ...donationForm, message: e.target.value })} placeholder="Dedication or note…" />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setDonationModal(false)}>Cancel</Button>
            <Button type="submit" icon={HandHeart} loading={saving}>Record</Button>
          </div>
        </form>
      </Modal>

      {/* Add Expense modal */}
      <Modal open={expenseModal} onClose={() => setExpenseModal(false)} title="Add event expense" subtitle={event.title}>
        <form onSubmit={submitExpense} className="space-y-4">
          <Input label="Description" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="What was the spend for?" required />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" options={EXPENSE_CATEGORIES} value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} />
            <Input label="Vendor" value={expenseForm.vendor} onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })} placeholder="Paid to" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount" type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} placeholder="0" required />
            <Select label="Method" options={PAYMENT_METHODS} value={expenseForm.method} onChange={(e) => setExpenseForm({ ...expenseForm, method: e.target.value })} />
          </div>
          <Input label="Date" type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setExpenseModal(false)}>Cancel</Button>
            <Button type="submit" icon={IndianRupee} loading={saving}>Add Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
