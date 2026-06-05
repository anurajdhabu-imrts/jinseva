import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Mail, Flame } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import { donationsList } from '@data/mockData';
import { formatCurrency, formatDate, APP_NAME } from '@utils/constants';

const numberToWords = (n) => {
  // Simplified placeholder for receipt
  return `Rupees ${Number(n).toLocaleString('en-IN')} only`;
};

export default function Receipt() {
  const { id } = useParams();
  const d = donationsList.find((x) => x.id === id) || donationsList[0];

  return (
    <div className="space-y-6">
      <Link to="/donations" className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to donations
      </Link>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" icon={Printer}>Print</Button>
        <Button variant="secondary" icon={Mail}>Email</Button>
        <Button icon={Download}>Download PDF</Button>
      </div>

      <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-sand-200 dark:border-neutral-800">
        {/* Receipt header */}
        <div className="relative bg-gradient-to-br from-saffron-500 via-saffron-600 to-maroon-700 p-8 text-white">
          <div className="absolute inset-0 bg-mandala opacity-20" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-2xl">Shree Mahavir Jain Derasar</h2>
                <p className="text-sm opacity-90">123 Derasar Marg, Walkeshwar, Mumbai — 400006</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider opacity-75">Receipt No.</p>
              <p className="font-serif font-bold text-2xl">{d.receipt}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-saffron-700 dark:text-saffron-400">Donation Receipt</h1>
            <p className="text-sm text-neutral-500 mt-1 italic font-serif">For 80G tax benefit and divine blessings</p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-neutral-500">Received from</p>
              <p className="font-semibold text-neutral-900 dark:text-white">{d.anonymous ? 'Anonymous Devotee' : d.donor}</p>
            </div>
            <div>
              <p className="text-neutral-500">Date</p>
              <p className="font-semibold text-neutral-900 dark:text-white">{formatDate(d.date)}</p>
            </div>
            {!d.anonymous && (
              <>
                <div>
                  <p className="text-neutral-500">Email</p>
                  <p className="font-medium text-neutral-700 dark:text-neutral-300">{d.email}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Phone</p>
                  <p className="font-medium text-neutral-700 dark:text-neutral-300">{d.phone}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-neutral-500">Purpose</p>
              <p className="font-medium text-neutral-700 dark:text-neutral-300">{d.type}</p>
            </div>
            <div>
              <p className="text-neutral-500">Payment Method</p>
              <p className="font-medium text-neutral-700 dark:text-neutral-300">{d.method}</p>
            </div>
          </div>

          {/* Amount box */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-saffron-50 via-gold-50 to-maroon-50 dark:from-saffron-500/10 dark:via-gold-500/10 dark:to-maroon-500/10 border-2 border-dashed border-saffron-300 dark:border-saffron-500/30 text-center">
            <p className="text-xs uppercase tracking-wider text-saffron-700 dark:text-saffron-400 font-semibold">Donation Amount</p>
            <p className="font-serif font-bold text-5xl gradient-text mt-2">{formatCurrency(d.amount)}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 italic">{numberToWords(d.amount)}</p>
          </div>

          {/* Notes */}
          <div className="mt-8 p-4 rounded-xl bg-sand-50 dark:bg-neutral-800/50 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
            <p>• This receipt is computer generated and does not require a signature.</p>
            <p>• Donations are eligible for tax exemption under section 80G of the Income Tax Act, 1961.</p>
            <p>• PAN: AABCD1234E • Registration No: TR-12345/2018</p>
          </div>

          {/* Signature & seal */}
          <div className="mt-8 flex items-end justify-between">
            <div>
              <div className="font-serif italic text-2xl text-saffron-700 dark:text-saffron-400">~ Shree Jinalaya ~</div>
              <p className="text-xs text-neutral-500 mt-1">Authorized Signatory</p>
            </div>
            <div className="w-24 h-24 rounded-full border-2 border-saffron-500 flex items-center justify-center bg-saffron-50 dark:bg-saffron-500/10">
              <div className="text-center">
                <Flame className="w-6 h-6 text-saffron-600 mx-auto" />
                <p className="text-[8px] text-saffron-700 font-bold uppercase mt-1">Temple Seal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-sand-50 dark:bg-neutral-800/50 p-6 text-center text-xs text-neutral-500 italic font-serif">
          "Sarve bhavantu sukhinah, sarve santu niramayah" — May all beings be happy and healthy
        </div>
      </div>
    </div>
  );
}
