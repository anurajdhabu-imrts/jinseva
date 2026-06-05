import { Sparkles, Download, Share2, QrCode, Check } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card, { CardBody } from '@components/Card';
import Button from '@components/Button';
import Avatar from '@components/Avatar';
import JainFlagStripe, { JainFlagBadge } from '@web/components/JainFlagStripe';
import { LotusGlyph } from '@web/components/OrnamentalDivider';
import { useAuth } from '@context/AuthContext';

const benefits = [
  'Priority darshan at all major festivals',
  '25% off on hall bookings for personal ceremonies',
  'Annual 80G tax certificate',
  'Exclusive access to special poojas & yagnas',
  'Monthly digital pradakshina newsletter',
  'Birthday & anniversary blessings',
];

export default function MembershipCard() {
  const { user } = useAuth();
  const memberId = `JIN-${user?.id?.slice(-6).toUpperCase() || '008945'}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership Card"
        subtitle="Your digital identity for sacred services"
        breadcrumb={[{ label: 'Devotee Portal', to: '/user' }, { label: 'Membership' }]}
        actions={
          <>
            <Button variant="secondary" icon={Share2}>Share</Button>
            <Button icon={Download}>Download</Button>
          </>
        }
      />

      <div className="max-w-2xl mx-auto">
        {/* ━━━━━━━━━ CARD ━━━━━━━━━ */}
        <div className="relative aspect-[1.6/1] rounded-3xl overflow-hidden shadow-2xl bg-jain-red-600">
          {/* Vertical Jain flag stripe down the left edge */}
          <JainFlagStripe orientation="vertical" className="absolute top-0 left-0 h-full" />

          {/* Diagonal accent band */}
          <div
            className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-jain-yellow-400/15"
            aria-hidden
          />
          <div
            className="absolute -top-24 -left-12 w-[280px] h-[280px] rounded-full bg-jain-yellow-400/10"
            aria-hidden
          />

          {/* Mandala watermark */}
          <div className="absolute inset-0 bg-mandala opacity-20" aria-hidden />

          {/* Faint spinning ring decoration */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-15 animate-spin-very-slow pointer-events-none" aria-hidden>
            <svg viewBox="0 0 200 200" className="w-full h-full text-jain-yellow-300" fill="none" stroke="currentColor" strokeWidth="0.4">
              <circle cx="100" cy="100" r="90" />
              <circle cx="100" cy="100" r="65" />
              <circle cx="100" cy="100" r="40" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line key={i} x1="100" y1="10" x2="100" y2="190" transform={`rotate(${i * 7.5} 100 100)`} />
              ))}
            </svg>
          </div>

          {/* CONTENT */}
          <div className="relative h-full pl-8 pr-6 py-6 flex flex-col justify-between text-white">
            {/* Top row — brand + lotus */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <JainFlagBadge size="sm" />
                <div className="leading-tight">
                  <p className="font-serif font-bold text-xl tracking-tight">Shree Jinalaya</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-jain-yellow-300 mt-0.5">
                    Devotee Sevak Card
                  </p>
                </div>
              </div>

              {/* Sanskrit greeting top-right */}
              <div className="text-right">
                <LotusGlyph className="w-8 h-8 text-jain-yellow-300 ml-auto" />
                <p className="font-serif italic text-[11px] text-jain-yellow-200 mt-1">Jai Jinendra</p>
              </div>
            </div>

            {/* Middle — large member name with subtle gold underline */}
            <div className="flex items-end gap-4">
              <Avatar
                src={user?.avatar}
                name={user?.name}
                size="xl"
                className="ring-4 ring-jain-yellow-400 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-jain-yellow-200">Member Name</p>
                <p className="font-display text-2xl md:text-3xl font-bold leading-tight mt-0.5">
                  {user?.name || 'Bhavin Shah'}
                </p>
                <div className="mt-1 h-px w-32 bg-jain-yellow-400/60" />
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2.5 text-[11px]">
                  <div>
                    <p className="text-jain-yellow-200 uppercase tracking-wider text-[9px]">Member ID</p>
                    <p className="font-bold font-mono text-sm">{memberId}</p>
                  </div>
                  <div>
                    <p className="text-jain-yellow-200 uppercase tracking-wider text-[9px]">Sevak Since</p>
                    <p className="font-bold text-sm">January 2022</p>
                  </div>
                </div>
              </div>

              {/* QR code */}
              <div className="relative w-20 h-20 rounded-xl bg-white p-1.5 shrink-0 shadow-lg">
                <div className="w-full h-full rounded-md bg-jain-black-900 flex items-center justify-center">
                  <QrCode className="w-11 h-11 text-white" />
                </div>
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-jain-yellow-400 text-jain-black-900 text-[8px] font-bold tracking-wider">
                  SCAN
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Jain flag stripe */}
          <JainFlagStripe height="h-1" className="absolute bottom-0 left-0 right-0" />
        </div>

        {/* ━━━━━━━━━ BENEFITS ━━━━━━━━━ */}
        <Card className="mt-8 overflow-hidden border-jain-yellow-200">
          <div className="bg-jain-yellow-50 px-6 py-4 border-b border-jain-yellow-200/60 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-jain-red-600 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-lg text-jain-black-900">Sevak Benefits</h3>
              <p className="text-xs text-jain-black-600">Perks of being part of our 100-year-old sangh</p>
            </div>
          </div>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-3 p-3 rounded-xl bg-jain-yellow-50/50 hover:bg-jain-yellow-50 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-jain-green-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-jain-black-800 font-medium">{b}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
