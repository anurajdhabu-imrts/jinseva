import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, CheckCircle2 } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import Avatar from '@components/Avatar';
import Input from '@components/Input';
import Table from '@components/Table';
import { useToast } from '@context/ToastContext';
import { useAuth } from '@context/AuthContext';
import { usersApi, apiError } from '@services/rbacService';

const STATUS_VARIANT = {
  active:    'success',
  invited:   'warning',
  suspended: 'danger',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toISOString().slice(0, 10);
}

export default function Users() {
  const nav = useNavigate();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await usersApi.list());
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users.filter((u) =>
      !term ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role?.name?.toLowerCase().includes(term),
    );
  }, [q, users]);

  const handleDelete = async (row) => {
    if (row.id === currentUser?.id) {
      toast.error('You cannot delete your own account.');
      return;
    }
    if (!window.confirm(`Remove ${row.name}? This cannot be undone.`)) return;
    try {
      await usersApi.remove(row.id);
      toast.success(`User ${row.name} removed.`);
      setUsers((list) => list.filter((u) => u.id !== row.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const handleApprove = async (row) => {
    try {
      const updated = await usersApi.update(row.id, { status: 'active' });
      toast.success(`${row.name} approved — they can now sign in.`);
      setUsers((list) => list.map((u) => (u.id === row.id ? updated : u)));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const pendingCount = useMemo(() => users.filter((u) => u.status === 'invited').length, [users]);

  const columns = [
    {
      key: 'name',
      title: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="sm" />
          <div className="min-w-0">
            <p className="font-medium leading-tight truncate">{row.name}</p>
            <p className="text-xs text-neutral-500 truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      render: (_, row) =>
        row.role ? (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: row.role.color }}
          >
            {row.role.name}
          </span>
        ) : (
          <Badge variant="neutral">—</Badge>
        ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (v) => (
        <Badge variant={STATUS_VARIANT[v] || 'neutral'} dot>
          {v}
        </Badge>
      ),
    },
    { key: 'lastActive', title: 'Last active', render: (v) => formatDate(v) },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (_, row) => (
        <div className="inline-flex gap-1">
          {row.status === 'invited' && (
            <button
              type="button"
              onClick={() => handleApprove(row)}
              title="Approve account"
              className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
          <Link
            to={`/settings/users/${row.id}`}
            className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle={
          pendingCount > 0
            ? `${pendingCount} account${pendingCount === 1 ? '' : 's'} awaiting approval — approve to let them sign in.`
            : 'Invite admins, accountants, sevaks and devotees. Assign each user a role.'
        }
        breadcrumb={[{ label: 'Settings', to: '/settings' }, { label: 'Users' }]}
        actions={
          <Button icon={Plus} onClick={() => nav('/settings/users/new')}>
            Add user
          </Button>
        }
      />

      <Card>
        <CardBody className="!pb-0">
          <Input
            icon={Search}
            placeholder="Search by name, email or role…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </CardBody>
        <CardBody className="!pt-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-neutral-500">Loading users…</p>
          ) : (
            <Table columns={columns} data={rows} rowKey="id" />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
