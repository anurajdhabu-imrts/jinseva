import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Calendar, Clock, IndianRupee, FileText, CheckCircle2, XCircle, Printer } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Badge from '@components/Badge';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import { useToast } from '@context/ToastContext';
import { bookingsApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate, STATUS_COLORS } from '@utils/constants';

export default function BookingDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const b = await bookingsApi.get(id);
        if (!cancelled) setBooking(b);
      } catch (err) {
        toast.error(apiError(err));
        nav('/bookings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, nav, toast]);

  const setStatus = async (status) => {
    try {
      setBooking(await bookingsApi.update(id, { status }));
      toast.success(`Booking ${status}.`);
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading booking…</p>;
  if (!booking) return null;

  return (
    <div className="space-y-6">
      <Link to="/bookings" className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to bookings
      </Link>

      <PageHeader
        title={`Booking ${booking.id}`}
        subtitle={booking.pooja}
        actions={
          <>
            <Button variant="secondary" icon={Printer}>Print</Button>
            {booking.status !== 'cancelled' && (
              <Button variant="danger" icon={XCircle} onClick={() => setStatus('cancelled')}>Cancel</Button>
            )}
            {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
              <Button icon={CheckCircle2} onClick={() => setStatus('confirmed')}>Confirm</Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Booking Details" action={<Badge variant={STATUS_COLORS[booking.status]}>{booking.status}</Badge>} />
          <CardBody className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={booking.devotee} size="xl" />
              <div>
                <p className="font-serif text-xl font-semibold">{booking.devotee}</p>
                <p className="text-sm text-neutral-500 inline-flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5" />{booking.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-sand-100 dark:border-neutral-800">
              {[
                { l: 'Pooja Type', v: booking.pooja, i: FileText },
                { l: 'Date', v: formatDate(booking.date), i: Calendar },
                { l: 'Time', v: booking.time, i: Clock },
                { l: 'Priest Assigned', v: booking.priest, i: User },
              ].map((d) => (
                <div key={d.l} className="p-4 rounded-xl bg-sand-50 dark:bg-neutral-800/50">
                  <p className="text-neutral-500 text-xs inline-flex items-center gap-1.5"><d.i className="w-3.5 h-3.5" />{d.l}</p>
                  <p className="font-medium text-neutral-900 dark:text-white mt-1">{d.v}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">Sankalp / Notes</h4>
              <p className="text-neutral-700 dark:text-neutral-300">{booking.notes || 'No special instructions.'}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Payment" />
          <CardBody className="space-y-3">
            <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-saffron-50 to-gold-50 dark:from-saffron-500/10 dark:to-gold-500/10">
              <IndianRupee className="w-8 h-8 mx-auto text-saffron-600 mb-2" />
              <p className="text-xs uppercase text-neutral-500">Booking Fee</p>
              <p className="text-3xl font-serif font-bold gradient-text mt-1">{formatCurrency(booking.amount)}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Pooja Cost</span><span>{formatCurrency(booking.amount * 0.8)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Materials</span><span>{formatCurrency(booking.amount * 0.15)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Service Fee</span><span>{formatCurrency(booking.amount * 0.05)}</span></div>
              <div className="flex justify-between font-semibold pt-2 border-t border-sand-100 dark:border-neutral-800"><span>Total</span><span>{formatCurrency(booking.amount)}</span></div>
            </div>
            <Button fullWidth>Send Receipt</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
