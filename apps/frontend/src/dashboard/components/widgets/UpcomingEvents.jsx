import { Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardBody } from '@components/Card';
import Badge from '@components/Badge';

export default function UpcomingEvents({ data = [] }) {
  return (
    <Card>
      <CardHeader
        title="Upcoming Events"
        subtitle="Next divine gatherings"
        action={<Link to="/events" className="text-sm font-medium text-saffron-600 hover:text-saffron-700">See all</Link>}
      />
      <CardBody className="p-0">
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-500">No upcoming events.</p>
        ) : (
        <div className="divide-y divide-sand-100 dark:divide-neutral-800">
          {data.slice(0, 4).map((e) => (
            <div key={e.id} className="flex gap-3 p-4 hover:bg-sand-50/50 dark:hover:bg-neutral-800/30 transition-colors">
              <div className="shrink-0 w-14 text-center">
                <div className="rounded-xl bg-gradient-to-br from-saffron-500 to-maroon-600 text-white py-2">
                  <div className="text-[10px] uppercase tracking-wider font-bold opacity-90">{e.date ? new Date(e.date).toLocaleDateString('en-IN', { month: 'short' }) : '—'}</div>
                  <div className="text-xl font-serif font-bold leading-none">{e.date ? new Date(e.date).getDate() : '—'}</div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h4 className="font-medium text-sm text-neutral-900 dark:text-white truncate">{e.title}</h4>
                  <Badge variant="primary">{e.type}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{e.time || '—'}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location || '—'}</span>
                  <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{e.attendees} expected</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </CardBody>
    </Card>
  );
}
