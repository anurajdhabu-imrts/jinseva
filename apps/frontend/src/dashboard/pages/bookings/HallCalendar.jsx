import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Badge from '@components/Badge';
import { useToast } from '@context/ToastContext';
import { bookingsApi, apiError } from '@services/rbacService';
import { cn } from '@utils/cn';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function HallCalendar() {
  const { toast } = useToast();
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { month: d.getMonth(), year: d.getFullYear() }; });
  const [bookings, setBookings] = useState([]);

  const load = useCallback(async () => {
    try {
      setBookings(await bookingsApi.list());
    } catch (err) {
      toast.error(apiError(err));
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const { month, year } = cursor;
  const realToday = new Date();
  const isCurrentMonth = realToday.getMonth() === month && realToday.getFullYear() === year;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCursor((c) => { const m = c.month - 1; return m < 0 ? { month: 11, year: c.year - 1 } : { month: m, year: c.year }; });
  const nextMonth = () => setCursor((c) => { const m = c.month + 1; return m > 11 ? { month: 0, year: c.year + 1 } : { month: m, year: c.year }; });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayBookings = bookings.filter((b) => b.date === dateStr);
    days.push({ date: d, bookings: dayBookings, isToday: isCurrentMonth && d === realToday.getDate() });
  }

  const colorByPooja = (p) =>
    p?.includes('Marriage')
      ? 'bg-rose-500'
      : p?.includes('Homam')
      ? 'bg-saffron-500'
      : p?.includes('Pooja')
      ? 'bg-emerald-500'
      : 'bg-sky-500';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hall Booking Calendar"
        subtitle="View and manage facility reservations"
        breadcrumb={[{ label: 'Bookings', to: '/bookings' }, { label: 'Calendar' }]}
        actions={<Link to="/bookings/new"><Button icon={Plus}>New Booking</Button></Link>}
      />

      <Card>
        <div className="px-5 py-4 border-b border-sand-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800"><ChevronLeft className="w-4 h-4" /></button>
            <h2 className="font-serif font-semibold text-lg">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <CardBody className="p-0">
          <div className="grid grid-cols-7 border-b border-sand-100 dark:border-neutral-800">
            {dayLabels.map((d) => (
              <div key={d} className="px-3 py-3 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((d, i) => (
              <div key={i} className={cn(
                'min-h-[110px] border-b border-r border-sand-100 dark:border-neutral-800 p-2 hover:bg-sand-50/40 dark:hover:bg-neutral-800/30 transition-colors',
                d?.isToday && 'bg-saffron-50/60 dark:bg-saffron-500/5'
              )}>
                {d && (
                  <>
                    <div className={cn(
                      'inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold',
                      d.isToday ? 'bg-gradient-to-br from-saffron-500 to-maroon-600 text-white' : 'text-neutral-700 dark:text-neutral-300'
                    )}>
                      {d.date}
                    </div>
                    <div className="mt-1 space-y-1">
                      {d.bookings.slice(0, 2).map((b) => (
                        <div key={b.id} className={cn('text-[10px] px-1.5 py-0.5 rounded text-white truncate font-medium cursor-pointer', colorByPooja(b.pooja))}>
                          {b.time} {b.pooja}
                        </div>
                      ))}
                      {d.bookings.length > 2 && (
                        <div className="text-[10px] text-neutral-500 pl-1">+{d.bookings.length - 2} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Timeline */}
      <Card>
        <div className="px-5 py-4 border-b border-sand-100 dark:border-neutral-800">
          <h3 className="font-serif font-semibold text-lg">Upcoming Bookings</h3>
          <p className="text-xs text-neutral-500">{bookings.length} total</p>
        </div>
        <CardBody>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-sand-200 dark:bg-neutral-800" />
            <div className="space-y-4">
              {[...bookings].sort((a, b) => (a.date || '').localeCompare(b.date || '')).slice(0, 6).map((b) => (
                <div key={b.id} className="relative pl-12">
                  <span className={cn('absolute left-2.5 top-1 w-3 h-3 rounded-full ring-4 ring-white dark:ring-neutral-900', colorByPooja(b.pooja))} />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{b.pooja}</p>
                      <p className="text-xs text-neutral-500">{b.devotee} • {b.priest}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-saffron-600">{b.time}</p>
                      <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'} className="mt-1">{b.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
