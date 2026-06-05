import { Bell, Calendar, Coins, Package, ShieldAlert, MessageSquare, Users } from 'lucide-react';
import Card, { CardHeader, CardBody } from '@components/Card';
import { notifications } from '@data/mockData';

const iconMap = {
  donation: Coins,
  event: Calendar,
  booking: Bell,
  inventory: Package,
  staff: Users,
  message: MessageSquare,
};

const colorMap = {
  donation: 'from-saffron-400 to-saffron-600 text-white',
  event:    'from-gold-400 to-gold-600 text-white',
  booking:  'from-sky-400 to-sky-600 text-white',
  inventory:'from-rose-400 to-rose-600 text-white',
  staff:    'from-violet-400 to-violet-600 text-white',
  message:  'from-emerald-400 to-emerald-600 text-white',
};

export default function NotificationsPanel() {
  return (
    <Card>
      <CardHeader
        title="Notifications"
        subtitle="Latest temple updates"
        action={
          <span className="badge-primary inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-saffron-100 text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-400">
            {notifications.filter((n) => !n.read).length} new
          </span>
        }
      />
      <CardBody className="p-0">
        <div className="divide-y divide-sand-100 dark:divide-neutral-800 max-h-[400px] overflow-y-auto">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || ShieldAlert;
            return (
              <div key={n.id} className={`flex gap-3 px-5 py-3.5 hover:bg-sand-50/50 dark:hover:bg-neutral-800/30 transition-colors ${!n.read ? 'bg-saffron-50/30 dark:bg-saffron-500/5' : ''}`}>
                <div className={`shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center ${colorMap[n.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{n.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{n.message}</p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">{n.time}</p>
                </div>
                {!n.read && <span className="shrink-0 w-2 h-2 rounded-full bg-saffron-500 mt-2" />}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
