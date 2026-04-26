'use client';
import { useAppContext } from '../context/AppContext';
import BottomNav from '../components/ui/BottomNav';
import { Bell, LogOut, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { todaysSales, todaysProfit, walletBalance, isLoading, logout } = useAppContext();
  const router = useRouter();

  if (isLoading) {
    return <div className="flex flex-col h-full bg-slate-50 items-center justify-center">Loading...</div>
  }

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-16 overflow-y-auto">
      {/* Top Header */}
      <div className="bg-[#0E472D] text-white p-4 pb-16 flex items-center justify-between shadow-md relative z-10">
        <button onClick={handleLogout} className="p-1 hover:text-red-300 transition-colors cursor-pointer"><LogOut size={24} /></button>
        <h1 className="text-sm font-semibold tracking-wider uppercase">DASHBOARD</h1>
        <button className="p-1"><Bell size={24} /></button>
      </div>

      {/* Main Stats Card */}
      <div className="px-5 -mt-10 relative z-20">
        <div className="bg-[#0E472D] rounded-[2rem] p-6 text-center text-white shadow-xl flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-green-100 mb-1">Today's Sales</p>
            <h2 className="text-5xl font-bold text-white tracking-tighter">
              $<CountUp end={todaysSales} duration={2} separator="," />
            </h2>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-green-100 mb-1">Profit</p>
            <h3 className="text-3xl font-bold text-green-400 tracking-tight">
              $<CountUp end={todaysProfit} duration={2.5} separator="," />
            </h3>
          </div>
          <div className="border-t border-[#1b6b42] pt-4 mt-2">
            <p className="text-sm font-bold uppercase tracking-wider text-green-100 mb-1">Wallet Balance</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              $<CountUp end={walletBalance} duration={1.5} separator="," decimals={2} />
            </h3>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 mt-8 flex flex-col gap-4">
        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push('/record-sale')} 
          className="bg-white p-4 rounded-2xl shadow-sm text-lg font-bold text-neutral-800 border-2 border-[#DFB981] flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#DFB981]/20 text-[#B89565] p-2 rounded-xl">
              <DollarSign size={24} />
            </div>
            Record Sale
          </div>
          <p className="text-[#DFB981] text-xl font-black">›</p>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push('/expense')} 
          className="bg-white p-4 rounded-2xl shadow-sm text-lg font-bold text-neutral-800 border border-gray-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#DFB981]/20 text-[#B89565] p-2 rounded-xl">
              <TrendingUp size={24} className="transform rotate-180" />
            </div>
            Add Expense
          </div>
          <p className="text-gray-400 text-xl font-black">›</p>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push('/insights')} 
          className="bg-white p-4 rounded-2xl shadow-sm text-lg font-bold text-neutral-800 border border-gray-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-[#0E472D] p-2 rounded-xl">
              <Activity size={24} />
            </div>
            View Insights
          </div>
          <p className="text-gray-400 text-xl font-black">›</p>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
