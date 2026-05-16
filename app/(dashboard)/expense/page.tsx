'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import { Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { marketAmountToUsd, useMarket } from '@/lib/market';

export default function ExpenseScreen() {
  const [type, setType] = useState('rent');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Cash' | 'Mobile money'>('Mobile money');
  const [shakeFile, setShakeFile] = useState(false);
  const { addExpense } = useAppContext();
  const { market } = useMarket();
  const router = useRouter();

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    setShakeFile(true);
    setTimeout(() => setShakeFile(false), 500);

    await addExpense(marketAmountToUsd(parseFloat(amount), market), type, method);
    
    setTimeout(() => router.push('/dashboard'), 600);
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-3xl md:rounded-[2rem] shadow-lg border border-gray-100 p-5 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-pesa-navy tracking-tight">Record Expense</h1>
            <p className="text-neutral-500 font-medium mt-1">Track outgoing money to keep your books accurate.</p>
          </div>

          <form id="record-expense" onSubmit={handleConfirm} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-bold text-neutral-800 mb-2">Expense Category</label>
              <div className="relative">
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-lg appearance-none focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all shadow-sm"
                >
                  <option value="rent">Rent</option>
                  <option value="stock">Stock</option>
                  <option value="transport">Transport</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-2">Amount ({market.currency})</label>
              <input 
                required
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-2xl font-bold text-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all shadow-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-2">Payment Method</label>
              <div className="relative">
                <select 
                    value={method}
                    onChange={e => setMethod(e.target.value as 'Cash' | 'Mobile money')}
                    className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-lg appearance-none focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all shadow-sm"
                  >
                    <option value="Mobile money">Mobile money</option>
                    <option value="Cash">Cash</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">▼</span>
                </div>
              </div>
            </div>

            <motion.button 
              animate={shakeFile ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              type="button" 
              className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-neutral-600 font-bold mt-4 hover:bg-gray-100 transition"
            >
              <Receipt size={20} /> Attach Receipt Photo
            </motion.button>
            
            <div className="pt-6 border-t border-gray-100">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-red-600 text-white font-bold text-xl py-4 rounded-[1.5rem] shadow-xl shadow-red-200 hover:bg-red-700 transition-all"
              >
                Confirm Expense
              </motion.button>
            </div>
          </form>
        </div>
    </div>
  );
}
