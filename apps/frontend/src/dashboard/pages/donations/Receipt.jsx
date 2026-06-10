import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Mail } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Button from '@components/Button';
import { useToast } from '@context/ToastContext';
import { donationsApi, apiError } from '@services/rbacService';
import { formatDate } from '@utils/constants';

// The fixed donation-purpose rows that appear on the printed पावती, in order.
const ROWS = [
  { n: 1, label: 'मंदिर जिर्णोध्दार', keys: ['renovation', 'jirnodhar', 'mandir', 'temple', 'construction'] },
  { n: 2, label: 'सवाल', keys: ['sawal', 'sawaal'] },
  { n: 3, label: 'प.पु. पायासागर महाराज पुण्यतिथी', keys: ['punyatithi', 'payasagar', 'maharaj'] },
  { n: 4, label: '१००० भगवान महावीर जयंती', keys: ['mahavir', 'jayanti', 'janma'] },
  { n: 5, label: 'विधान', keys: ['vidhan'] },
  { n: 6, label: 'नोंपी', keys: ['nonpi', 'nompi'] },
  { n: 7, label: 'आहारदान', keys: ['aahardan', 'ahardan', 'aahar', 'ahar', 'food', 'bhojan', 'annadan'] },
  { n: 8, label: 'पालखी पट्टी / लग्न खंडणी', keys: ['palkhi', 'lagna', 'khandani', 'wedding'] },
  { n: 9, label: 'हॉल गाळा भाडे', keys: ['hall', 'gala', 'rent', 'bhade', 'booking'] },
  { n: 10, label: '', keys: [] },
  { n: 11, label: '', keys: [] },
];

const inWords = (n) => `रुपये ${Number(n || 0).toLocaleString('en-IN')} फक्त`;

export default function Receipt() {
  const { id } = useParams();
  const { toast } = useToast();
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailing, setEmailing] = useState(false);
  const sheetRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await donationsApi.get(id);
        if (!cancelled) setD(data);
      } catch (err) {
        if (!cancelled) toast.error(apiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, toast]);

  // Decide which purpose row carries this donation's amount.
  const haystack = d ? `${d.type || ''} ${d.purpose || ''} ${d.property || ''}`.toLowerCase() : '';
  let activeIdx = ROWS.findIndex((r) => r.keys.some((k) => haystack.includes(k)));
  const rows = ROWS.map((r) => ({ ...r }));
  if (d) {
    if (activeIdx === -1) {
      activeIdx = 9; // first blank row
      rows[activeIdx].label = d.type || d.purpose || 'देणगी';
    }
    rows[activeIdx].amount = d.amount;
  }

  const handlePrint = () => window.print();

  const downloadPdf = async () => {
    if (!sheetRef.current) return;
    try {
      const canvas = await html2canvas(sheetRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const w = pw - 48;
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, 'PNG', 24, 24, w, Math.min(h, ph - 48));
      pdf.save(`Pavti-${d?.receipt || d?.id}.pdf`);
      toast.success('Receipt downloaded.');
    } catch (err) {
      toast.error('Could not generate PDF. Try Print instead.');
    }
  };

  const emailReceipt = async () => {
    if (!d) return;
    setEmailing(true);
    try {
      const res = await donationsApi.emailReceipt(id);
      toast.success(res?.message || 'Receipt emailed.');
    } catch (err) {
      const msg = apiError(err);
      if (/no email/i.test(msg)) {
        const to = window.prompt('No email on file for this donor. Send receipt to:');
        if (to) {
          try { const res = await donationsApi.emailReceipt(id, to.trim()); toast.success(res?.message || 'Receipt emailed.'); }
          catch (e) { toast.error(apiError(e)); }
        }
      } else { toast.error(msg); }
    } finally { setEmailing(false); }
  };

  if (loading) return <p className="py-12 text-center text-sm text-neutral-500">Loading receipt…</p>;
  if (!d) return <p className="py-12 text-center text-sm text-neutral-500">Donation not found.</p>;

  return (
    <div className="space-y-6" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
      <Link to="/donations" className="inline-flex items-center text-sm text-neutral-500 hover:text-saffron-600 no-print">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to donations
      </Link>

      <div className="flex justify-end gap-2 no-print">
        <Button variant="secondary" icon={Printer} onClick={handlePrint}>Print</Button>
        <Button variant="secondary" icon={Mail} loading={emailing} onClick={emailReceipt}>Email</Button>
        <Button icon={Download} onClick={downloadPdf}>Download PDF</Button>
      </div>

      {/* ───── Pavti sheet (this is what prints / exports) ───── */}
      <div className="print-area max-w-2xl mx-auto">
        <div ref={sheetRef} className="bg-white" style={{ padding: 10, background: 'linear-gradient(#c8102e,#c8102e)' }}>
          <div style={{ border: '2px solid #c8102e', background: '#fffaf0' }} className="p-4">

            {/* Header */}
            <div className="flex items-center gap-3 justify-center text-center">
              <div className="w-16 h-20 rounded border-2 border-jain-yellow-500 bg-jain-yellow-100 flex items-center justify-center text-3xl shrink-0">🧘</div>
              <div className="flex-1">
                <h1 className="text-jain-red-700 font-extrabold leading-tight" style={{ fontSize: 26 }}>समस्त दिगंबर जैन समाज, मांगूर</h1>
                <p className="text-jain-green-700 font-bold" style={{ fontSize: 13 }}>ता. निपाणी, &nbsp; जि. बेळगाव</p>
                <span className="inline-block mt-1 px-5 py-0.5 rounded-full bg-jain-green-700 text-white font-bold" style={{ fontSize: 14 }}>देणगी पावती</span>
              </div>
              <div className="w-16 h-20 rounded border-2 border-jain-yellow-500 bg-jain-yellow-100 flex items-center justify-center text-3xl shrink-0">🧘</div>
            </div>

            {/* Receipt no / date */}
            <div className="flex justify-between items-end mt-3 text-jain-black-900" style={{ fontSize: 14 }}>
              <span>पावती क्र.: <b className="text-jain-red-700">{d.receipt || d.id}</b></span>
              <span>दिनांक: <b>{formatDate(d.date)}</b></span>
            </div>

            {/* Donor */}
            <div className="mt-2 text-jain-black-900" style={{ fontSize: 14 }}>
              <p>ध. श्री. / सौ.: <b>{d.anonymous ? 'अनामिक देणगीदार' : d.donor}</b></p>
              <p className="mt-1">रा.: <span className="text-neutral-500">{d.phone && d.phone !== '-' ? d.phone : '—'}</span></p>
            </div>

            {/* Table */}
            <table className="w-full mt-3 border-collapse" style={{ fontSize: 13.5 }}>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.n}>
                    <td className="border border-jain-yellow-600 text-center font-bold text-jain-red-700" style={{ width: 34, padding: '5px 0' }}>{r.n}</td>
                    <td className="border border-jain-yellow-600 px-2" style={{ padding: '5px 8px' }}>
                      {r.label
                        ? <span className="font-semibold text-jain-black-900">{r.label}</span>
                        : <span className="text-neutral-300 tracking-widest">— — — — — — — — — —</span>}
                    </td>
                    <td className={`border border-jain-yellow-600 text-right font-bold ${i === activeIdx ? 'text-jain-red-700' : ''}`} style={{ width: 110, padding: '5px 8px' }}>
                      {r.amount ? `₹ ${Number(r.amount).toLocaleString('en-IN')}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="mt-3 text-jain-black-900" style={{ fontSize: 14 }}>
              <p>अक्षरी रू.: <b>{inWords(d.amount)}</b></p>
              <p className="mt-1">इतकी रक्कम आपणाकडून रोख मिळाली.</p>
            </div>

            <div className="flex items-center justify-between mt-1">
              <span />
              <span className="text-jain-red-700 font-extrabold" style={{ fontSize: 26 }}>धन्यवाद!</span>
            </div>

            <div className="flex items-center justify-between mt-6" style={{ fontSize: 13 }}>
              <span className="border-t border-jain-black-400 pt-1">पैसे देणाऱ्याची सही</span>
              <span className="border-t border-jain-black-400 pt-1">पैसे घेणाऱ्याची सही</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
