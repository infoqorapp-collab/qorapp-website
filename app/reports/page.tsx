'use client';
import TopBar from '../components/ui/TopBar';
import BottomNav from '../components/ui/BottomNav';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function ReportsScreen() {
  const { isLoading } = useAppContext();

  const salesData = [
    { name: 'Mon', sales: 2000 },
    { name: 'Tue', sales: 3500 },
    { name: 'Wed', sales: 4000 },
    { name: 'Thu', sales: 1000 },
    { name: 'Fri', sales: 3500 },
    { name: 'Sat', sales: 5000 },
  ];

  const expensesData = [
    { name: 'Inventory', value: 450, color: '#1A7C49' },
    { name: 'Operation', value: 2000, color: '#DFB981' },
    { name: 'Transport', value: 1600, color: '#0E472D' },
  ];

  const profitData = [
    { name: 'Week 1', profit: 1000 },
    { name: 'Week 2', profit: 1200 },
    { name: 'Week 3', profit: 1500 },
    { name: 'Week 4', profit: 1900 },
  ];

  if (isLoading) return <div className="h-full bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-16">
      <TopBar title="Reports / Analytics" />

      <div className="flex-1 overflow-y-auto px-5 py-6 font-sans">
        
        {/* Sales Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Weekly Sales</h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" fill="#1A7C49" radius={[4, 4, 0, 0]} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Expenses Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">EXPENSES BREAKDOWN</h3>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            
            {/* Recharts Donut */}
            <div className="w-24 h-24 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesData}
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1500}
                    animationBegin={200}
                  >
                    {expensesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 flex-1 ml-2">
              {expensesData.map(exp => (
                <div key={exp.name} className="flex justify-between items-center text-sm font-bold">
                  <div className="flex items-center gap-2 text-neutral-800">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: exp.color }}></div> 
                    {exp.name}
                  </div>
                  <div>${exp.value >= 1000 ? `${(exp.value/1000).toFixed(1)}k` : exp.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Profit trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Profit trends</h3>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <div className="h-40 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitData}>
                  <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#0E472D" 
                    strokeWidth={4}
                    dot={{ fill: '#0E472D', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#DFB981', stroke: 'none' }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

      </div>

      <BottomNav />
    </div>
  );
}
