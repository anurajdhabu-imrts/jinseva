import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, HeartHandshake, Trophy, Edit, MessageSquare } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody, CardHeader } from '@components/Card';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import Button from '@components/Button';
import Tabs from '@components/Tabs';
import Table from '@components/Table';
import { donationsList } from '@data/mockData';
import { formatCurrency, formatDate, STATUS_COLORS } from '@utils/constants';

export default function DonorProfile() {
  const donor = donationsList[0];
  const totalDonations = donationsList.reduce((s, d) => s + d.amount, 0);

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'type', title: 'Type', render: (v) => <Badge variant="primary">{v}</Badge> },
    { key: 'amount', title: 'Amount', align: 'right', render: (v) => <span className="font-semibold">{formatCurrency(v)}</span> },
    { key: 'method', title: 'Method' },
    { key: 'date', title: 'Date', render: (v) => formatDate(v) },
    { key: 'status', title: 'Status', render: (v) => <Badge variant={STATUS_COLORS[v]}>{v}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <Link to="/donations" className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Link>

      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-saffron-500 via-saffron-600 to-maroon-600 bg-mandala" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <Avatar name={donor.donor} size="2xl" ring />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">{donor.donor}</h1>
                <Badge variant="gold" dot>Platinum Donor</Badge>
                <Badge variant="success" dot>Verified</Badge>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{donor.email}</span>
                <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{donor.phone}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Mumbai, Maharashtra</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Member since Jan 2022</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" icon={MessageSquare}>Message</Button>
              <Button icon={Edit}>Edit Profile</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Lifetime Contribution', v: formatCurrency(totalDonations), c: 'from-saffron-500 to-saffron-600', i: HeartHandshake },
          { l: 'Total Donations', v: donationsList.length, c: 'from-gold-400 to-saffron-500', i: HeartHandshake },
          { l: 'Avg Donation', v: formatCurrency(Math.round(totalDonations / donationsList.length)), c: 'from-violet-400 to-violet-600', i: Trophy },
          { l: 'Donor Rank', v: '#12', c: 'from-emerald-400 to-emerald-600', i: Trophy },
        ].map((s) => (
          <div key={s.l} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-sand-200/60 dark:border-neutral-800">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-white mb-3`}>
              <s.i className="w-5 h-5" />
            </div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">{s.l}</p>
            <p className="text-xl font-serif font-bold text-neutral-900 dark:text-white mt-1">{s.v}</p>
          </div>
        ))}
      </div>

      <Tabs
        variant="underline"
        tabs={[
          {
            key: 'history',
            label: 'Donation History',
            content: <Table columns={columns} data={donationsList} rowKey="id" />,
          },
          {
            key: 'about',
            label: 'About',
            content: (
              <Card>
                <CardBody className="space-y-3">
                  <p className="text-neutral-700 dark:text-neutral-300">
                    A devoted patron supporting the temple's seva activities for over four years.
                    Regular contributor to Annadanam and renovation projects.
                  </p>
                </CardBody>
              </Card>
            ),
          },
          {
            key: 'communications',
            label: 'Communications',
            content: <Card><CardBody><p className="text-neutral-500 text-center py-10">No recent communications.</p></CardBody></Card>,
          },
        ]}
      />
    </div>
  );
}
