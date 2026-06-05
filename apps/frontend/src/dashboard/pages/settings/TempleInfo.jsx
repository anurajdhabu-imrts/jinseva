import { Link } from 'react-router-dom';
import { Save, Building2, MapPin, Phone, Mail, Globe, Flame, Camera, Settings as SettingsIcon, UserCog, Users as UsersIcon } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea } from '@components/Input';
import Button from '@components/Button';

const settingsNav = [
  { to: '/settings',       label: 'Temple Info',         icon: SettingsIcon },
  { to: '/settings/users', label: 'Users',                icon: UsersIcon },
  { to: '/settings/roles', label: 'Roles & Permissions', icon: UserCog },
];

export default function TempleInfo() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Configure your temple management system"
        breadcrumb={[{ label: 'Settings' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          {settingsNav.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                i === 0
                  ? 'bg-gradient-to-r from-saffron-500/10 to-transparent text-saffron-700 dark:text-saffron-400 border-l-2 border-saffron-500'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-sand-100 dark:hover:bg-neutral-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-5">
          <Card>
            <CardHeader title="Temple Branding" subtitle="The face of your sacred space" />
            <CardBody className="space-y-5">
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-saffron-500 to-maroon-600 flex items-center justify-center shadow-glow">
                  <Flame className="w-12 h-12 text-white" />
                </div>
                <div>
                  <p className="font-serif font-semibold text-lg">Shree Mahavir Jain Derasar</p>
                  <p className="text-sm text-neutral-500">Upload logo • 200×200 recommended</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="secondary" size="sm" icon={Camera}>Upload Logo</Button>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Basic Information" />
            <CardBody className="space-y-4">
              <Input label="Temple Name" icon={Building2} defaultValue="Shree Mahavir Jain Derasar" />
              <Textarea label="About the derasar" rows={3} defaultValue="A century-old shwetambar Jain derasar dedicated to the 24 Tirthankars, serving the community through daily poojas, mahaparvas and sadharmik seva." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Founded Year" defaultValue="1924" />
                <Select label="Mool Nayak" options={['Shree Adinath', 'Shree Mahavir Swami', 'Shree Parshvanath', 'Shree Neminath', 'Shree Shantinath']} defaultValue="Shree Adinath" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Contact & Address" />
            <CardBody className="space-y-4">
              <Textarea label="Full address" icon={MapPin} rows={2} defaultValue="123 Temple Road, Vrindavan, Uttar Pradesh — 281121" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Primary phone" icon={Phone} defaultValue="+91 98765-12345" />
                <Input label="Email" icon={Mail} type="email" defaultValue="info@krishnamandir.org" />
              </div>
              <Input label="Website" icon={Globe} defaultValue="www.krishnamandir.org" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Operating Hours" />
            <CardBody className="space-y-3">
              {['Mangal Aarti', 'Pratahkal Snatra', 'Ashta Prakari Pooja', 'Rajbhog Aarti', 'Sandhya Aarti'].map((aarti) => (
                <div key={aarti} className="grid grid-cols-3 gap-3 items-center">
                  <span className="text-sm font-medium">{aarti}</span>
                  <Input type="time" defaultValue="06:00" />
                  <Input type="time" defaultValue="07:00" />
                </div>
              ))}
            </CardBody>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="ghost">Discard</Button>
            <Button icon={Save}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
