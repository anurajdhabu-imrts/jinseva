import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Coins, HeartHandshake, CalendarRange, Users, Download, Plus, Sparkles, Sun
} from 'lucide-react';
import StatsCard from '@dashboard/components/widgets/StatsCard';
import IncomeExpenseChart from '@dashboard/components/widgets/IncomeExpenseChart';
import DonationCategoriesChart from '@dashboard/components/widgets/DonationCategoriesChart';
import EventRevenueChart from '@dashboard/components/widgets/EventRevenueChart';
import RecentTransactions from '@dashboard/components/widgets/RecentTransactions';
import UpcomingEvents from '@dashboard/components/widgets/UpcomingEvents';
import CalendarWidget from '@dashboard/components/widgets/CalendarWidget';
import ActivitySummary from '@dashboard/components/widgets/ActivitySummary';
import Button from '@components/Button';
import { formatCurrency } from '@utils/constants';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { dashboardApi, apiError } from '@services/rbacService';

const EMPTY = {
  stats: { totalDonations: 0, totalExpenses: 0, upcomingEvents: 0, registeredDevotees: 0 },
  monthlyIncomeExpense: [], donationCategories: [], eventRevenue: [],
  recentTransactions: [], upcomingEvents: [], activitySummary: [],
};

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [d, setD] = useState(EMPTY);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Suprabhat' : hour < 17 ? 'Jai Jinendra' : 'Shubh Sandhya';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await dashboardApi.overview();
        if (!cancelled) setD({ ...EMPTY, ...data });
      } catch (err) {
        toast.error(apiError(err));
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  const s = d.stats;

  return (
    <div className="space-y-6">
      {/* Greeting hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron-500 via-saffron-600 to-maroon-700 p-6 md:p-8 text-white"
      >
        <div className="absolute inset-0 bg-mandala opacity-30" />
        <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-gold-400/30 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium mb-3">
              <Sun className="w-3.5 h-3.5" /> {greeting}, {user?.name?.split(' ')[0] || 'Sevak'}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              May this day bring abundant blessings to the temple.
            </h1>
            <p className="text-white/85 mt-2 text-sm md:text-base">
              Here's everything happening across <strong className="text-gold-200">{user?.templeName || 'your temple'}</strong> today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => nav('/donations/new')} className="px-4 py-2.5 rounded-xl bg-white text-saffron-700 font-medium hover:bg-white/95 shadow-lg inline-flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> New Donation
            </button>
            <button onClick={() => nav('/reports')} className="px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur hover:bg-white/25 font-medium inline-flex items-center gap-2 text-sm border border-white/20">
              <Download className="w-4 h-4" /> Reports
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          icon={HeartHandshake}
          label="Total Donations"
          value={formatCurrency(s.totalDonations)}
          tone="primary"
          delay={0}
        />
        <StatsCard
          icon={Coins}
          label="Total Expenses"
          value={formatCurrency(s.totalExpenses)}
          tone="rose"
          delay={0.05}
        />
        <StatsCard
          icon={CalendarRange}
          label="Upcoming Events"
          value={String(s.upcomingEvents)}
          tone="gold"
          delay={0.1}
        />
        <StatsCard
          icon={Users}
          label="Registered Devotees"
          value={Number(s.registeredDevotees).toLocaleString('en-IN')}
          tone="violet"
          delay={0.15}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={d.monthlyIncomeExpense} />
        </div>
        <DonationCategoriesChart data={d.donationCategories} />
      </div>

      {/* Mid row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EventRevenueChart data={d.eventRevenue} />
        </div>
        <ActivitySummary data={d.activitySummary} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentTransactions data={d.recentTransactions} />
        <UpcomingEvents data={d.upcomingEvents} />
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CalendarWidget />
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold-100 via-saffron-100 to-maroon-100 dark:from-gold-900/20 dark:via-saffron-900/20 dark:to-maroon-900/20 border border-saffron-200/50 dark:border-saffron-500/20 p-6">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-br from-saffron-400 to-maroon-500 opacity-20 blur-2xl" />
          <Sparkles className="w-8 h-8 text-saffron-600 mb-3" />
          <h3 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Vachan of the Day</h3>
          <p className="font-serif italic text-lg text-neutral-700 dark:text-neutral-300 mt-3 max-w-xl leading-relaxed">
            "Parasparopagraho Jīvānām" — Souls render service to one another.
            Live with compassion, walk with ahimsa, dissolve karma with samyak darshan.
          </p>
          <p className="mt-3 text-sm text-saffron-700 dark:text-saffron-400 font-medium">— Bhagwan Mahavir, Tattvarth Sutra</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">Share Quote</Button>
            <Button variant="ghost" size="sm">View archive</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
