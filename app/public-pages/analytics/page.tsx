'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../../components/ui/PublicNavbar';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-purple-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Business Analytics & Insights
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Understand your business performance with powerful analytics. Make data-driven decisions to grow faster.
              </p>
              <Link 
                href="/login?service=analytics"
                className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
              >
                View Analytics
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
                <h3 className="text-xl font-bold text-slate-900 mb-3">Sales Dashboard</h3>
                <p className="text-slate-600">
                  Visual overview of daily, weekly, and monthly sales trends. Track growth patterns easily.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Performance Metrics</h3>
                <p className="text-slate-600">
                  Track key metrics: average transaction, top products, peak hours, and more.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Reports</h3>
                <p className="text-slate-600">
                  Generate detailed reports for any time period. Export to PDF or Excel for sharing.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Growth Insights</h3>
                <p className="text-slate-600">
                  Get actionable recommendations to improve sales and reduce costs.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-purple-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Make smarter business decisions</h2>
            <p className="text-lg text-slate-600 mb-8">
              Access real-time analytics and grow your business faster than ever before.
            </p>
            <Link 
              href="/login?service=analytics"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Explore Analytics
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
