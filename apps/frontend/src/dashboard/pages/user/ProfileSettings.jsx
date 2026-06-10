import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Globe2 } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea } from '@components/Input';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import Tabs from '@components/Tabs';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { meApi, apiError } from '@services/rbacService';

const GOTRA_OPTIONS = ['', 'Bharadwaja', 'Vasishtha', 'Kashyapa', 'Atri', 'Gautama', 'Other'];

function ProfileTab() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    city: user?.city ?? '',
    gotra: user?.gotra ?? '',
    dob: user?.dob ?? '',
    bio: user?.bio ?? '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) return toast.error('Name is required.');
    setSaving(true);
    try {
      await meApi.updateProfile({
        name: form.name.trim(),
        phone: form.phone,
        city: form.city,
        gotra: form.gotra,
        dob: form.dob || null,
        bio: form.bio,
      });
      await refresh?.();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Personal Information" />
      <CardBody className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={user?.avatar} name={user?.name} size="2xl" ring />
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-saffron-500 text-white flex items-center justify-center shadow-md hover:bg-saffron-600">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="font-serif font-semibold text-lg">{user?.name}</p>
            <p className="text-sm text-neutral-500">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" icon={User} value={form.name} onChange={(e) => set('name', e.target.value)} />
          <Input label="Email" icon={Mail} type="email" defaultValue={user?.email} disabled />
          <Input label="Phone" icon={Phone} type="tel" placeholder="+91 …" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="City" icon={MapPin} placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
          <Select label="Gotra" options={GOTRA_OPTIONS} value={form.gotra} onChange={(e) => set('gotra', e.target.value)} />
          <Input label="Date of Birth" type="date" value={form.dob || ''} onChange={(e) => set('dob', e.target.value)} />
        </div>
        <Textarea label="Bio / About me" placeholder="Share a few words…" value={form.bio} onChange={(e) => set('bio', e.target.value)} />
        <Button icon={Save} loading={saving} onClick={save}>Save Changes</Button>
      </CardBody>
    </Card>
  );
}

function SecurityTab() {
  const { toast } = useToast();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.current || !form.next) return toast.error('Enter your current and new password.');
    if (form.next.length < 6) return toast.error('New password must be at least 6 characters.');
    if (form.next !== form.confirm) return toast.error('New password and confirmation do not match.');
    setSaving(true);
    try {
      const res = await meApi.changePassword(form.current, form.next);
      toast.success(res?.message || 'Password updated.');
      setForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Password & Security" />
      <CardBody className="space-y-4">
        <Input label="Current password" icon={Lock} type="password" value={form.current} onChange={(e) => set('current', e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="New password" icon={Lock} type="password" value={form.next} onChange={(e) => set('next', e.target.value)} />
          <Input label="Confirm new password" icon={Lock} type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} />
        </div>
        <Button icon={Save} loading={saving} onClick={submit}>Update Password</Button>
      </CardBody>
    </Card>
  );
}

export default function ProfileSettings() {
  const tabs = [
    {
      key: 'profile',
      label: 'Profile',
      icon: User,
      content: <ProfileTab />,
    },
    {
      key: 'security',
      label: 'Security',
      icon: Lock,
      content: <SecurityTab />,
    },
    {
      key: 'preferences',
      label: 'Preferences',
      icon: Globe2,
      content: (
        <Card>
          <CardHeader title="Preferences" />
          <CardBody className="space-y-4">
            <Select label="Language" options={['English', 'हिन्दी', 'తెలుగు', 'தமிழ்', 'ಕನ್ನಡ']} />
            <Select label="Currency" options={['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)']} />
            <Select label="Time zone" options={['Asia/Kolkata (IST)', 'America/New_York', 'Europe/London']} />
            <Button icon={Save}>Save Preferences</Button>
          </CardBody>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Account Settings" subtitle="Manage your devotee profile" breadcrumb={[{ label: 'Devotee Portal', to: '/user' }, { label: 'Profile' }]} />
      <Tabs tabs={tabs} variant="underline" />
    </div>
  );
}
