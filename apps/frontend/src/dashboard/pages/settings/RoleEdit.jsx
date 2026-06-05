import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Lock, Shield } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Input, { Textarea } from '@components/Input';
import { useToast } from '@context/ToastContext';
import { rolesApi, apiError } from '@services/rbacService';
import { PERMISSION_GROUPS, SYSTEM_ROLE_ADMIN } from '@data/permissions';

const COLOR_OPTIONS = [
  '#c8102e', '#ffc01e', '#00843d', '#054624', '#1a1b22',
  '#0a2540', '#7c3aed', '#0891b2', '#d97706', '#be185d',
];

export default function RoleEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();

  const isNew = !id;
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Only the Admin role is permission-locked (it must always have every permission).
  const readOnly = existing?.id === SYSTEM_ROLE_ADMIN;

  const [form, setForm] = useState(() => ({
    name: '',
    description: '',
    color: COLOR_OPTIONS[0],
    permissionIds: new Set(),
  }));

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      try {
        const role = await rolesApi.get(id);
        if (cancelled) return;
        setExisting(role);
        setForm({
          name: role.name ?? '',
          description: role.description ?? '',
          color: role.color ?? COLOR_OPTIONS[0],
          permissionIds: new Set(role.permissionIds ?? []),
        });
      } catch (err) {
        toast.error(apiError(err));
        nav('/settings/roles');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew, nav, toast]);

  const totalSelected = form.permissionIds.size;
  const totalAvailable = PERMISSION_GROUPS.reduce((n, g) => n + g.permissions.length, 0);

  const togglePerm = (permId) => {
    if (readOnly) return;
    setForm((f) => {
      const next = new Set(f.permissionIds);
      next.has(permId) ? next.delete(permId) : next.add(permId);
      return { ...f, permissionIds: next };
    });
  };

  const toggleModule = (group, select) => {
    if (readOnly) return;
    setForm((f) => {
      const next = new Set(f.permissionIds);
      group.permissions.forEach((p) => (select ? next.add(p.id) : next.delete(p.id)));
      return { ...f, permissionIds: next };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (readOnly) {
      toast.info('The Admin role always has full access and cannot be modified.');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Role name is required.');
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      permissionIds: [...form.permissionIds],
    };
    setSaving(true);
    try {
      if (isNew) await rolesApi.create(payload);
      else await rolesApi.update(id, payload);
      toast.success(isNew ? `Role "${form.name}" created.` : `Role "${form.name}" updated.`);
      nav('/settings/roles');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-12 text-center text-sm text-neutral-500">Loading role…</p>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <PageHeader
        title={isNew ? 'New role' : existing.name}
        subtitle={
          readOnly
            ? 'Admin is a built-in role with full access — its permissions cannot be changed.'
            : existing?.system
              ? 'Built-in role. Permissions are editable, but the role cannot be deleted.'
              : 'Choose which permissions this role grants.'
        }
        breadcrumb={[
          { label: 'Settings',  to: '/settings' },
          { label: 'Roles',     to: '/settings/roles' },
          { label: isNew ? 'New' : existing.name },
        ]}
        actions={
          <>
            <Link to="/settings/roles">
              <Button variant="secondary" icon={ArrowLeft}>Cancel</Button>
            </Link>
            {!readOnly && (
              <Button type="submit" icon={Save} loading={saving}>
                {isNew ? 'Create role' : 'Save changes'}
              </Button>
            )}
          </>
        }
      />

      {/* ── Basic details ── */}
      <Card>
        <CardHeader title="Role details" subtitle="Name, description and the badge color shown across the dashboard." />
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Role name"
            value={form.name}
            disabled={readOnly}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Trustee, Sevak"
            required
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  disabled={readOnly}
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-9 h-9 rounded-xl ring-2 transition-all ${
                    form.color === c
                      ? 'ring-offset-2 ring-saffron-500 scale-110'
                      : 'ring-transparent hover:scale-105'
                  } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Description"
              value={form.description}
              disabled={readOnly}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What can someone with this role do?"
              rows={2}
            />
          </div>
        </CardBody>
      </Card>

      {/* ── Permission matrix ── */}
      <Card>
        <CardHeader
          title="Permissions"
          subtitle={
            <span className="inline-flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              {totalSelected} of {totalAvailable} selected
              {readOnly && (
                <Badge variant="neutral" className="!py-0.5">
                  <Lock className="w-3 h-3" /> Locked
                </Badge>
              )}
            </span>
          }
        />
        <CardBody className="space-y-6">
          {PERMISSION_GROUPS.map((group) => {
            const selectedInGroup = group.permissions.filter((p) =>
              form.permissionIds.has(p.id),
            ).length;
            const allOn = selectedInGroup === group.permissions.length;
            return (
              <div key={group.module} className="rounded-2xl border border-sand-200 dark:border-neutral-800 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
                      {group.label}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {selectedInGroup} / {group.permissions.length} permissions
                    </p>
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => toggleModule(group, !allOn)}
                      className="text-xs font-medium text-saffron-600 hover:text-saffron-700"
                    >
                      {allOn ? 'Clear all' : 'Select all'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {group.permissions.map((perm) => {
                    const checked = form.permissionIds.has(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          checked
                            ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-500/10'
                            : 'border-sand-200 dark:border-neutral-800 hover:border-saffron-300'
                        } ${readOnly ? 'cursor-not-allowed opacity-70' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={readOnly}
                          onChange={() => togglePerm(perm.id)}
                          className="mt-0.5 w-4 h-4 rounded border-sand-300 text-saffron-600 focus:ring-saffron-500/40"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-tight">
                            {perm.label}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate">
                            {perm.id}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </form>
  );
}
