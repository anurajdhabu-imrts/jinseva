import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, X, ArrowLeft, Calendar, MapPin, Users, Wallet } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea, Checkbox } from '@components/Input';
import ClockTimePicker from '@components/ClockTimePicker';
import Button from '@components/Button';
import ImageUpload from '@dashboard/components/widgets/ImageUpload';
import { useToast } from '@context/ToastContext';
import { useLookups } from '@context/LookupContext';
import { eventsApi, apiError } from '@services/rbacService';
import { EVENT_CATEGORIES, EVENT_TYPES } from '@utils/constants';

// Fallback used before the admin-managed list loads. Includes legacy types that
// existing events may still hold so the Select shows their current value.
const TYPE_OPTIONS = ['Festival', 'Pooja', 'Mahaparva', 'Janma Kalyanak', 'Tapasya', 'Discourse', 'Seva', 'Community'];
const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function EventEdit() {
  const { id } = useParams();
  const eventTypes = useLookups('event_type', EVENT_TYPES.length ? [...new Set([...EVENT_TYPES, ...TYPE_OPTIONS])] : TYPE_OPTIONS);
  const properties = useLookups('property', EVENT_CATEGORIES);
  const nav = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [form, setForm] = useState(null);
  // Always-current image URL + the in-flight upload, so Save never races it.
  const imageRef = useRef('');
  const pendingUploadRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ev = await eventsApi.get(id);
        if (cancelled) return;
        setForm({
          title: ev.title ?? '',
          type: ev.type ?? TYPE_OPTIONS[0],
          category: ev.category ?? '',
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
        imageRef.current = ev.image ?? '';
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
      // Bulletproof against the upload race: if an image is still uploading,
      // wait for it so we save the new URL, not the old/blank one.
      if (pendingUploadRef.current) {
        try { await pendingUploadRef.current; } catch { /* error already toasted */ }
      }
      
      // DEBUG: Log what we're about to send
      const imageToSend = imageRef.current;
      console.log('DEBUG: Submitting event with image:', {
        hasImage: !!imageToSend,
        imageLength: imageToSend ? imageToSend.length : 0,
        formImageLength: form.image ? form.image.length : 0,
        imageRef: imageToSend ? imageToSend.substring(0, 50) + '...' : 'empty'
      });
      
      await eventsApi.update(id, {
        title: form.title.trim(),
        type: form.type,
        category: form.category,
        status: form.status,
        date: form.date,
        time: form.time,
        endTime: form.endTime,
        location: form.location,
        organizer: form.organizer,
        attendees: Number(form.attendees) || 0,
        budget: Number(form.budget) || 0,
        description: form.description,
        image: imageToSend,
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
                <Select label="Property / Place" value={form.category} onChange={(e) => update('category', e.target.value)} options={[{ value: '', label: 'Select place…' }, ...properties.map((c) => ({ value: c, label: c }))]} />
                <Select label="Event Type" value={form.type} onChange={(e) => update('type', e.target.value)} options={eventTypes} />
              </div>
              <Input label="Organizer" value={form.organizer} onChange={(e) => update('organizer', e.target.value)} placeholder="Festival committee" />
              <Textarea label="Description" rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Tell devotees about this event…" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Schedule & Venue" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Date" icon={Calendar} type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required />
                <ClockTimePicker label="Start time" value={form.time} onChange={(v) => update('time', v)} />
                <ClockTimePicker label="End time" value={form.endTime} onChange={(v) => update('endTime', v)} />
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
              <ImageUpload
                value={imageRef.current || form.image}
                onChange={(url) => { 
                  imageRef.current = url; 
                  update('image', url); 
                  console.log('Image updated:', url.substring(0, 50) + '...');
                }}
                onUploadingChange={setImgUploading}
                onPending={(p) => { pendingUploadRef.current = p; }}
                label="Banner image"
              />
              <Checkbox label="Accept donations for this event" checked={form.allowDonations} onChange={(e) => update('allowDonations', e.target.checked)} />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <Button type="submit" fullWidth icon={Save} loading={saving} disabled={imgUploading}>
                {imgUploading ? 'Uploading image…' : 'Save Changes'}
              </Button>
              <Button type="button" variant="ghost" fullWidth icon={X} onClick={() => nav(`/events/${id}`)}>Cancel</Button>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}
