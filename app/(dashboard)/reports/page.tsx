'use client';
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { getDailySalesExpenseData, getExpenseBreakdownData, getWeeklyProfitData } from '../../../lib/analytics';
import { formatMarketMoney, useMarket } from '@/lib/market';

export default function ReportsScreen() {
  const { isLoading, transactions } = useAppContext();
  const { market } = useMarket();
  const salesData = getDailySalesExpenseData(transactions);
  const expensesData = getExpenseBreakdownData(transactions);
  const profitData = getWeeklyProfitData(transactions);

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans font-bold text-pesa-navy text-xl">Loading Reports...</div>;

  return (
    <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Reports & Analytics</h1>
          <p className="text-neutral-500 font-medium mt-1">Visualize your business performance across key metrics.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          
          <div className="space-y-8">
            {/* Sales Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Weekly Sales</h3>
              <div className="h-64 min-h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                    <Bar dataKey="sales" fill="#008751" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Profit trends */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Profit Trends</h3>
              <div className="h-64 min-h-64 w-full min-w-0 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }} />
                    <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#004aad" 
                      strokeWidth={4}
                      dot={{ fill: '#004aad', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#008751', stroke: 'none' }}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div>
            {/* Expenses Breakdown */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 h-full"
            >
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Expenses Breakdown</h3>
              <div className="flex flex-col items-center justify-center space-y-10">
                
                {/* Recharts Donut */}
                {expensesData.length > 0 ? (
                  <>
                    <div className="w-full max-w-64 h-64 min-h-64 min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expensesData}
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                            animationDuration={1500}
                            animationBegin={200}
                          >
                            {expensesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-4 w-full max-w-sm">
                      {expensesData.map(exp => (
                        <div key={exp.name} className="flex justify-between items-center gap-4 text-base sm:text-lg font-bold">
                          <div className="flex items-center gap-3 text-neutral-800 min-w-0">
                            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: exp.color }}></div>
                            <span className="truncate">{exp.name}</span>
                          </div>
                          <div className="text-pesa-navy shrink-0">{formatMarketMoney(exp.value, market)}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-sm font-semibold text-neutral-500">
                    Expense categories will appear after expenses are recorded.
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>
    </div>
  );
}
