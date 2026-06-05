import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, X, ArrowLeft, Calendar, Clock, MapPin, Users, Wallet } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea, Checkbox } from '@components/Input';
import Button from '@components/Button';
import { useToast } from '@context/ToastContext';
import { eventsApi, apiError } from '@services/rbacService';

const TYPE_OPTIONS = ['Festival', 'Pooja', 'Mahaparva', 'Janma Kalyanak', 'Tapasya', 'Discourse', 'Seva', 'Community'];
const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function EventEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ev = await eventsApi.get(id);
        if (cancelled) return;
        setForm({
          title: ev.title ?? '',
          type: ev.type ?? TYPE_OPTIONS[0],
          status: ev.status ?? 'upcoming',
          date: ev.date ?? '',
          time: ev.time ?? '',
          endTime: ev.endTime ?? '',
          location: ev.location ?? '',
          organizer: ev.organizer ?? '',
          attendees: ev.attendees ?? 0,
          budget: ev.budget ?? 0,
          description: ev.description ?? '',
          image: ev.image ?? '',
          allowDonations: ev.allowDonations ?? true,
        });
      } catch (err) {
        toast.error(apiError(err));
        nav('/events');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, nav, toast]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      toast.error('Event title and date are required.');
      return;
    }
    setSaving(true);
    try {
      await eventsApi.update(id, {
        title: form.title.trim(),
        type: form.type,
        status: form.status,
        date: form.date,
        time: form.time,
        endTime: form.endTime,
        location: form.location,
        organizer: form.organizer,
        attendees: Number(form.attendees) || 0,
        budget: Number(form.budget) || 0,
        description: form.description,
        image: form.image,
        allowDonations: form.allowDonations,
      });
      toast.success('Event updated.');
      nav(`/events/${id}`);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading event…</p>;
  if (!form) return null;

  return (
    <div className="space-y-6">
      <Link to={`/events/${id}`} className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to event
      </Link>

      <PageHeader
        title="Edit Event"
        subtitle={form.title}
        breadcrumb={[{ label: 'Events', to: '/events' }, { label: form.title, to: `/events/${id}` }, { label: 'Edit' }]}
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Event Details" />
            <CardBody className="space-y-4">
              <Input label="Event Title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Event Type" value={form.type} onChange={(e) => update('type', e.target.value)} options={TYPE_OPTIONS} />
                <Input label="Organizer" value={form.organizer} onChange={(e) => update('organizer', e.target.value)} placeholder="Festival committee" />
              </div>
              <Textarea label="Description" rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Tell devotees about this event…" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Schedule & Venue" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Date" icon={Calendar} type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required />
                <Input label="Start time" icon={Clock} type="time" value={form.time} onChange={(e) => update('time', e.target.value)} />
                <Input label="End time" icon={Clock} type="time" value={form.endTime} onChange={(e) => update('endTime', e.target.value)} />
              </div>
              <Input label="Venue / Location" icon={MapPin} value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Main temple complex" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Expected attendees" icon={Users} type="number" value={form.attendees} onChange={(e) => update('attendees', e.target.value)} />
                <Input label="Budget" icon={Wallet} type="number" value={form.budget} onChange={(e) => update('budget', e.target.value)} />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Status & Options" />
            <CardBody className="space-y-4">
              <Select label="Status" value={form.status} onChange={(e) => update('status', e.target.value)} options={STATUS_OPTIONS} />
              <Input label="Banner image URL" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://…" />
              <Checkbox label="Accept donations for this event" checked={form.allowDonations} onChange={(e) => update('allowDonations', e.target.checked)} />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <Button type="submit" fullWidth icon={Save} loading={saving}>Save Changes</Button>
              <Button type="button" variant="ghost" fullWidth icon={X} onClick={() => nav(`/events/${id}`)}>Cancel</Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}
