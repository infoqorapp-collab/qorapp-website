'use client';
import { Home, BarChart3, Package, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, href: '/dashboard' },
    { icon: BarChart3, href: '/reports' },
    { icon: Package, href: '/inventory' },
    { icon: User, href: '/wallet' },
  ];

  if (pathname === '/') return null; // Don't show on login
  
  // Also don't show on sub-screens like record-sale, expense
  const showNav = ['/dashboard', '/inventory', '/wallet', '/insights', '/reports'].includes(pathname);
  if (!showNav) return null;

  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-16 px-4 z-50 rounded-b-[2rem] sm:rounded-b-[2rem]">
      {navItems.map((item, i) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={i} className={clsx("p-2", isActive ? "text-[#0E472D]" : "text-gray-400")}>
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          </Link>
        );
      })}
    </div>
  );
}
