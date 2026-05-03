'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, Search, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface TopHeaderProps {
  onMenuClick?: () => void;
}

export default function TopHeader({ onMenuClick }: TopHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Generate breadcrumb title
  const title = pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'dashboard';
  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-pesa-navy transition p-1">
          <Menu size={28} />
        </button>

        <div className="hidden sm:block">
          <div className="text-sm font-bold text-slate-400 flex items-center gap-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-pesa-navy">{capitalizedTitle}</span>
          </div>
          <h1 className="text-xl font-black text-pesa-navy tracking-tight">{capitalizedTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-duma-green/20 focus:border-duma-green transition w-64"
          />
        </div>

        <div className="flex items-center gap-3 lg:border-l lg:border-gray-100 lg:pl-6">
          <button className="relative p-2 text-slate-400 hover:text-pesa-navy transition rounded-full hover:bg-slate-50">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-duma-blue text-white flex items-center justify-center font-bold shadow-sm">
              {user?.businessName?.charAt(0) || 'S'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-pesa-navy">{user?.businessName || 'My Shop'}</p>
              <p className="text-xs font-semibold text-slate-400">Admin</p>
            </div>
          </div>

          <button onClick={handleLogout} className="ml-1 p-2 text-slate-400 hover:text-red-600 transition rounded-full hover:bg-red-50" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
