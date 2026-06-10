import { useState, useEffect, useCallback } from 'react';
import { Megaphone, Send, Users, Mail, MessageCircle, Eye, Calendar } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Input, { Select, Textarea, Checkbox } from '@components/Input';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Table from '@components/Table';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import ImageUpload from '@dashboard/components/widgets/ImageUpload';
import { formatDate, onImgError } from '@utils/constants';
import { useToast } from '@context/ToastContext';
import { useAuth } from '@context/AuthContext';
import { communicationApi, resolveMedia, apiError } from '@services/rbacService';

const audiences = ['All Devotees', 'Platinum Members', 'Gold Members', 'Donors', 'Volunteers', 'Staff'];

export default function Announcement() {
  const [form, setForm] = useState({ title: '', message: '', audience: audiences[0], image: '', channels: { email: true, whatsapp: false } });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [meta, setMeta] = useState({ totalSent: 0, openRate: 0 });
  const { toast } = useToast();
  const { user } = useAuth();

  const sendTest = async () => {
    const to = window.prompt('Send a test email to:', user?.email || '');
    if (!to) return;
    setTesting(true);
    try {
      const res = await communicationApi.testEmail(to.trim());
      toast.success(res?.message || `Test email sent to ${to}`);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setTesting(false);
    }
  };

  const load = useCallback(async () => {
    try {
      const res = await communicationApi.announcements();
      setAnnouncements(res.data || []);
      setMeta({ totalSent: res.totalSent || 0, openRate: res.openRate || 0 });
    } catch (err) {
      toast.error(apiError(err));
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'audience', title: 'Audience', render: (v) => <Badge variant="primary">{v}</Badge> },
    { key: 'channel', title: 'Channel', render: (v) => <span className="text-sm">{v}</span> },
    { key: 'sent', title: 'Sent', align: 'right', render: (v) => v.toLocaleString('en-IN') },
    { key: 'opens', title: 'Opens', align: 'right', render: (v, row) => (
      <div className="text-right">
        <div className="font-semibold">{v.toLocaleString('en-IN')}</div>
        <div className="text-xs text-emerald-600">{row.sent > 0 ? Math.round((v / row.sent) * 100) : 0}%</div>
      </div>
    )},
    { key: 'date', title: 'Date', render: (v) => formatDate(v) },
    { key: 'status', title: 'Status', render: (v) => <Badge variant={v === 'sent' ? 'success' : 'warning'} dot>{v}</Badge> },
  ];

  const channelLabel = () => {
    const c = form.channels;
    return [c.email && 'Email', c.whatsapp && 'WhatsApp'].filter(Boolean).join(' + ') || 'Email';
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return toast.error('Title and message are required.');
    setSaving(true);
    try {
      const res = await communicationApi.createAnnouncement({
        title: form.title.trim(),
        message: form.message.trim(),
        audience: form.audience,
        channel: channelLabel(),
        image: form.image,
        status: 'sent',
      });
      if (res?.note) toast.info ? toast.info(res.note) : toast.success(res.note);
      else toast.success(`Sent to ${form.audience}${res?.emailed ? ` — emailed ${res.emailed} recipient(s)` : ''}.`);
      setForm({ title: '', message: '', audience: audiences[0], image: '', channels: { email: true, whatsapp: false } });
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
        title="Communication Hub"
        subtitle="Send announcements & engage with devotees"
        breadcrumb={[{ label: 'Communication' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Megaphone} label="Total Sent" value={meta.totalSent.toLocaleString('en-IN')} tone="primary" />
        <StatsCard icon={Mail} label="Open Rate" value={`${meta.openRate}%`} tone="emerald" />
        <StatsCard icon={Megaphone} label="Announcements" value={String(announcements.length)} tone="gold" />
        <StatsCard icon={Users} label="Audiences" value={String(new Set(announcements.map((a) => a.audience)).size)} tone="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Compose Announcement" subtitle="Reach devotees instantly" />
            <CardBody className="space-y-4">
              <Input label="Title" placeholder="e.g., Special Mahashivaratri Pooja Schedule" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Textarea label="Message" rows={6} placeholder="Share details with devotees…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              <ImageUpload label="Image (optional)" value={form.image} onChange={(url) => setForm({ ...form, image: url })} hint="Attach a banner/poster — PNG, JPG, WebP" />
              </div>
              <Select label="Audience" icon={Users} options={audiences} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} />

              <div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Channels</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { k: 'email',    l: 'Email',    i: Mail,          c: 'from-saffron-400 to-saffron-600' },
                    { k: 'whatsapp', l: 'WhatsApp', i: MessageCircle, c: 'from-jain-green-500 to-jain-green-700' },
                  ].map((ch) => (
                    <label key={ch.k} className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                      form.channels[ch.k]
                        ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-500/10'
                        : 'border-sand-200 dark:border-neutral-700 hover:border-saffron-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={form.channels[ch.k]}
                        onChange={(e) => setForm({ ...form, channels: { ...form.channels, [ch.k]: e.target.checked } })}
                        className="sr-only"
                      />
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${ch.c} flex items-center justify-center text-white`}>
                        <ch.i className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">{ch.l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Checkbox label="Schedule for later" />
            </CardBody>
          </Card>
          <div className="flex gap-3">
            <Button type="submit" icon={Send} loading={saving}>Send Now</Button>
            <Button type="button" variant="secondary" icon={Mail} loading={testing} onClick={sendTest}>Send test email</Button>
            <Button type="button" variant="ghost" icon={Eye}>Preview</Button>
          </div>
        </form>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Live preview" />
            <CardBody>
              <div className="rounded-xl bg-sand-50 dark:bg-neutral-800/50 p-4 border-l-4 border-saffron-500">
                <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700">{form.audience}</p>
                <p className="font-serif font-semibold mt-2">{form.title || 'Announcement title'}</p>
                {form.image && (
                  <img src={resolveMedia(form.image)} onError={onImgError} alt="Announcement" className="w-full h-36 object-cover rounded-lg mt-3" />
                )}
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">{form.message || 'Your message will appear here…'}</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Templates" />
            <CardBody className="space-y-2">
              {['Donation Thank You', 'Event Invitation', 'Festival Greeting', 'Pooja Reminder'].map((t) => (
                <button key={t} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-sand-50 dark:hover:bg-neutral-800/50 transition">
                  📜 {t}
                </button>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Recent Announcements" />
        <CardBody className="p-0">
          <Table columns={columns} data={announcements} rowKey="id" className="border-0 rounded-none" />
        </CardBody>
      </Card>
    </div>
  );
}
