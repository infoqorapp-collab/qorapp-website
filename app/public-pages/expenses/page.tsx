'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../../components/ui/PublicNavbar';
import Link from 'next/link';

export default function ExpensesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-orange-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Smart Expense Tracking
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Monitor every expense and understand your costs. Make smarter financial decisions and improve profitability.
              </p>
              <Link 
                href="/login?service=expenses"
                className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition"
              >
                Track Expenses Now
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Quick Entry</h3>
                <p className="text-slate-600">
                  Log expenses on the go. Simple, fast, and categorized for easy tracking.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Expense Categories</h3>
                <p className="text-slate-600">
                  Organize by type: rent, utilities, supplies, salaries, and more.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Profit Calculation</h3>
                <p className="text-slate-600">
                  Automatically calculate daily/monthly profit after all expenses.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Reports & Insights</h3>
                <p className="text-slate-600">
                  Get detailed reports to understand where your money goes.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-orange-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Know where your money goes</h2>
            <p className="text-lg text-slate-600 mb-8">
              Track expenses intelligently and increase your business profitability.
            </p>
            <Link 
              href="/login?service=expenses"
              className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
