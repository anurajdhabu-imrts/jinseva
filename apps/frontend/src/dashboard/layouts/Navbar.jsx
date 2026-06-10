import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Moon, Search, Sun, LogOut, Settings, UserCircle, Globe2, ChevronDown } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';
import { useAuth } from '@context/AuthContext';
import Avatar from '@components/Avatar';
import Dropdown, { DropdownItem, DropdownDivider } from '@components/Dropdown';
import LanguageSwitcher from '@components/LanguageSwitcher';

export default function Navbar({ onMobileMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-sand-200 dark:border-neutral-800">
      <div className="h-full px-4 lg:px-6 flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800"
        >
          <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        </button>

        {/* Search (desktop) */}
        <div className="hidden md:flex relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search donations, events, devotees…"
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-sand-100/70 dark:bg-neutral-900 border border-transparent focus:border-saffron-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/30 text-sm transition-all"
          />
          <kbd className="hidden lg:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-neutral-800 border border-sand-200 dark:border-neutral-700 text-neutral-500">
            ⌘K
          </kbd>
        </div>

        {/* Mobile search button */}
        <button onClick={() => setSearchOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 ml-auto">
          <Search className="w-5 h-5 text-neutral-600" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          {/* Language */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-sand-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User menu */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-sand-100 dark:hover:bg-neutral-800 ml-1">
                <Avatar src={user?.avatar} name={user?.name} size="sm" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 leading-tight">{user?.name?.split(' ')[0]}</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 capitalize">{user?.roleName}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-400 hidden md:block" />
              </button>
            }
          >
            <div className="px-3 py-3 border-b border-sand-100 dark:border-neutral-800">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
            </div>
            <DropdownItem icon={UserCircle} onClick={() => navigate('/user/profile')}>My Profile</DropdownItem>
            <DropdownItem icon={Settings} onClick={() => navigate('/settings')}>Settings</DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={LogOut} danger onClick={() => { logout(); navigate('/auth/login'); }}>
              Sign out
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="md:hidden absolute inset-x-0 top-0 h-16 px-4 bg-white dark:bg-neutral-950 flex items-center gap-2 border-b border-sand-200 dark:border-neutral-800">
          <Search className="w-4 h-4 text-neutral-400" />
          <input autoFocus placeholder="Search…" className="flex-1 bg-transparent outline-none text-sm" />
          <button onClick={() => setSearchOpen(false)} className="text-sm text-saffron-600">Cancel</button>
        </div>
      )}
    </header>
  );
}
