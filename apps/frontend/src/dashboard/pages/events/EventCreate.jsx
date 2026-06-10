import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Calendar, Clock, MapPin, Users, Wallet } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea, Checkbox } from '@components/Input';
import Button from '@components/Button';
import ImageUpload from '@dashboard/components/widgets/ImageUpload';
import { useToast } from '@context/ToastContext';
import { eventsApi, apiError } from '@services/rbacService';
import { EVENT_CATEGORIES } from '@utils/constants';

export default function EventCreate() {
  const [form, setForm] = useState({
    title: '', type: 'Festival', category: '', date: '', time: '', endTime: '',
    location: '', organizer: '', expectedAttendees: '', budget: '',
    description: '', image: '', notifyDevotees: true, allowDonations: true,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const nav = useNavigate();

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      toast.error('Event title and date are required.');
      return;
    }
    setSaving(true);
    try {
      await eventsApi.create({
        title: form.title.trim(),
        type: form.type,
        category: form.category,
        date: form.date,
        time: form.time,
        endTime: form.endTime,
        location: form.location,
        organizer: form.organizer,
        status: 'upcoming',
        attendees: Number(form.expectedAttendees) || 0,
        budget: Number(form.budget) || 0,
        description: form.description,
        image: form.image,
        allowDonations: form.allowDonations,
      });
      toast.success('Event created successfully!');
      nav('/events');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Event"
        subtitle="Plan a festival, pooja or community gathering"
        breadcrumb={[{ label: 'Events', to: '/events' }, { label: 'New' }]}
      />

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Event Details" subtitle="Basic information about the event" />
            <CardBody className="space-y-4">
              <Input label="Event Title" placeholder="e.g., Maha Shivaratri Mahotsav" value={form.title} onChange={(e) => update('title', e.target.value)} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Event Type" value={form.type} onChange={(e) => update('type', e.target.value)} options={['Festival', 'Pooja', 'Discourse', 'Seva', 'Wedding', 'Community']} />
                <Input label="Organizer" placeholder="Festival committee" value={form.organizer} onChange={(e) => update('organizer', e.target.value)} />
              </div>
              <Textarea label="Description" rows={4} placeholder="Tell devotees about this event…" value={form.description} onChange={(e) => update('description', e.target.value)} />
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
              <Input label="Venue / Location" icon={MapPin} placeholder="Main temple complex" value={form.location} onChange={(e) => update('location', e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Expected attendees" icon={Users} type="number" placeholder="500" value={form.expectedAttendees} onChange={(e) => update('expectedAttendees', e.target.value)} />
                <Input label="Estimated budget" icon={Wallet} type="number" placeholder="250000" value={form.budget} onChange={(e) => update('budget', e.target.value)} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Event Banner" subtitle="Upload an image to attract devotees" />
            <CardBody>
              <ImageUpload value={form.image} onChange={(url) => update('image', url)} label="" hint="PNG, JPG, WebP up to 5 MB • Recommended 1920×1080" />
            </CardBody>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          <Card>
            <CardHeader title="Publishing" />
            <CardBody className="space-y-3">
              <Checkbox label="Notify all devotees" checked={form.notifyDevotees} onChange={(e) => update('notifyDevotees', e.target.checked)} />
              <Checkbox label="Accept donations for this event" checked={form.allowDonations} onChange={(e) => update('allowDonations', e.target.checked)} />
              <Checkbox label="Show on public temple website" defaultChecked />
              <Checkbox label="Enable RSVP/registration" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Categories & Tags" />
            <CardBody className="space-y-3">
              <Select label="Property / Place" value={form.category} onChange={(e) => update('category', e.target.value)} options={[{ value: '', label: 'Select place…' }, ...EVENT_CATEGORIES.map((c) => ({ value: c, label: c }))]} />
              <Input label="Tags (comma separated)" placeholder="diwali, lights, pooja" />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <Button type="submit" fullWidth icon={Save} loading={saving}>Publish Event</Button>
              <Button type="button" variant="secondary" fullWidth>Save as Draft</Button>
              <Button type="button" variant="ghost" fullWidth icon={X} onClick={() => nav('/events')}>Cancel</Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}
