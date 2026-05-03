'use client';

import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TransactionsScreen() {
  const { transactions, isLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-sans font-bold text-pesa-navy text-xl">Loading Transactions...</div>;
  }

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Transactions</h1>
          <p className="text-neutral-500 font-medium mt-1">A complete history of all your sales and expenses.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-pesa-navy font-bold py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-duma-green/20 focus:border-duma-green transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm w-full sm:w-auto">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-sm font-bold text-pesa-navy focus:outline-none appearance-none"
              >
                <option value="all">All Types</option>
                <option value="sale">Sales Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                <th className="py-4 px-6 font-semibold">Transaction details</th>
                <th className="py-4 px-6 font-semibold">Date & Time</th>
                <th className="py-4 px-6 font-semibold">Type</th>
                <th className="py-4 px-6 font-semibold">Method</th>
                <th className="py-4 px-6 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn, index) => {
                  const isPositive = txn.type === 'sale' || txn.type === 'transfer_in';
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={txn.id} 
                      className="hover:bg-slate-50 transition group"
                    >
                      <td className="py-4 px-6">
                         <div className="flex items-center gap-3">
                           <div className={`p-2.5 rounded-xl ${isPositive ? 'bg-green-100 text-duma-green' : 'bg-red-50 text-red-600'}`}>
                             {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                           </div>
                           <span className="font-bold text-neutral-900">{txn.description}</span>
                         </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-500 whitespace-nowrap">
                        {new Date(txn.created_at || new Date()).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-6">
                         <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                           {txn.type}
                         </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-500">
                        {txn.payment_method || 'Manual'}
                      </td>
                      <td className={`py-4 px-6 text-right font-black text-lg ${isPositive ? 'text-duma-green' : 'text-red-600'}`}>
                         {isPositive ? '+' : '-'}${Number(txn.amount).toFixed(2)}
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-neutral-500">
                    <p className="font-bold text-lg mb-1">No transactions found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-slate-50 flex items-center justify-between text-sm font-semibold text-gray-500">
            <p>Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 && 's'}</p>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1.5 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1.5 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
