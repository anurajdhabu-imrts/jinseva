import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Calendar, BadgeCheck, ArrowRight } from 'lucide-react';
import Card, { CardBody, CardHeader } from '@components/Card';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import { formatCurrency, formatDate } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import { meApi, apiError } from '@services/rbacService';
import { useToast } from '@context/ToastContext';

const quickActions = [
  { label: 'My Donations', icon: Heart, to: '/user/donations', color: 'from-saffron-500 to-maroon-600' },
  { label: 'Book Pooja Hall', icon: BookOpen, to: '/bookings/new', color: 'from-gold-400 to-saffron-600' },
  { label: 'My Card', icon: BadgeCheck, to: '/user/membership', color: 'from-jain-green-500 to-jain-green-700' },
  { label: 'Event Details', icon: Calendar, to: '/events', color: 'from-jain-black-700 to-jain-black-900' },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await meApi.summary();
        if (!cancelled) setSummary(s);
      } catch (err) {
        toast.error(apiError(err));
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  const recentDonations = summary?.recentDonations ?? [];
  const recentBookings = summary?.recentBookings ?? [];
  const memberYear = summary?.memberSince ? new Date(summary.memberSince).getFullYear() : null;

  return (
    <div className="space-y-6">
      {/* Personal greeting */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-saffron-500 via-saffron-600 to-maroon-700 p-6 md:p-8 text-white">
          <div className="absolute inset-0 bg-mandala opacity-25" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-5">
            <Avatar src={user?.avatar} name={user?.name} size="2xl" ring />
            <div className="flex-1">
              <p className="text-sm opacity-90">Jai Jinendra 🙏</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold">{user?.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="gold" className="bg-gold-300 text-gold-900">{user?.roleName || 'Devotee'}</Badge>
                {memberYear && <Badge className="bg-white/20 text-white">Member since {memberYear}</Badge>}
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs uppercase tracking-wider opacity-75">Lifetime Contribution</p>
              <p className="font-serif text-3xl font-bold text-gold-200">{formatCurrency(summary?.lifetimeDonations ?? 0)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((qa) => (
          <Link key={qa.label} to={qa.to}>
            <Card hover className="p-5 cursor-pointer group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${qa.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                <qa.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-neutral-900 dark:text-white">{qa.label}</h3>
              <p className="text-xs text-neutral-500 mt-1 inline-flex items-center gap-1">
                Go now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Recent Donations" action={<Link to="/user/donations" className="text-sm text-saffron-600 font-medium">View all</Link>} />
          <CardBody className="p-0">
            <div className="divide-y divide-sand-100 dark:divide-neutral-800">
              {recentDonations.length === 0 && <p className="px-5 py-6 text-sm text-neutral-500">No donations yet.</p>}
              {recentDonations.map((d) => (
                <div key={d.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-100 to-gold-100 dark:from-saffron-500/20 dark:to-gold-500/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-saffron-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{d.type}</p>
                    <p className="text-xs text-neutral-500">{d.date ? formatDate(d.date) : '—'}</p>
                  </div>
                  <p className="font-semibold gradient-text">{formatCurrency(d.amount)}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="My Bookings" action={<Link to="/user/bookings" className="text-sm text-saffron-600 font-medium">View all</Link>} />
          <CardBody className="p-0">
            <div className="divide-y divide-sand-100 dark:divide-neutral-800">
              {recentBookings.length === 0 && <p className="px-5 py-6 text-sm text-neutral-500">No bookings yet.</p>}
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-saffron-100 dark:from-violet-500/20 dark:to-saffron-500/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{b.pooja}</p>
                    <p className="text-xs text-neutral-500">{b.date ? formatDate(b.date) : '—'} • {b.time}</p>
                  </div>
                  <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'} dot>{b.status}</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

    </div>
  );
}
