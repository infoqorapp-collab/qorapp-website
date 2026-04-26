'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/ui/TopBar';
import { Receipt } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExpenseScreen() {
  const [type, setType] = useState('rent');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Cash' | 'Mobile money'>('Mobile money');
  const [shakeFile, setShakeFile] = useState(false);
  const { addExpense } = useAppContext();
  const router = useRouter();

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    // Animate shake if we were pretending to attach a receipt
    setShakeFile(true);
    setTimeout(() => setShakeFile(false), 500);

    await addExpense(parseFloat(amount), type, method);
    
    setTimeout(() => router.push('/dashboard'), 600);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-6">
      <TopBar title="Expense Type" />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <form id="record-expense" onSubmit={handleConfirm} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-semibold text-neutral-800 mb-2">Expense type</label>
            <div className="relative">
              {/* Note: pure select element animating dropdowns is hard cross-browser without custom UI component, falling back to minimal styling */ }
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-lg appearance-none focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
              >
                <option value="rent">rent</option>
                <option value="stock">stock</option>
                <option value="transport">transport</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-gray-500">▼</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">Amount</label>
            <input 
              required
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all shadow-sm"
              placeholder="Amount"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-2">Payment method</label>
            <select 
                value={method}
                onChange={e => setMethod(e.target.value as any)}
                className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-lg appearance-none focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
              >
                <option value="Mobile money">Mobile money</option>
                <option value="Cash">Cash</option>
            </select>
          </div>

          <motion.button 
            animate={shakeFile ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            type="button" 
            className="w-full py-4 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-[#0E472D] font-bold shadow-sm mt-4 hover:bg-gray-50"
          >
            <Receipt size={20} /> Attach receipt
          </motion.button>
        </form>
      </div>

      <div className="px-6 py-4">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          form="record-expense"
          type="submit" 
          className="w-full bg-[#0E472D] text-white font-bold text-lg py-4 rounded-[2rem] shadow-xl transition-all"
        >
          Confirm Expense
        </motion.button>
      </div>
    </div>
  );
}
