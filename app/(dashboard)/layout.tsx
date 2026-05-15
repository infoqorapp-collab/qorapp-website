'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import TopHeader from '../components/ui/TopHeader';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, pathname, router, user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
        <div>
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-duma-green/20 border-t-duma-green" />
          <p className="text-lg font-black text-pesa-navy">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
           <>
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setIsMobileMenuOpen(false)}
               className="fixed inset-0 bg-pesa-navy/60 backdrop-blur-sm z-40 lg:hidden" 
             />
             <motion.div 
               initial={{ x: '-100%' }}
               animate={{ x: 0 }}
               exit={{ x: '-100%' }}
               transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
               className="fixed inset-y-0 left-0 z-50 w-64 shadow-2xl lg:hidden flex flex-col"
             >
               <Sidebar className="flex" onClose={() => setIsMobileMenuOpen(false)} />
             </motion.div>
           </>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 xl:p-8 2xl:p-10">
          <div className="qorapp-dashboard-page">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
