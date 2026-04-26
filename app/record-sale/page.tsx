'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/ui/TopBar';
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
    <div className="flex flex-col h-full bg-slate-50 relative pb-6">
      <TopBar title="Record Sale" />

      <div className="flex-1 overflow-y-auto px-6 py-8 relative">
        
        <AnimatePresence>
          {isConfirming && (
            <motion.div 
              initial={{ y: 200, opacity: 1, scale: 1 }}
              animate={{ y: -100, opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-0 right-0 pointer-events-none z-50 flex justify-center"
            >
              <span className="text-4xl font-bold text-green-500">+${amount}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-neutral-900">Capture Revenue</h2>
          
          <form id="record-sale" onSubmit={handleConfirm} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-2">Item sold (optional)</label>
              <input 
                type="text"
                value={item}
                onChange={e => setItem(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-[#DFB981]/20 focus:border-[#DFB981] transition-all bg-gray-50/50"
                placeholder="Item sold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-2">Amount</label>
              <input 
                required
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-[#DFB981]/20 focus:border-[#DFB981] transition-all bg-gray-50/50 font-bold"
                placeholder="Amount"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-2">Payment method</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMethod('Cash')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${method === 'Cash' ? 'border-[#0E472D] bg-[#0E472D] text-white' : 'border-gray-200 text-neutral-400 bg-gray-50'}`}
                >
                  <Banknote size={28} className="mb-2" />
                  <span className="font-semibold">Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('Mobile Money')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${method === 'Mobile Money' ? 'border-[#0E472D] bg-[#0E472D] text-white' : 'border-gray-200 text-neutral-400 bg-gray-50'}`}
                >
                  <Smartphone size={28} className="mb-2" />
                  <span className="font-semibold px-2 text-center">Mobile Money</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="px-6 py-4">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          form="record-sale"
          type="submit" 
          disabled={isConfirming}
          className="w-full bg-[#0E472D] text-white font-bold text-lg py-4 rounded-[2rem] shadow-xl transition-all"
        >
          Confirm
        </motion.button>
      </div>
    </div>
  );
}
