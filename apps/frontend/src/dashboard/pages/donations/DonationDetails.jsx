import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, IndianRupee, Receipt, Calendar, CreditCard, Download, Share2, Printer } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Badge from '@components/Badge';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import { useToast } from '@context/ToastContext';
import { donationsApi, apiError } from '@services/rbacService';
import { formatCurrency, formatDate, STATUS_COLORS } from '@utils/constants';

export default function DonationDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await donationsApi.get(id);
        if (!cancelled) setDonation(d);
      } catch (err) {
        toast.error(apiError(err));
        nav('/donations');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, nav, toast]);

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading donation…</p>;
  if (!donation) return null;

  return (
    <div className="space-y-6">
      <Link to="/donations" className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to donations
      </Link>

      <PageHeader
        title={`Donation ${donation.id}`}
        subtitle={`Received on ${formatDate(donation.date)}`}
        actions={
          <>
            <Button variant="secondary" icon={Printer}>Print</Button>
            <Button variant="secondary" icon={Share2}>Share</Button>
            <Link to={`/donations/receipt/${donation.id}`}><Button icon={Receipt}>View Receipt</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Donation Information" />
          <CardBody className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={donation.donor} size="xl" />
              <div className="flex-1">
                <Link to={`/donations/donor/${donation.id}`} className="font-serif font-semibold text-xl text-neutral-900 dark:text-white hover:text-saffron-600">
                  {donation.anonymous ? 'Anonymous Devotee' : donation.donor}
                </Link>
                {!donation.anonymous && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-neutral-500">
                    <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{donation.email}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{donation.phone}</span>
                  </div>
                )}
              </div>
              <Badge variant={STATUS_COLORS[donation.status]}>{donation.status}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-sand-100 dark:border-neutral-800">
              {[
                { l: 'Purpose', v: donation.type, i: Receipt },
                { l: 'Amount', v: formatCurrency(donation.amount), i: IndianRupee, highlight: true },
                { l: 'Payment Method', v: donation.method, i: CreditCard },
                { l: 'Date & Time', v: formatDate(donation.date) + ' • 10:30 AM', i: Calendar },
              ].map((d) => (
                <div key={d.l} className="p-4 rounded-xl bg-sand-50 dark:bg-neutral-800/50">
                  <div className="flex items-center gap-2 text-neutral-500 text-xs mb-1">
                    <d.i className="w-3.5 h-3.5" /> {d.l}
                  </div>
                  <p className={d.highlight ? 'text-xl font-serif font-bold gradient-text' : 'font-medium text-neutral-900 dark:text-white'}>{d.v}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">Notes / Special Purpose</h4>
              <p className="text-neutral-700 dark:text-neutral-300">{donation.purpose}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Receipt Details" />
          <CardBody className="space-y-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-saffron-50 to-gold-50 dark:from-saffron-500/10 dark:to-gold-500/10">
              <Receipt className="w-10 h-10 mx-auto text-saffron-600 mb-2" />
              <p className="text-xs uppercase tracking-wider text-neutral-500">Receipt Number</p>
              <p className="font-serif font-bold text-xl text-neutral-900 dark:text-white">{donation.receipt}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Issued on</span><span className="font-medium">{formatDate(donation.date)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">80G eligible</span><Badge variant="success">Yes</Badge></div>
              <div className="flex justify-between"><span className="text-neutral-500">PAN linked</span><Badge variant="success">Verified</Badge></div>
            </div>

            <div className="space-y-2 pt-3 border-t border-sand-100 dark:border-neutral-800">
              <Button fullWidth icon={Download}>Download Receipt</Button>
              <Button variant="secondary" fullWidth icon={Mail}>Email to Donor</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
