import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Bell, Globe2 } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea, Switch } from '@components/Input';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import Tabs from '@components/Tabs';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { meApi, apiError } from '@services/rbacService';

function ProfileTab() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return toast.error('Name is required.');
    setSaving(true);
    try {
      await meApi.updateProfile({ name: name.trim() });
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
          <Input label="Full Name" icon={User} value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" icon={Mail} type="email" defaultValue={user?.email} disabled />
          <Input label="Phone" icon={Phone} type="tel" placeholder="+91 …" />
          <Input label="City" icon={MapPin} placeholder="City" />
          <Select label="Gotra" options={['Bharadwaja', 'Vasishtha', 'Kashyapa', 'Atri', 'Gautama', 'Other']} />
          <Input label="Date of Birth" type="date" />
        </div>
        <Textarea label="Bio / About me" placeholder="Share a few words…" />
        <Button icon={Save} loading={saving} onClick={save}>Save Changes</Button>
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
      content: (
        <Card>
          <CardHeader title="Password & Security" />
          <CardBody className="space-y-4">
            <Input label="Current password" icon={Lock} type="password" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="New password" icon={Lock} type="password" />
              <Input label="Confirm new password" icon={Lock} type="password" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-sand-50 dark:bg-neutral-800/50">
              <div>
                <p className="font-medium">Two-factor authentication</p>
                <p className="text-sm text-neutral-500">Receive a code via SMS on every login</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button icon={Save}>Update Password</Button>
          </CardBody>
        </Card>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: Bell,
      content: (
        <Card>
          <CardHeader title="Notification Preferences" />
          <CardBody className="space-y-4">
            {[
              { l: 'Donation receipts via email', d: 'Get receipts delivered to your inbox' },
              { l: 'Event announcements', d: 'Be the first to know about new events' },
              { l: 'Pooja reminders', d: 'Reminders before your scheduled poojas' },
              { l: 'Festival greetings', d: 'Receive personalized festival messages' },
              { l: 'Marketing communications', d: 'Tips, stories, and seva opportunities' },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-sand-50 dark:bg-neutral-800/50">
                <div>
                  <p className="font-medium">{n.l}</p>
                  <p className="text-sm text-neutral-500">{n.d}</p>
                </div>
                <Switch defaultChecked={i < 3} />
              </div>
            ))}
          </CardBody>
        </Card>
      ),
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
