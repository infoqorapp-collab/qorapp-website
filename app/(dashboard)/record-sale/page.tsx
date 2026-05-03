'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import { Banknote, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecordSaleScreen() {
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Cash' | 'Mobile Money'>('Cash');
  const [isConfirming, setIsConfirming] = useState(false);
  const { addSale } = useAppContext();
  const router = useRouter();

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setIsConfirming(true);
    await addSale(parseFloat(amount), method, item);
    
    // Allow animation to play before routing
    setTimeout(() => router.push('/dashboard'), 800);
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        
        <AnimatePresence>
          {isConfirming && (
            <motion.div 
              initial={{ y: 200, opacity: 1, scale: 1 }}
              animate={{ y: -100, opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-0 right-0 pointer-events-none z-50 flex justify-center mt-32"
            >
              <span className="text-5xl font-black text-duma-green drop-shadow-lg">+${amount}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-2xl bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Record Sale</h1>
            <p className="text-neutral-500 font-medium mt-1">Capture revenue and update your daily tracking.</p>
          </div>
          
          <form id="record-sale" onSubmit={handleConfirm} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-2">Item Sold (Optional)</label>
              <input 
                type="text"
                value={item}
                onChange={e => setItem(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition-all bg-white shadow-sm"
                placeholder="e.g. Rice 5kg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-2">Amount ($)</label>
              <input 
                required
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-2xl font-black text-duma-green focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition-all bg-white shadow-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-3">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMethod('Cash')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${method === 'Cash' ? 'border-duma-green bg-green-50 text-duma-green shadow-sm' : 'border-gray-200 text-neutral-400 bg-white hover:bg-gray-50'}`}
                >
                  <Banknote size={32} className="mb-3" />
                  <span className="font-bold">Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('Mobile Money')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${method === 'Mobile Money' ? 'border-duma-green bg-green-50 text-duma-green shadow-sm' : 'border-gray-200 text-neutral-400 bg-white hover:bg-gray-50'}`}
                >
                  <Smartphone size={32} className="mb-3" />
                  <span className="font-bold px-2 text-center">Mobile Money</span>
                </button>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100 mt-8">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={isConfirming}
                className="w-full bg-duma-green text-white font-bold text-xl py-4 rounded-[1.5rem] shadow-xl shadow-green-200 hover:bg-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Confirm Sale
              </motion.button>
            </div>
          </form>
        </div>
    </div>
  );
}
