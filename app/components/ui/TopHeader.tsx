'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, Search, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import CountrySelector from './CountrySelector';

interface TopHeaderProps {
  onMenuClick?: () => void;
}

export default function TopHeader({ onMenuClick }: TopHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, notifications } = useAppContext();
  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Generate breadcrumb title
  const title = pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'dashboard';
  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="min-h-16 md:min-h-20 bg-white border-b border-slate-200 flex items-center justify-between gap-3 px-3 sm:px-4 md:px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick} 
          className="lg:hidden text-slate-600 hover:text-pesa-navy hover:bg-slate-100 transition-colors p-2 rounded-lg"
        >
          <Menu size={24} />
        </button>

        <div className="hidden sm:block min-w-0">
          <nav className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1 uppercase tracking-wide">
            <span>Home</span>
            <span className="text-slate-300">/</span>
            <span className="text-pesa-navy">{capitalizedTitle}</span>
          </nav>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">{capitalizedTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
        <div className="hidden md:block">
          <CountrySelector />
        </div>

        {/* Search Bar */}
        <div className="relative hidden xl:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-duma-green/30 focus:border-duma-green transition-all w-72"
          />
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-1 md:gap-2 lg:border-l lg:border-slate-200 lg:pl-4 md:pl-4">
          {/* Notifications */}
          <button 
            onClick={() => router.push('/notifications')}
            className="relative p-2.5 text-slate-600 hover:text-pesa-navy hover:bg-slate-100 transition-colors rounded-lg group"
            title="Notifications"
          >
            <div className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 rounded-full border-2 border-white shadow-sm text-[10px] leading-4 text-white font-black text-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-duma-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
          </button>
          
          {/* User Profile */}
          <div className="hidden md:flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-duma-blue to-duma-green text-white flex items-center justify-center font-bold text-lg shadow-md">
              {user?.businessName?.charAt(0) || 'S'}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900 truncate max-w-36">{user?.businessName || 'My Shop'}</p>
              <p className="text-xs text-slate-500">Your Account</p>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout} 
            className="p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
