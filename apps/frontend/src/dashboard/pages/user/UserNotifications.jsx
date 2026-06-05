import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle2, Trash2, Calendar, Coins, Package, MessageSquare, Users } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Tabs from '@components/Tabs';
import { useToast } from '@context/ToastContext';
import { useAuth } from '@context/AuthContext';
import { communicationApi, meApi, apiError } from '@services/rbacService';
import { cn } from '@utils/cn';

const iconMap = {
  donation: Coins, event: Calendar, booking: Bell, inventory: Package, staff: Users, message: MessageSquare,
};

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function UserNotifications() {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  // Admins manage the shared feed; devotees just read it.
  const isManager = hasPermission('communication.view') || hasPermission('admin.users');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = isManager ? await communicationApi.notifications() : await meApi.notifications();
      setItems(res.data || []);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [isManager, toast]);

  useEffect(() => { load(); }, [load]);

  const markAllRead = async () => {
    try {
      await communicationApi.markAllRead();
      setItems((i) => i.map((x) => ({ ...x, read: true })));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const markRead = async (n) => {
    if (n.read) return;
    try {
      await communicationApi.markRead(n.id);
      setItems((i) => i.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    } catch { /* read marking is best-effort for devotees */ }
  };

  const remove = async (n) => {
    try {
      await communicationApi.removeNotification(n.id);
      setItems((i) => i.filter((x) => x.id !== n.id));
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const renderList = (list) => (
    <Card>
      <CardBody className="p-0">
        {list.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-500">No notifications.</p>
        ) : (
          <div className="divide-y divide-sand-100 dark:divide-neutral-800">
            {list.map((n) => {
              const Icon = iconMap[n.type] || Bell;
              return (
                <div key={n.id} onClick={() => markRead(n)} className={cn(
                  'flex items-start gap-4 p-5 hover:bg-sand-50/50 dark:hover:bg-neutral-800/30 cursor-pointer',
                  !n.read && 'bg-saffron-50/30 dark:bg-saffron-500/5'
                )}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-maroon-600 text-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <p className="font-medium text-neutral-900 dark:text-white">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-saffron-500 mt-1.5" />}
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-neutral-400 mt-1.5">{timeAgo(n.createdAt)}</p>
                  </div>
                  {isManager && (
                    <button onClick={(e) => { e.stopPropagation(); remove(n); }} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );

  const unread = items.filter((i) => !i.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={loading ? 'Loading…' : `${unread} unread messages`}
        breadcrumb={[{ label: 'Devotee Portal', to: '/user' }, { label: 'Notifications' }]}
        actions={<Button variant="secondary" icon={CheckCircle2} onClick={markAllRead}>Mark all read</Button>}
      />
      <Tabs
        variant="pills"
        tabs={[
          { key: 'all', label: 'All', count: items.length, content: renderList(items) },
          { key: 'unread', label: 'Unread', count: unread, content: renderList(items.filter((i) => !i.read)) },
          { key: 'events', label: 'Events', content: renderList(items.filter((i) => i.type === 'event')) },
          { key: 'donations', label: 'Donations', content: renderList(items.filter((i) => i.type === 'donation')) },
        ]}
      />
    </div>
  );
}
