'use client';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

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
    { name: 'Inventory', value: 450, color: '#008751' }, // dumaGreen
    { name: 'Operation', value: 2000, color: '#004aad' }, // dumaBlue
    { name: 'Transport', value: 1600, color: '#001a4d' }, // pesaNavy
  ];

  const profitData = [
    { name: 'Week 1', profit: 1000 },
    { name: 'Week 2', profit: 1200 },
    { name: 'Week 3', profit: 1500 },
    { name: 'Week 4', profit: 1900 },
  ];

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans font-bold text-pesa-navy text-xl">Loading Reports...</div>;

  return (
    <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Reports & Analytics</h1>
          <p className="text-neutral-500 font-medium mt-1">Visualize your business performance across key metrics.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-8">
            {/* Sales Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Weekly Sales</h3>
              <div className="h-64 w-full">
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
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Profit Trends</h3>
              <div className="h-64 w-full mt-2">
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
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full"
            >
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Expenses Breakdown</h3>
              <div className="flex flex-col items-center justify-center space-y-10">
                
                {/* Recharts Donut */}
                <div className="w-64 h-64">
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
                    <div key={exp.name} className="flex justify-between items-center text-lg font-bold">
                      <div className="flex items-center gap-3 text-neutral-800">
                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: exp.color }}></div> 
                        {exp.name}
                      </div>
                      <div className="text-pesa-navy">${exp.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
    </div>
  );
}
