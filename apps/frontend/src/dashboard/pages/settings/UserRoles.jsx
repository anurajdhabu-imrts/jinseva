import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Shield, Edit, Trash2, Lock, Users } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import { useToast } from '@context/ToastContext';
import { rolesApi, apiError } from '@services/rbacService';

export default function UserRoles() {
  const nav = useNavigate();
  const { toast } = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRoles(await rolesApi.list());
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (role) => {
    if (role.system) {
      toast.error(`The ${role.name} role is a system role and cannot be deleted.`);
      return;
    }
    if (!window.confirm(`Delete the ${role.name} role?`)) return;
    try {
      await rolesApi.remove(role.id);
      toast.success(`${role.name} role removed.`);
      setRoles((list) => list.filter((r) => r.id !== role.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & permissions"
        subtitle="Admin and Devotee are built-in. Create custom roles for staff and volunteers."
        breadcrumb={[{ label: 'Settings', to: '/settings' }, { label: 'Roles' }]}
        actions={
          <Button icon={Plus} onClick={() => nav('/settings/roles/new')}>
            Add role
          </Button>
        }
      />

      {loading && (
        <p className="py-8 text-center text-sm text-neutral-500">Loading roles…</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const userCount = role.userCount ?? 0;
          return (
            <Card key={role.id} hover className="overflow-hidden">
              <div className="h-2" style={{ backgroundColor: role.color }} />
              <CardBody>
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: role.color }}
                  >
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-semibold text-base leading-tight">
                        {role.name}
                      </h3>
                      {role.system && (
                        <Badge variant="neutral" className="!py-0.5">
                          <Lock className="w-3 h-3" /> System
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">
                      {role.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {userCount} {userCount === 1 ? 'user' : 'users'}
                  </span>
                  <span>
                    {role.permissionIds.length} permission
                    {role.permissionIds.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Link to={`/settings/roles/${role.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" icon={Edit} fullWidth>
                      {role.system ? 'View' : 'Edit'}
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(role)}
                    disabled={role.system}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={role.system ? 'System role — cannot delete' : 'Delete role'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
