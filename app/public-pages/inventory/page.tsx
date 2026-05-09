'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../../components/ui/PublicNavbar';
import Link from 'next/link';

export default function InventoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Smart Inventory Management
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Track stock, reduce waste, and optimize inventory. Get alerts before you run out and improve your bottom line.
              </p>
              <Link 
                href="/login?service=inventory"
                className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
              >
                Manage Inventory Now
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
                <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Stock Tracking</h3>
                <p className="text-slate-600">
                  Know exactly what you have at all times. Track inventory across multiple locations instantly.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Low Stock Alerts</h3>
                <p className="text-slate-600">
                  Get instant notifications when stock runs low. Never miss a reorder opportunity again.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Sales Integration</h3>
                <p className="text-slate-600">
                  Inventory updates automatically when you record sales. Keep accurate stock records effortlessly.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Detailed Analytics</h3>
                <p className="text-slate-600">
                  Understand what sells best. Make data-driven decisions about restocking and pricing.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-green-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Take control of your inventory</h2>
            <p className="text-lg text-slate-600 mb-8">
              Start tracking your stock smartly today. Reduce waste and increase profits.
            </p>
            <Link 
              href="/login?service=inventory"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
