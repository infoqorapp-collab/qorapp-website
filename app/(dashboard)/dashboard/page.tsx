'use client';

import { useAppContext } from '../../context/AppContext';
import {
  Bell,
  DollarSign,
  Activity,
  LogOut,
  Package2,
  TriangleAlert,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Receipt,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getDailySalesExpenseData, getTodaysTransactions } from '../../../lib/analytics';

type AlertItem = {
  id: string;
  title: string;
  detail: string;
  tone: 'danger' | 'warning' | 'info';
};

export default function Dashboard() {
  const {
    todaysSales,
    todaysProfit,
    walletBalance,
    cashBalance,
    mobileBankBalance,
    isLoading,
    logout,
    transactions,
    inventory,
    user,
    notifications,
    markNotificationRead,
  } = useAppContext();
  const router = useRouter();

  const todaysTransactions = getTodaysTransactions(transactions);
  const salesTxns = todaysTransactions.filter((txn) => txn.type === 'sale');
  const expenseTxns = todaysTransactions.filter((txn) => txn.type === 'expense');
  const lowStockItems = inventory.filter((item) => item.stock < 50);
  const outOfStockItems = inventory.filter((item) => item.stock <= 0);
  const fullStockItems = inventory.filter((item) => item.stock >= 50);

  const totalOrders = salesTxns.length;
  const avgOrderValue = totalOrders ? todaysSales / totalOrders : 0;
  const totalExpenses = expenseTxns.reduce((sum, txn) => sum + Number(txn.amount), 0);
  const totalStockUnits = inventory.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  const profitMargin = todaysSales > 0 ? (todaysProfit / todaysSales) * 100 : 0;
  const salesVsExpensesData = getDailySalesExpenseData(transactions);
  const yesterday = salesVsExpensesData[salesVsExpensesData.length - 2];
  const today = salesVsExpensesData[salesVsExpensesData.length - 1];
  const salesGrowth = yesterday?.sales
    ? ((today.sales - yesterday.sales) / yesterday.sales) * 100
    : today?.sales > 0 ? 100 : 0;

  const paymentMap = salesTxns.reduce<Record<string, number>>((acc, txn) => {
    const key = txn.payment_method || 'Other';
    acc[key] = (acc[key] || 0) + Number(txn.amount);
    return acc;
  }, {});

  const paymentMix = Object.entries(paymentMap)
    .map(([method, amount]) => ({
      method,
      amount,
      share: todaysSales > 0 ? (amount / todaysSales) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const alerts: AlertItem[] = [];

  if (outOfStockItems.length > 0) {
    alerts.push({
      id: 'out-of-stock',
      title: 'Restock urgently',
      detail: `${outOfStockItems.length} item${outOfStockItems.length > 1 ? 's are' : ' is'} out of stock.`,
      tone: 'danger',
    });
  }

  if (lowStockItems.length > 0) {
    alerts.push({
      id: 'low-stock',
      title: 'Low stock watch',
      detail: `${lowStockItems.length} product${lowStockItems.length > 1 ? 's need' : ' needs'} attention before the next rush.`,
      tone: 'warning',
    });
  }

  if (expenseTxns.length > salesTxns.length) {
    alerts.push({
      id: 'expense-heavy',
      title: 'Expenses are active',
      detail: `You logged ${expenseTxns.length} expenses against ${salesTxns.length} sales today.`,
      tone: 'info',
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'steady',
      title: 'Shop is running smoothly',
      detail: 'No urgent stock or cashflow alerts right now.',
      tone: 'info',
    });
  }

  const recentActivity = transactions.slice(0, 6).map((txn) => ({
    ...txn,
    isPositive: txn.type === 'sale' || txn.type === 'transfer_in',
  }));

  const notificationCards = notifications.slice(0, 4).map((notification) => ({
    id: notification.id,
    title: notification.title,
    detail: notification.message,
    tone: notification.is_read ? 'info' as const : notification.type === 'money_received' ? 'info' as const : 'warning' as const,
    href: notification.href || '/notifications',
    isDatabaseNotification: true,
  }));

  const visibleNotifications = notificationCards.length > 0
    ? notificationCards
    : alerts.map((alert) => ({ ...alert, href: '/notifications', isDatabaseNotification: false }));

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 font-sans font-bold text-pesa-navy text-xl">Loading Dashboard...</div>;
  }

  const alertToneClasses: Record<AlertItem['tone'], string> = {
    danger: 'border-red-200 bg-red-50 text-red-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-green-200 bg-green-50 text-green-900',
  };

  const statCards = [
    {
      label: 'Orders',
      value: totalOrders.toString(),
      helper: `${fullStockItems.length} products well stocked`,
      icon: ShoppingBag,
      tone: 'bg-white',
    },
    {
      label: 'Avg. Order',
      value: `$${avgOrderValue.toFixed(0)}`,
      helper: `${profitMargin.toFixed(0)}% margin`,
      icon: Receipt,
      tone: 'bg-blue-50',
    },
    {
      label: 'Expenses',
      value: `$${totalExpenses.toFixed(0)}`,
      helper: `${lowStockItems.length} low stock`,
      icon: TriangleAlert,
      tone: 'bg-white',
    },
    {
      label: 'Stock Units',
      value: totalStockUnits.toString(),
      helper: `${inventory.length} items tracked`,
      icon: Package2,
      tone: 'bg-green-50',
    },
  ];

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl md:rounded-[2rem] bg-pesa-navy p-4 sm:p-6 lg:p-8 text-white mb-6 lg:mb-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent_40%),radial-gradient(circle_at_left,_rgba(255,255,255,0.02),_transparent_30%)]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="rounded-full bg-white/10 p-3 text-duma-green shadow-inner">
              <Wallet size={28} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">Total Balance</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                $<CountUp end={walletBalance} duration={1.6} decimals={2} separator="," />
              </h2>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <button onClick={() => router.push('/record-sale')} className="w-full sm:w-auto bg-duma-green hover:bg-emerald-600 transition-colors text-white rounded-full px-6 py-3 font-bold text-sm shadow-lg shadow-green-900/20">
               + Record Sale
             </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 lg:gap-6"
        >
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm shadow-inner">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm font-bold text-slate-400">Today's Sales</p>
                 <h2 className="mt-2 text-3xl font-black tracking-tight">
                   $<CountUp end={todaysSales} duration={1.8} separator="," />
                 </h2>
               </div>
               <div className="rounded-xl bg-green-500/10 px-3 py-1.5 text-right flex items-center gap-1 text-sm font-bold text-green-400">
                 <ArrowUpRight size={16} />
                 {salesGrowth.toFixed(1)}%
               </div>
             </div>
          </div>
          
          <div className={`rounded-2xl border border-white/5 p-6 backdrop-blur-sm shadow-inner transition-colors ${todaysProfit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
             <p className={`text-sm font-bold ${todaysProfit >= 0 ? 'text-green-200' : 'text-red-200'}`}>Today's Profit</p>
             <h2 className={`mt-2 text-3xl font-black tracking-tight ${todaysProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
               {todaysProfit >= 0 ? '+' : '-'}$<CountUp end={Math.abs(todaysProfit)} duration={2.1} separator="," />
             </h2>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm shadow-inner">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm font-bold text-slate-400">Cash Balance</p>
                 <h2 className="mt-2 text-3xl font-black tracking-tight">
                   $<CountUp end={cashBalance} duration={1.8} separator="," />
                 </h2>
               </div>
               <div className="rounded-xl bg-blue-500/10 px-3 py-1.5 text-right flex items-center gap-1 text-sm font-bold text-blue-400">
                 <Wallet size={16} />
               </div>
             </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm shadow-inner">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm font-bold text-slate-400">Mobile Bank</p>
                 <h2 className="mt-2 text-3xl font-black tracking-tight">
                   $<CountUp end={mobileBankBalance} duration={1.8} separator="," />
                 </h2>
               </div>
               <div className="rounded-xl bg-purple-500/10 px-3 py-1.5 text-right flex items-center gap-1 text-sm font-bold text-purple-400">
                 <DollarSign size={16} />
               </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-6 lg:mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              className={`${card.tone} rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-black uppercase tracking-[0.1em] text-neutral-500">{card.label}</p>
                <div className="rounded-xl bg-neutral-900/5 p-2.5 text-neutral-700">
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-pesa-navy">{card.value}</p>
              <p className="mt-2 text-sm font-semibold text-neutral-500">{card.helper}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          
          {/* Charts Section */}
          <div className="rounded-3xl md:rounded-[2rem] bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
              <h3 className="text-xl font-black text-pesa-navy">Sales vs Expenses</h3>
              <select className="bg-slate-50 border border-gray-200 text-sm font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-duma-green/20">
                <option>Last 7 days</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesVsExpensesData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }} />
                  <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="sales" stroke="#008751" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#008751' }} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl md:rounded-[2rem] bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-pesa-navy">Recent Activity</h3>
            </div>

            <div className="overflow-x-auto qorapp-scrollbar">
              <table className="w-full min-w-[680px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <th className="pb-4 font-semibold">Transaction</th>
                    <th className="pb-4 font-semibold">Date</th>
                    <th className="pb-4 font-semibold">Method</th>
                    <th className="pb-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50 transition group">
                        <td className="py-4">
                           <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-xl ${txn.isPositive ? 'bg-green-100 text-duma-green' : 'bg-red-50 text-red-600'}`}>
                               {txn.isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                             </div>
                             <span className="font-bold text-neutral-900">{txn.description}</span>
                           </div>
                        </td>
                        <td className="py-4 text-sm font-semibold text-gray-500 whitespace-nowrap">
                          {new Date(txn.created_at || new Date()).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-sm font-semibold text-gray-500">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                            {txn.payment_method || 'Manual'}
                          </span>
                        </td>
                        <td className={`py-4 text-right font-black ${txn.isPositive ? 'text-duma-green' : 'text-red-600'}`}>
                           {txn.isPositive ? '+' : '-'}${Number(txn.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm font-semibold text-neutral-500 border-2 border-dashed border-gray-200 rounded-xl">
                        Your activity feed will update as soon as sales or expenses are recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {recentActivity.length > 0 && (
                <div className="mt-6 text-center">
                  <button onClick={() => router.push('/transactions')} className="text-sm font-bold text-duma-blue hover:text-blue-800 transition">
                    View All Transactions &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="space-y-8">
          <div className="rounded-3xl md:rounded-[2rem] bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-pesa-navy">Notifications</h3>
              <div className="rounded-full bg-duma-blue/10 px-3 py-1 text-xs font-black text-duma-blue">
                {notifications.filter((notification) => !notification.is_read).length || alerts.length} active
              </div>
            </div>

            <div className="space-y-3">
              {visibleNotifications.map((alert) => (
                <button
                  key={alert.id}
                  type="button"
                  onClick={async () => {
                    if (alert.isDatabaseNotification) {
                      await markNotificationRead(alert.id);
                    }
                    router.push(alert.href);
                  }}
                  className={`w-full text-left rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm ${alertToneClasses[alert.tone]}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-white/80 p-2">
                      <Bell size={16} />
                    </div>
                    <div>
                      <p className="font-bold">{alert.title}</p>
                      <p className="mt-1 text-sm font-semibold opacity-90">{alert.detail}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl md:rounded-[2rem] bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-pesa-navy mb-6">Inventory Watch</h3>
            <div className="space-y-3">
              {lowStockItems.length > 0 ? (
                lowStockItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-gray-100">
                    <div>
                      <p className="font-bold text-neutral-900">{item.name}</p>
                      <p className="text-xs font-black text-red-500 mt-0.5 uppercase tracking-wide">{item.status}</p>
                    </div>
                    <div className="rounded-lg bg-white shadow-sm border border-gray-100 px-3 py-1.5 text-sm font-black text-neutral-700">
                      {item.stock} left
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-800 border border-green-100 text-center">
                  All tracked products are comfortably stocked right now.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl md:rounded-[2rem] bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-pesa-navy mb-6">Payment Channels</h3>
            <div className="space-y-5">
              {paymentMix.length > 0 ? (
                paymentMix.map((item) => (
                  <div key={item.method}>
                    <div className="flex items-center justify-between text-sm font-bold text-neutral-700 mb-2">
                      <span>{item.method}</span>
                      <span>${item.amount.toFixed(0)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-duma-blue"
                        style={{ width: `${Math.max(item.share, 8)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-neutral-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-xl">Payment channels will appear here after sales are recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
