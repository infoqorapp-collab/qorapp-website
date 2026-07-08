'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { useAppContext, Transaction } from '../../context/AppContext';
import { formatMarketMoney, useMarket } from '@/lib/market';
import { parseSaleDescription, getPeriodSeries, summarizeProductSales } from '../../../lib/analytics';
import { Calendar, TrendingUp, TrendingDown, Package, Download, Banknote, Smartphone } from 'lucide-react';

type PeriodPreset = 'today' | '7d' | '30d' | '3m' | '6m' | '1y' | 'all' | 'custom';

const PERIOD_OPTIONS: { key: PeriodPreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '3m', label: '3 Months' },
  { key: '6m', label: '6 Months' },
  { key: '1y', label: '1 Year' },
  { key: 'all', label: 'All Time' },
  { key: 'custom', label: 'Custom' },
];

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

const getPresetRange = (preset: PeriodPreset, customStart: string, customEnd: string) => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfNow = new Date(now);
  endOfNow.setHours(23, 59, 59, 999);
  const oneDayMs = 24 * 60 * 60 * 1000;

  switch (preset) {
    case 'today':
      return { start: startOfToday, end: endOfNow };
    case '7d':
      return { start: new Date(startOfToday.getTime() - 6 * oneDayMs), end: endOfNow };
    case '30d':
      return { start: new Date(startOfToday.getTime() - 29 * oneDayMs), end: endOfNow };
    case '3m': {
      const start = new Date(startOfToday);
      start.setMonth(start.getMonth() - 3);
      return { start, end: endOfNow };
    }
    case '6m': {
      const start = new Date(startOfToday);
      start.setMonth(start.getMonth() - 6);
      return { start, end: endOfNow };
    }
    case '1y': {
      const start = new Date(startOfToday);
      start.setFullYear(start.getFullYear() - 1);
      return { start, end: endOfNow };
    }
    case 'all':
      return { start: new Date(2000, 0, 1), end: endOfNow };
    case 'custom': {
      const start = customStart ? new Date(`${customStart}T00:00:00`) : startOfToday;
      const end = customEnd ? new Date(`${customEnd}T23:59:59`) : endOfNow;
      return { start, end: end < start ? start : end };
    }
    default:
      return { start: startOfToday, end: endOfNow };
  }
};

const exportToCsv = (rows: Transaction[]) => {
  const header = ['Date', 'Type', 'Description', 'Payment Method', 'Amount (USD)'];
  const lines = rows.map((t) => [
    new Date(t.created_at).toISOString(),
    t.type,
    (t.description || '').replace(/"/g, '""'),
    t.payment_method,
    Number(t.amount || 0).toFixed(2),
  ].map((cell) => `"${cell}"`).join(','));

  const csv = [header.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `activity-export-${toDateInputValue(new Date())}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function InsightsScreen() {
  const { transactions, inventory } = useAppContext();
  const { market } = useMarket();

  const [preset, setPreset] = useState<PeriodPreset>('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  const { start, end } = useMemo(
    () => getPresetRange(preset, customStart, customEnd),
    [preset, customStart, customEnd]
  );

  const productNames = useMemo(() => {
    const names = new Set<string>();
    (transactions || []).forEach((t) => {
      if (t.type !== 'sale') return;
      const { product } = parseSaleDescription(t.description);
      if (product) names.add(product);
    });
    (inventory || []).forEach((item) => names.add(item.name));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [transactions, inventory]);

  const filteredTxns = useMemo(() => {
    return (transactions || [])
      .filter((t) => {
        const created = new Date(t.created_at);
        if (created < start || created > end) return false;
        if (selectedProduct !== 'all') {
          if (t.type !== 'sale') return false;
          const { product } = parseSaleDescription(t.description);
          return product === selectedProduct;
        }
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [transactions, start, end, selectedProduct]);

  const saleTxns = useMemo(() => filteredTxns.filter((t) => t.type === 'sale'), [filteredTxns]);
  const expenseTxns = useMemo(() => filteredTxns.filter((t) => t.type === 'expense'), [filteredTxns]);

  const totalSales = saleTxns.reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalExpenses = expenseTxns.reduce((s, t) => s + Number(t.amount || 0), 0);
  const netProfit = totalSales - totalExpenses;
  const unitsSold = saleTxns.reduce((s, t) => s + (parseSaleDescription(t.description).quantity || 0), 0);

  // Previous period of equal length, for the % change comparisons.
  const durationMs = Math.max(end.getTime() - start.getTime(), 24 * 60 * 60 * 1000);
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs);
  const prevTxns = (transactions || []).filter((t) => {
    const created = new Date(t.created_at);
    if (created < prevStart || created > prevEnd) return false;
    if (selectedProduct !== 'all') {
      if (t.type !== 'sale') return false;
      const { product } = parseSaleDescription(t.description);
      return product === selectedProduct;
    }
    return true;
  });
  const prevSales = prevTxns.filter((t) => t.type === 'sale').reduce((s, t) => s + Number(t.amount || 0), 0);
  const prevExpenses = prevTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
  const salesChange = prevSales === 0 ? null : ((totalSales - prevSales) / prevSales) * 100;
  const expenseChange = prevExpenses === 0 ? null : ((totalExpenses - prevExpenses) / prevExpenses) * 100;

  const chartData = useMemo(() => getPeriodSeries(filteredTxns, start, end), [filteredTxns, start, end]);
  const productBreakdown = useMemo(() => summarizeProductSales(saleTxns), [saleTxns]);
  const topProduct = productBreakdown[0];
  const currentStock = selectedProduct !== 'all'
    ? inventory.find((item) => item.name === selectedProduct)?.stock
    : undefined;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Business Insights</h1>
          <p className="text-neutral-500 font-medium mt-1">See everything you&apos;ve sold or spent, for any period you choose.</p>
        </div>
        <button
          onClick={() => exportToCsv(filteredTxns)}
          disabled={filteredTxns.length === 0}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-pesa-navy font-bold py-3 px-5 rounded-xl shadow-sm hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-2 mb-4 text-neutral-500">
          <Calendar size={16} />
          <span className="text-xs font-black uppercase tracking-widest">Period</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => setPreset(option.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                preset === option.key
                  ? 'border-duma-green bg-green-50 text-duma-green shadow-sm'
                  : 'border-gray-200 text-neutral-500 bg-white hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {preset === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5">From</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5">To</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-gray-100 mt-5 pt-5">
          <div className="flex items-center gap-2 mb-3 text-neutral-500">
            <Package size={16} />
            <span className="text-xs font-black uppercase tracking-widest">Product</span>
          </div>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full sm:w-80 border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition"
          >
            <option value="all">All products</option>
            {productNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
      >
        {selectedProduct === 'all' ? (
          <>
            <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Total Sales</p>
              <p className="text-2xl font-black text-pesa-navy">{formatMarketMoney(totalSales, market)}</p>
              {salesChange !== null && (
                <p className={`flex items-center gap-1 text-sm font-bold mt-2 ${salesChange >= 0 ? 'text-duma-green' : 'text-red-600'}`}>
                  {salesChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {salesChange >= 0 ? '+' : ''}{salesChange.toFixed(1)}% vs previous period
                </p>
              )}
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Total Expenses</p>
              <p className="text-2xl font-black text-pesa-navy">{formatMarketMoney(totalExpenses, market)}</p>
              {expenseChange !== null && (
                <p className={`flex items-center gap-1 text-sm font-bold mt-2 ${expenseChange <= 0 ? 'text-duma-green' : 'text-red-600'}`}>
                  {expenseChange <= 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                  {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}% vs previous period
                </p>
              )}
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Net Profit</p>
              <p className={`text-2xl font-black ${netProfit >= 0 ? 'text-duma-green' : 'text-red-600'}`}>{formatMarketMoney(netProfit, market)}</p>
              <p className="text-sm font-bold text-neutral-400 mt-2">{saleTxns.length} sale(s) recorded</p>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Top Product</p>
              {topProduct ? (
                <>
                  <p className="text-xl font-black text-pesa-navy truncate">{topProduct.name}</p>
                  <p className="text-sm font-bold text-duma-green mt-2">{formatMarketMoney(topProduct.revenue, market)}</p>
                </>
              ) : (
                <p className="text-sm font-bold text-neutral-400 mt-2">No sales in this period.</p>
              )}
            </motion.div>
          </>
        ) : (
          <>
            <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Units Sold</p>
              <p className="text-2xl font-black text-pesa-navy">{unitsSold}</p>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Revenue</p>
              <p className="text-2xl font-black text-pesa-navy">{formatMarketMoney(totalSales, market)}</p>
              {salesChange !== null && (
                <p className={`flex items-center gap-1 text-sm font-bold mt-2 ${salesChange >= 0 ? 'text-duma-green' : 'text-red-600'}`}>
                  {salesChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {salesChange >= 0 ? '+' : ''}{salesChange.toFixed(1)}% vs previous period
                </p>
              )}
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Number of Sales</p>
              <p className="text-2xl font-black text-pesa-navy">{saleTxns.length}</p>
              <p className="text-sm font-bold text-neutral-400 mt-2">
                Avg {formatMarketMoney(saleTxns.length ? totalSales / saleTxns.length : 0, market)} / sale
              </p>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Current Stock</p>
              <p className="text-2xl font-black text-duma-blue">{currentStock !== undefined ? currentStock : '—'}</p>
              <p className="text-sm font-bold text-neutral-400 mt-2">units remaining now</p>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Trend chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 mb-8"
      >
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
          Sales {selectedProduct === 'all' ? '& Expenses' : `— ${selectedProduct}`} Over Time
        </h3>
        {chartData.length > 0 ? (
          <div className="h-72 min-h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }} width={40} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  formatter={(value) => formatMarketMoney(Number(value), market)}
                />
                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
                <Bar dataKey="sales" name="Sales" fill="#008751" radius={[4, 4, 0, 0]} animationDuration={1200} />
                {selectedProduct === 'all' && (
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} animationDuration={1200} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-neutral-400 font-medium text-center py-12">No activity in this period yet.</p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Product breakdown, only meaningful across all products */}
        {selectedProduct === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Sales By Product</h3>
            {productBreakdown.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {productBreakdown.map((product, index) => (
                  <button
                    key={product.name}
                    onClick={() => setSelectedProduct(product.name)}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 hover:border-duma-green/40 hover:bg-green-50/40 transition text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-neutral-500 text-xs font-black flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-pesa-navy truncate">{product.name}</p>
                        <p className="text-xs text-neutral-400 font-semibold">{product.unitsSold} unit(s) · {product.saleCount} sale(s)</p>
                      </div>
                    </div>
                    <span className="font-black text-duma-green whitespace-nowrap">{formatMarketMoney(product.revenue, market)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-neutral-400 font-medium text-center py-12">No sales in this period yet.</p>
            )}
          </motion.div>
        )}

        {/* Activity log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className={`bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 ${selectedProduct !== 'all' ? 'xl:col-span-2' : ''}`}
        >
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Activity Log</h3>
          {filteredTxns.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredTxns.map((txn) => {
                const { quantity, product } = parseSaleDescription(txn.description);
                const isSale = txn.type === 'sale';
                return (
                  <div key={txn.id} className="flex items-center justify-between gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isSale ? 'bg-green-50 text-duma-green' : 'bg-red-50 text-red-500'}`}>
                        {txn.payment_method?.toLowerCase().includes('mobile') ? <Smartphone size={16} /> : <Banknote size={16} />}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-pesa-navy truncate">
                          {isSale ? (product || 'Sale') : (txn.description || 'Expense')}
                        </p>
                        <p className="text-xs text-neutral-400 font-semibold">
                          {new Date(txn.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {isSale && quantity ? ` · ${quantity} unit(s)` : ''}
                          {' · '}{txn.payment_method}
                        </p>
                      </div>
                    </div>
                    <span className={`font-black whitespace-nowrap ${isSale ? 'text-duma-green' : 'text-red-500'}`}>
                      {isSale ? '+' : '-'}{formatMarketMoney(Number(txn.amount || 0), market)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-400 font-medium text-center py-12">Nothing recorded for this period yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
