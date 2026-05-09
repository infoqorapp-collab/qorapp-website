'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Package, Receipt, Users, Settings, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ className = '', onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', href: '/transactions', icon: CreditCard },
    { label: 'Inventory', href: '/inventory', icon: Package },
    { label: 'Expenses', href: '/expense', icon: Receipt },
    { label: 'Customers', href: '#', icon: Users }, // Placeholder
    { label: 'Settings', href: '#', icon: Settings }, // Placeholder
  ];

  return (
    <div className={`w-64 bg-pesa-navy text-white flex-col h-full shrink-0 relative border-r border-slate-800 ${className}`}>
      <div className="p-6 flex justify-between items-center">
        <div>
          <Link href="/dashboard" onClick={onClose} className="flex items-center space-x-2 mb-2">
            <svg viewBox="0 0 230 50" xmlns="http://www.w3.org/2000/svg" width="120" height="26">
              {/* Outer blue Q ring */}
              <circle cx="25" cy="25" r="19" fill="#1A6AFF" />
              {/* Inner white hole */}
              <circle cx="25" cy="25" r="11.5" fill="#ffffff" />
              {/* Arrow tail */}
              <polygon points="29,31 41,43 35.5,43 23.5,31" fill="#1A6AFF" />
              {/* Arrow tip notch */}
              <polygon points="35.5,43 41,43 41,37.5" fill="#ffffff" />
              {/* Wordmark */}
              <text x="54" y="33"
                fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
                fontWeight="800" fontSize="22" letterSpacing="2.5" fill="#0C1B33">
                QORAPP
              </text>
            </svg>
          </Link>
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold opacity-80">Admin Portal</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white p-2">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-duma-green/20 border border-duma-green/30 rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3 font-semibold">
                <Icon size={20} className={isActive ? 'text-duma-green' : 'text-slate-400'} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-sm">
          <p className="font-bold text-white mb-1">Need help?</p>
          <p className="text-slate-400 mb-3">Check our docs or contact support.</p>
          <button className="w-full bg-white/10 hover:bg-white/20 transition-colors font-bold text-white py-2 rounded-lg">
            Support
          </button>
        </div>
      </div>
    </div>
  );
}
