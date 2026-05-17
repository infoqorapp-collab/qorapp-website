'use client';
import { motion, Variants } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { formatMarketMoney, useMarket } from '@/lib/market';
import Link from 'next/link';

export default function InsightsScreen() {
  const { transactions } = useAppContext();
  const { market } = useMarket();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  // Date ranges for this week and previous week
  const now = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const oneDayMs = 24 * 60 * 60 * 1000;
  const weekStart = new Date(startOfToday.getTime() - 6 * oneDayMs);
  const prevWeekStart = new Date(weekStart.getTime() - 7 * oneDayMs);
  const prevWeekEnd = new Date(weekStart.getTime() - oneDayMs);

  const sumRange = (start: Date, end: Date, type: 'sale' | 'expense') => {
    return (transactions || []).reduce((sum, t) => {
      const created = t.created_at ? new Date(t.created_at) : new Date(0);
      if (created >= start && created <= end && t.type === type) {
        return sum + Number(t.amount || 0);
      }
      return sum;
    }, 0);
  };

  const thisWeekSales = sumRange(weekStart, now, 'sale');
  const prevWeekSales = sumRange(prevWeekStart, prevWeekEnd, 'sale');
  const salesChange = prevWeekSales === 0 ? null : ((thisWeekSales - prevWeekSales) / prevWeekSales) * 100;

  // Expense breakdown by description/category
  const expenseTxns = (transactions || []).filter(t => t.type === 'expense');
  const totalExpenses = expenseTxns.reduce((s, t) => s + Number(t.amount || 0), 0);
  const expenseByCategory: Record<string, number> = {};
  expenseTxns.forEach(t => {
    const key = (t.description || 'Other').trim() || 'Other';
    expenseByCategory[key] = (expenseByCategory[key] || 0) + Number(t.amount || 0);
  });
  const topExpenseCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];

  // Top selling product by total sales amount
  const saleTxns = (transactions || []).filter(t => t.type === 'sale');
  const salesByProduct: Record<string, number> = {};
  saleTxns.forEach(t => {
    const key = (t.description || 'Unknown').trim() || 'Unknown';
    salesByProduct[key] = (salesByProduct[key] || 0) + Number(t.amount || 0);
  });
  const topProduct = Object.entries(salesByProduct).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-pesa-navy tracking-tight">AI Insights & Analytics</h1>
        <p className="text-neutral-500 font-medium mt-1">Smart recommendations based on your store's performance.</p>
      </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2 4 4 8-8 4 4"/></svg>
            </div>
            <p className="text-lg font-bold text-neutral-800 leading-snug">
              {salesChange === null ? (
                <>Sales this week: <span className="text-duma-green font-extrabold text-xl">{formatMarketMoney(thisWeekSales, market)}</span></>
              ) : (
                <>Your sales changed <span className="text-duma-green font-extrabold text-xl">{salesChange >= 0 ? '+' : ''}{salesChange.toFixed(1)}%</span> vs last week.</>
              )}
            </p>
          </motion.div>
          
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <p className="text-lg font-bold text-neutral-800 leading-snug">
              {topExpenseCategory ? (
                <>Top expense: <span className="text-duma-green font-extrabold text-xl">{topExpenseCategory[0]}</span> ({totalExpenses > 0 ? `${((topExpenseCategory[1] / totalExpenses) * 100).toFixed(0)}%` : '–'})</>
              ) : (
                <>No expenses recorded yet.</>
              )}
            </p>
          </motion.div>
          
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/></svg>
            </div>
            <p className="text-lg font-bold text-neutral-800 leading-snug">
              {topProduct ? (
                <>Top product: <span className="text-duma-green font-extrabold text-xl">{topProduct[0]}</span> — {formatMarketMoney(topProduct[1], market)}</>
              ) : (
                <>No sales recorded yet.</>
              )}
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <Link href="/reports" className="w-full max-w-md bg-duma-green text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-emerald-700 transition text-center">
            View Detailed Analysis
          </Link>
        </motion.div>
    </div>
  );
}
