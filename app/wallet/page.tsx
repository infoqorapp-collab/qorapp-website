'use client';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/ui/TopBar';
import BottomNav from '../components/ui/BottomNav';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletScreen() {
  const { walletBalance, transactions } = useAppContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-16">
      <TopBar title="Wallet / Money" showLogout={true} />

      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-6">
          <div className="bg-[#0B2545] rounded-[2rem] p-8 text-center text-white shadow-xl relative overflow-hidden">
            <p className="text-sm font-bold opacity-80 mb-2 drop-shadow-sm">Wallet balance</p>
            <motion.h2 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold tracking-tight mb-8"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
            >
              ${walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </motion.h2>
            
            <div className="flex gap-4">
              <motion.button whileTap={{ scale: 0.95 }} className="flex-1 bg-white text-[#0B2545] font-bold py-3 rounded-2xl shadow-sm text-sm hover:bg-gray-50 transition-colors">
                Send money
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} className="flex-1 bg-[#133C6F] text-white font-bold py-3 rounded-2xl border border-[#1b5093] text-sm hover:bg-[#0c2a4f] transition-colors">
                Pay supplier
              </motion.button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-6">
          <h3 className="text-sm font-bold text-neutral-800 mb-4">Incoming / outgoing transactions</h3>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {transactions.map(txn => {
              const isPositive = txn.type === 'sale' || txn.type === 'transfer_in';
              const Icon = isPositive ? ArrowDownLeft : ArrowUpRight;
              return (
                <motion.div variants={itemVariants} key={txn.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-50 text-neutral-800'}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{txn.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(txn.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold ${isPositive ? 'text-green-600' : 'text-neutral-800'}`}>
                    {isPositive ? '+' : '-'}${Number(txn.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
