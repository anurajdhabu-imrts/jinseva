import { useState, useEffect, useCallback } from 'react';
import { Save, User, Phone, Mail, MapPin, Heart, X, Users } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea, Checkbox } from '@components/Input';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Avatar from '@components/Avatar';
import { useToast } from '@context/ToastContext';
import { staffApi, apiError } from '@services/rbacService';

const sevaAreas = ['Annadanam', 'Decoration', 'Events', 'Cleaning', 'Information Desk', 'Sound & Lights', 'Security', 'Stage Management'];
const empty = { name: '', email: '', phone: '', city: '', area: sevaAreas[0], availability: '', skills: '' };

export default function VolunteerRegister() {
  const { toast } = useToast();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [volunteers, setVolunteers] = useState([]);

  const load = useCallback(async () => {
    try {
      setVolunteers(await staffApi.volunteers());
    } catch (err) {
      toast.error(apiError(err));
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return toast.error('Name and phone are required.');
    setSaving(true);
    try {
      await staffApi.createVolunteer({
        name: form.name.trim(), email: form.email, phone: form.phone, city: form.city,
        area: form.area, availability: form.availability, skills: form.skills,
        joined: new Date().toISOString().slice(0, 10),
      });
      toast.success('Volunteer registered! Welcome to the sevak family.');
      setForm(empty);
      await load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer Registration"
        subtitle="Welcome sevaks to the temple family"
        breadcrumb={[{ label: 'Staff', to: '/staff' }, { label: 'Volunteers' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Personal Details" subtitle="Tell us about yourself" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" icon={User} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input label="Phone" icon={Phone} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <Input label="Email" icon={Mail} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input label="City" icon={MapPin} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Seva Preferences" />
            <CardBody className="space-y-4">
              <Select label="Preferred Seva Area" options={sevaAreas} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
              <Input label="Availability (days/week)" placeholder="Weekends, evenings…" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
              <Textarea label="Skills / Experience" placeholder="Cooking, decoration, music…" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              <Checkbox label="I am willing to attend pre-event training" defaultChecked />
              <Checkbox label="Receive updates about volunteering opportunities" defaultChecked />
            </CardBody>
          </Card>
          <div className="flex gap-3">
            <Button type="submit" icon={Save} loading={saving}>Register as Volunteer</Button>
            <Button type="button" variant="ghost" icon={X} onClick={() => setForm(empty)}>Clear</Button>
          </div>
        </form>

        <div className="space-y-5">
          <Card className="bg-gradient-to-br from-saffron-500 via-saffron-600 to-maroon-700 text-white overflow-hidden">
            <div className="relative p-6">
              <div className="absolute inset-0 bg-mandala opacity-20" />
              <Heart className="w-7 h-7 mb-3" />
              <h3 className="font-serif text-2xl font-bold">Become a Sevak</h3>
              <p className="text-sm text-white/90 mt-2">Service to the divine is the highest joy. Join 67+ volunteers spreading seva.</p>
              <div className="flex items-center gap-2 mt-4">
                <Users className="w-4 h-4 text-gold-200" />
                <span className="text-sm font-medium">{volunteers.length} active volunteers</span>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Active Volunteers" />
            <CardBody className="p-0">
              <div className="divide-y divide-sand-100 dark:divide-neutral-800 max-h-80 overflow-y-auto">
                {volunteers.length === 0 && <p className="px-5 py-4 text-sm text-neutral-500">No volunteers yet.</p>}
                {volunteers.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar name={v.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{v.name}</p>
                      <p className="text-xs text-neutral-500">{v.area} • {v.hours}h this month</p>
                    </div>
                    <Badge variant="primary">{v.status === 'active' ? 'Active' : v.status}</Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
