import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Mail, User as UserIcon, Lock, Eye, EyeOff } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import Input, { Select } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { usersApi, rolesApi, apiError } from '@services/rbacService';

const STATUS_OPTIONS = [
  { value: 'active',    label: 'Active'    },
  { value: 'invited',   label: 'Invited'   },
  { value: 'suspended', label: 'Suspended' },
];

export default function UserEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();

  const isNew = !id;
  const [existing, setExisting] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    roleId: '',
    status: 'invited',
    password: '',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const roleList = await rolesApi.list();
        if (cancelled) return;
        setRoles(roleList);

        if (isNew) {
          setForm((f) => ({ ...f, roleId: roleList[0]?.id ?? '' }));
        } else {
          const user = await usersApi.get(id);
          if (cancelled) return;
          setExisting(user);
          setForm({
            name: user.name ?? '',
            email: user.email ?? '',
            roleId: user.roleId ?? roleList[0]?.id ?? '',
            status: user.status ?? 'invited',
            password: '',
          });
        }
      } catch (err) {
        toast.error(apiError(err));
        nav('/settings/users');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew, nav, toast]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    if (isNew && !form.password) {
      toast.error('Set an initial password for the new user.');
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await usersApi.create({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          roleId: form.roleId,
          status: form.status,
        });
      } else {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          roleId: form.roleId,
          status: form.status,
        };
        if (form.password) payload.password = form.password;
        await usersApi.update(id, payload);
      }
      toast.success(isNew ? `User "${form.name}" invited.` : `User "${form.name}" updated.`);
      nav('/settings/users');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-12 text-center text-sm text-neutral-500">Loading…</p>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <PageHeader
        title={isNew ? 'Invite user' : existing?.name}
        subtitle={isNew ? 'Create an account and assign a role.' : 'Update profile and role assignment.'}
        breadcrumb={[
          { label: 'Settings', to: '/settings' },
          { label: 'Users',    to: '/settings/users' },
          { label: isNew ? 'New' : existing?.name },
        ]}
        actions={
          <>
            <Link to="/settings/users">
              <Button variant="secondary" icon={ArrowLeft}>Cancel</Button>
            </Link>
            <Button type="submit" icon={Save} loading={saving}>
              {isNew ? 'Invite user' : 'Save changes'}
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader title="Profile" />
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full name"
            icon={UserIcon}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Pandit Suresh Mehta"
            required
          />
          <Input
            label="Email address"
            icon={Mail}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="user@jinalaya.org"
            required
          />

          <div className="relative">
            <Input
              label={isNew ? 'Initial password' : 'New password (leave blank to keep current)'}
              icon={Lock}
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required={isNew}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={STATUS_OPTIONS}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Role assignment"
          subtitle="Pick one role. The user inherits every permission attached to that role."
        />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map((role) => {
              const checked = form.roleId === role.id;
              return (
                <label
                  key={role.id}
                  className={`flex items-start gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    checked
                      ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-500/10'
                      : 'border-sand-200 dark:border-neutral-800 hover:border-saffron-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={checked}
                    onChange={() => setForm({ ...form, roleId: role.id })}
                    className="mt-1 w-4 h-4 text-saffron-600 focus:ring-saffron-500/40"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="font-medium text-sm">{role.name}</span>
                      {role.system && (
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                          system
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {role.description}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1.5">
                      {(role.permissionIds?.length ?? 0)} permission{(role.permissionIds?.length ?? 0) === 1 ? '' : 's'}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </form>
  );
}
