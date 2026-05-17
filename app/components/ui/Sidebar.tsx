'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Package, Receipt, Users, Settings, X, HelpCircle, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ className = '', onClose }: SidebarProps) {
  const pathname = usePathname();
  const { todaysSales, todaysProfit, transactions } = useAppContext();

  const todaysExpenses = Math.max(0, Number(todaysSales || 0) - Number(todaysProfit || 0));

  const now = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const oneDayMs = 24 * 60 * 60 * 1000;
  const weekStart = new Date(startOfToday.getTime() - 6 * oneDayMs);
  const prevWeekStart = new Date(weekStart.getTime() - 7 * oneDayMs);
  const prevWeekEnd = new Date(weekStart.getTime() - oneDayMs);

  const sumRange = (start: Date, end: Date, type: 'sale' | 'expense') => {
    return (transactions || []).reduce((sum, t) => {
      const created = t.created_at ? new Date(t.created_at) : new Date(0);
      if (created >= start && created <= end && t.type === type) {
        return sum + Number(t.amount || 0);
      }
      return sum;
    }, 0);
  };

  const thisWeekSales = sumRange(weekStart, now, 'sale');
  const thisWeekExpenses = sumRange(weekStart, now, 'expense');
  const prevWeekSales = sumRange(prevWeekStart, prevWeekEnd, 'sale');
  const prevWeekExpenses = sumRange(prevWeekStart, prevWeekEnd, 'expense');

  const weekSalesChange = prevWeekSales === 0 ? null : ((thisWeekSales - prevWeekSales) / prevWeekSales) * 100;
  const weekExpensesChange = prevWeekExpenses === 0 ? null : ((thisWeekExpenses - prevWeekExpenses) / prevWeekExpenses) * 100;

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', href: '/transactions', icon: CreditCard },
    { label: 'Inventory', href: '/inventory', icon: Package },
    { label: 'Expenses', href: '/expense', icon: Receipt },
    { label: 'Reports', href: '/reports', icon: BarChart },
    { label: 'Profile', href: '/profile', icon: Users },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className={`w-64 bg-gradient-to-b from-pesa-navy to-slate-900 text-white flex flex-col h-full shrink-0 relative border-r border-slate-800/50 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex justify-between items-start">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-duma-blue to-duma-green flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 230 50" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <circle cx="25" cy="25" r="19" fill="#ffffff" />
                <circle cx="25" cy="25" r="11.5" fill="#1a6aff" />
                <polygon points="29,31 41,43 35.5,43 23.5,31" fill="#ffffff" />
                <polygon points="35.5,43 41,43 41,37.5" fill="#1a6aff" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold">QORAPP</div>
              <div className="text-xs text-emerald-400 font-semibold">Welcome</div>
            </div>
          </Link>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group"
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-duma-green/30 to-emerald-500/10 border border-duma-green/50 rounded-lg z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative z-10 flex items-center gap-3 font-medium transition-colors ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-400 group-hover:text-slate-200'
              }`}>
                <Icon size={20} className={isActive ? 'text-duma-green' : 'text-slate-500 group-hover:text-slate-400'} />
                <span>{item.label}</span>
              </div>
              
              {isActive && (
                <motion.div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-duma-green to-emerald-500 rounded-l-lg"
                  layoutId="sidebar-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Financial Feedback */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="bg-slate-800/30 rounded-xl p-3 text-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-300 font-semibold">Today</div>
            <div className="text-xs text-slate-400">Summary</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-300">Sales</div>
            <div className="font-semibold text-white">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(todaysSales || 0)}</div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-slate-300">Expenses</div>
            <div className="font-semibold text-white">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.max(0, (todaysSales || 0) - (todaysProfit || 0)))}</div>
          </div>

          <div className={`mt-3 p-2 rounded-md text-sm font-medium ${Math.max(0, (todaysSales || 0) - (todaysProfit || 0)) > (todaysSales || 0) ? 'bg-red-600/20 text-red-300 border border-red-600/20' : 'bg-emerald-600/10 text-emerald-300 border border-emerald-600/10'}`}>
            {Math.max(0, (todaysSales || 0) - (todaysProfit || 0)) > (todaysSales || 0) ? (
              <div>Warning: Spending exceeds earnings today.</div>
            ) : (
              <div>Good job: Earnings exceed spending today.</div>
            )}
          </div>

          <div className="mt-3 text-xs text-slate-400">
            <div>This week: {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(thisWeekSales)} sales, {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(thisWeekExpenses)} expenses.</div>
            <div className="mt-1">
              <span>Sales vs last week: </span>
              <span className={`font-semibold ${weekSalesChange !== null && weekSalesChange > 0 ? 'text-emerald-300' : 'text-slate-300'}`}>
                {weekSalesChange === null ? '–' : `${weekSalesChange >= 0 ? '+' : ''}${weekSalesChange.toFixed(1)}%`}
              </span>
              <span className="ml-3">Expenses vs last week: </span>
              <span className={`font-semibold ${weekExpensesChange !== null && weekExpensesChange > 0 ? 'text-red-300' : 'text-slate-300'}`}>
                {weekExpensesChange === null ? '–' : `${weekExpensesChange >= 0 ? '+' : ''}${weekExpensesChange.toFixed(1)}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all group cursor-pointer">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-duma-green/20 rounded-lg group-hover:bg-duma-green/30 transition-colors">
              <HelpCircle size={18} className="text-duma-green" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">Need Help?</p>
              <p className="text-xs text-slate-400 mt-1">Check docs or contact us</p>
            </div>
          </div>
          <button className="w-full bg-duma-green/20 hover:bg-duma-green/30 transition-all font-semibold text-duma-green py-2 rounded-lg text-sm border border-duma-green/30">
            Get Support
          </button>
        </div>
      </div>
    </div>
  );
}
