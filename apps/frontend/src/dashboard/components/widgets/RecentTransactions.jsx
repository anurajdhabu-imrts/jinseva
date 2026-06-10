import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardBody } from '@components/Card';
import Badge from '@components/Badge';
import Avatar from '@components/Avatar';
import { formatCurrency, formatDate, STATUS_COLORS } from '@utils/constants';

export default function RecentTransactions({ data = [] }) {
  return (
    <Card>
      <CardHeader
        title="Recent Donations"
        subtitle="Latest contributions received"
        action={
          <Link to="/donations" className="text-sm font-medium text-saffron-600 hover:text-saffron-700 inline-flex items-center gap-1">
            View all <ArrowUpRight className="w-4 h-4" />
          </Link>
        }
      />
      <CardBody className="p-0">
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-500">No donations yet.</p>
        ) : (
        <div className="divide-y divide-sand-100 dark:divide-neutral-800">
          {data.slice(0, 6).map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-sand-50/50 dark:hover:bg-neutral-800/30 transition-colors">
              <Avatar name={t.donor} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{t.donor}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.type} • {t.method} • {t.date ? formatDate(t.date) : '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold gradient-text">{formatCurrency(t.amount)}</p>
                <Badge variant={STATUS_COLORS[t.status]} className="mt-0.5">{t.status}</Badge>
              </div>
            </div>
          ))}
        </div>
        )}
      </CardBody>
    </Card>
  );
}
