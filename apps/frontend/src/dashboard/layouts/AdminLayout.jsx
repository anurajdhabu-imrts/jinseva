import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '@utils/cn';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-theme min-h-screen bg-jain-white-50 dark:bg-jain-black-950">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className={cn('transition-all duration-300', collapsed ? 'lg:ml-20' : 'lg:ml-[264px]')}>
        <Navbar onMobileMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
