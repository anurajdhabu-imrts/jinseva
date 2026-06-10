import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, HeartHandshake, Receipt, Wallet, BookOpenCheck,
  Package, Users, UserCircle, Megaphone, BarChart3, Image, Settings,
  ChevronLeft, Flame, TrendingUp
} from 'lucide-react';
import { cn } from '@utils/cn';
import { useAuth } from '@context/AuthContext';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Management',
    items: [
      { to: '/events',    label: 'Events',         icon: Calendar,      permission: 'events.view'    },
      { to: '/donations', label: 'Donations',      icon: HeartHandshake, permission: 'donations.view' },
      { to: '/income',    label: 'Income',         icon: TrendingUp,    permission: 'income.view'    },
      { to: '/expenses',  label: 'Expenses',       icon: Receipt,       permission: 'expenses.view'  },
      { to: '/bookings',  label: 'Pooja Bookings', icon: BookOpenCheck, permission: 'bookings.view'  },
      { to: '/inventory', label: 'Inventory',      icon: Package,       permission: 'inventory.view' },
      { to: '/staff',     label: 'Staff',          icon: Users,         permission: 'staff.view'     },
    ],
  },
  {
    title: 'Devotee',
    items: [
      { to: '/user',          label: 'Devotee Portal', icon: UserCircle },
      { to: '/communication', label: 'Communication',  icon: Megaphone, permission: 'communication.view' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { to: '/reports',  label: 'Reports',  icon: BarChart3, permission: 'reports.view'  },
      { to: '/media',    label: 'Media',    icon: Image,     permission: 'media.view'    },
      { to: '/settings', label: 'Settings', icon: Settings,  anyPermission: ['settings.view', 'admin.users', 'admin.roles'] },
    ],
  },
];

// Devotees get a deliberately minimal sidebar — just their dashboard and the
// devotee portal — even though they may hold extra view permissions (e.g.
// events.view, which the portal's "Event Details" card relies on).
const DEVOTEE_ROUTES = ['/dashboard', '/user'];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const loc = useLocation();
  const { user, hasPermission, hasAnyPermission } = useAuth();
  const isDevotee = user?.roleId === 'role_devotee';

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (isDevotee)          return DEVOTEE_ROUTES.includes(item.to);
        if (item.permission)    return hasPermission(item.permission);
        if (item.anyPermission) return hasAnyPermission(item.anyPermission);
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-neutral-900/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 264 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 z-40 h-screen flex flex-col',
          'bg-white dark:bg-neutral-950 border-r border-sand-200 dark:border-neutral-800',
          'transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ width: collapsed ? 80 : 264 }}
      >
        {/* Brand */}
        <div className={cn('h-16 flex items-center gap-3 px-5 border-b border-sand-200 dark:border-neutral-800', collapsed && 'justify-center px-0')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-500 via-saffron-600 to-maroon-600 flex items-center justify-center shadow-glow shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-serif font-bold text-lg gradient-text leading-none">Shree Jinalaya</h1>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-0.5">Jain Derasar Suite</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-none">
          {visibleGroups.map((group) => (
            <div key={group.title} className="mb-5">
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = loc.pathname.startsWith(item.to);
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                          isActive
                            ? 'bg-jain-yellow-500 text-jain-black-900 font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-sand-100 dark:hover:bg-neutral-800 hover:text-saffron-700 dark:hover:text-saffron-400',
                          collapsed && 'justify-center px-2'
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-saffron-500 to-maroon-600" />
                        )}
                        <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-jain-black-900')} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {!collapsed && item.badge && (
                          <span className="ml-auto px-1.5 py-0.5 text-[10px] rounded-full bg-saffron-100 text-saffron-700 dark:bg-saffron-500/20">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>


        {/* Collapse button — desktop */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 border border-sand-200 dark:border-neutral-700 shadow items-center justify-center text-neutral-500 hover:text-saffron-600 transition"
        >
          <ChevronLeft className={cn('w-3.5 h-3.5 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </motion.aside>
    </>
  );
}
