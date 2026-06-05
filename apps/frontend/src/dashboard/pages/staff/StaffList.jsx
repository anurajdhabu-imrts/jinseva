import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, UserCheck, UserX, Phone, Mail, Trash2 } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import SearchBar from '@components/SearchBar';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import Avatar from '@components/Avatar';
import Modal from '@components/Modal';
import Input, { Select } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { staffApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate } from '@utils/constants';

const DEPARTMENTS = ['Religious', 'Operations', 'Security', 'Admin', 'Maintenance'];
const empty = { name: '', role: '', department: DEPARTMENTS[0], phone: '', email: '', salary: '', joinDate: new Date().toISOString().slice(0, 10), status: 'active' };

export default function StaffList() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [staff, setStaff] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [present, setPresent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(empty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, v, att] = await Promise.all([staffApi.list(), staffApi.volunteers(), staffApi.attendance()]);
      setStaff(s);
      setVolunteers(v);
      setPresent(att.summary?.present ?? null);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(
    () => staff.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.role || '').toLowerCase().includes(search.toLowerCase())),
    [staff, search],
  );
  const onLeave = useMemo(() => staff.filter((s) => s.status === 'leave').length, [staff]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required.');
    setSaving(true);
    try {
      await staffApi.create({ ...form, salary: Number(form.salary) || 0 });
      toast.success('Staff member added.');
      setModal(false);
      setForm(empty);
      await load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Remove ${s.name}?`)) return;
    try {
      await staffApi.remove(s.id);
      toast.success(`${s.name} removed.`);
      setStaff((list) => list.filter((x) => x.id !== s.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Volunteers"
        subtitle="Manage temple team & sevaks"
        breadcrumb={[{ label: 'Staff' }]}
        actions={
          <>
            <Link to="/staff/attendance"><Button variant="secondary">Attendance</Button></Link>
            <Link to="/staff/volunteers"><Button variant="secondary">Volunteers</Button></Link>
            <Button icon={Plus} onClick={() => { setForm(empty); setModal(true); }}>Add Staff</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Users} label="Total Staff" value={String(staff.length)} tone="primary" />
        <StatsCard icon={UserCheck} label="Present Today" value={present === null ? '—' : String(present)} tone="emerald" />
        <StatsCard icon={UserX} label="On Leave" value={String(onLeave)} tone="rose" />
        <StatsCard icon={Users} label="Active Volunteers" value={String(volunteers.length)} tone="violet" />
      </div>

      <Card>
        <CardBody>
          <SearchBar value={search} onChange={setSearch} placeholder="Search staff by name or role…" className="max-w-md" />
        </CardBody>
      </Card>

      {loading && <p className="py-6 text-center text-sm text-neutral-500">Loading staff…</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((s) => (
          <Card key={s.id} hover className="overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-saffron-500 via-saffron-600 to-maroon-600 bg-mandala" />
            <CardBody className="-mt-10 pt-0 relative">
              <div className="flex items-start justify-between">
                <Avatar src={s.avatar} name={s.name} size="xl" ring />
                <button onClick={() => remove(s)} className="mt-12 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="mt-3">
                <Link to={`/staff/${s.id}`} className="font-serif font-semibold text-lg text-neutral-900 dark:text-white hover:text-saffron-600">{s.name}</Link>
                <p className="text-sm text-neutral-500">{s.role}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="primary">{s.department}</Badge>
                <Badge variant={s.status === 'active' ? 'success' : 'warning'} dot>{s.status}</Badge>
              </div>
              <div className="mt-3 space-y-1 text-xs text-neutral-500">
                {s.phone && <p className="inline-flex items-center gap-1.5"><Phone className="w-3 h-3" />{s.phone}</p>}
                {s.email && <p className="inline-flex items-center gap-1.5"><Mail className="w-3 h-3" />{s.email}</p>}
              </div>
              <div className="mt-3 pt-3 border-t border-sand-100 dark:border-neutral-800 flex justify-between text-xs">
                <span className="text-neutral-500">Joined {s.joinDate ? formatDate(s.joinDate) : '—'}</span>
                <span className="font-semibold text-saffron-600">{formatCurrency(s.salary)}/mo</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add staff member">
        <form onSubmit={submit} className="space-y-4">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Head Pujari" />
            <Select label="Department" options={DEPARTMENTS} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Monthly salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            <Input label="Join date" type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Add Staff</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
