import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Mail, MessageCircle } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Modal from '@components/Modal';
import Input, { Select, Textarea } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { communicationApi, apiError } from '@services/rbacService';
import { formatDate } from '@utils/constants';

const TYPES = ['Email', 'WhatsApp'];
const empty = { name: '', type: 'Email', subject: '', body: '' };

export default function Templates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(empty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTemplates(await communicationApi.templates());
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, type: t.type, subject: t.subject || '', body: t.body || '' }); setModal(true); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Template name is required.');
    setSaving(true);
    try {
      if (editing) await communicationApi.updateTemplate(editing.id, form);
      else await communicationApi.createTemplate(form);
      toast.success(editing ? 'Template updated.' : 'Template created.');
      setModal(false);
      await load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (t) => {
    if (!window.confirm(`Delete template "${t.name}"?`)) return;
    try {
      await communicationApi.removeTemplate(t.id);
      toast.success('Template deleted.');
      setTemplates((list) => list.filter((x) => x.id !== t.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Message Templates"
        subtitle="Reusable email & SMS templates"
        breadcrumb={[{ label: 'Communication', to: '/communication' }, { label: 'Templates' }]}
        actions={<Button icon={Plus} onClick={openNew}>New Template</Button>}
      />

      {loading && <p className="py-6 text-center text-sm text-neutral-500">Loading templates…</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <Card key={t.id} hover>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${t.type === 'Email' ? 'bg-gradient-to-br from-saffron-500 to-maroon-600' : 'bg-gradient-to-br from-jain-green-500 to-jain-green-700'}`}>
                  {t.type === 'Email' ? <Mail className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                </div>
                <Badge variant={t.type === 'Email' ? 'primary' : 'success'}>{t.type}</Badge>
              </div>
              <h3 className="font-serif font-semibold mt-4 text-neutral-900 dark:text-white">{t.name}</h3>
              <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{t.subject || '—'}</p>
              <div className="mt-4 pt-3 border-t border-sand-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                <span>Used {(t.usageCount || 0).toLocaleString('en-IN')}×</span>
                <span>{t.lastUsed ? `Last: ${formatDate(t.lastUsed)}` : 'Never used'}</span>
              </div>
              <div className="mt-4 flex gap-1">
                <Button variant="secondary" size="sm" icon={Edit} fullWidth onClick={() => openEdit(t)}>Edit</Button>
                <Button variant="ghost" size="sm" className="px-2.5 text-rose-600" onClick={() => remove(t)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit template' : 'New template'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Select label="Type" options={TYPES} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          </div>
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject line" />
          <Textarea label="Body" rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Message body…" />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
