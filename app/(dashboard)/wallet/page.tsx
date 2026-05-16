'use client';
import { useAppContext } from '../../context/AppContext';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatMarketMoney, useMarket } from '@/lib/market';

export default function WalletScreen() {
  const { walletBalance, transactions } = useAppContext();
  const { market } = useMarket();

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
    <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Wallet</h1>
          <p className="text-neutral-500 font-medium mt-1">Manage your funds and view recent transactions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-pesa-navy rounded-[2rem] p-8 text-center text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
              <p className="text-sm font-bold opacity-80 mb-2 drop-shadow-sm uppercase tracking-widest text-duma-green">Wallet Balance</p>
              <motion.h2 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-black tracking-tight mb-10"
                style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
              >
                {formatMarketMoney(walletBalance, market)}
              </motion.h2>
              
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full">
                <motion.button whileTap={{ scale: 0.95 }} className="w-full bg-white text-pesa-navy font-bold py-4 rounded-xl shadow-sm text-lg hover:bg-gray-50 transition-colors">
                  Send Money
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} className="w-full bg-duma-blue text-white font-bold py-4 rounded-xl border border-[#1b5093] text-lg hover:bg-blue-800 transition-colors">
                  Pay Supplier
                </motion.button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-full">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Recent Transactions</h3>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {transactions.length === 0 ? (
                  <div className="text-center py-10 text-neutral-400 font-bold">No transactions found.</div>
                ) : (
                  transactions.map(txn => {
                    const isPositive = txn.type === 'sale' || txn.type === 'transfer_in';
                    const Icon = isPositive ? ArrowDownLeft : ArrowUpRight;
                    return (
                      <motion.div variants={itemVariants} key={txn.id} className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${isPositive ? 'bg-green-100 text-duma-green' : 'bg-red-50 text-red-600'}`}>
                            <Icon size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900 text-lg">{txn.description}</p>
                            <p className="text-sm font-medium text-gray-500">
                              {new Date(txn.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className={`font-black text-xl ${isPositive ? 'text-duma-green' : 'text-neutral-900'}`}>
                          {isPositive ? '+' : '-'}{formatMarketMoney(Number(txn.amount), market)}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </div>
          </div>

        </div>
    </div>
  );
}
