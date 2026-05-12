'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../../components/ui/PublicNavbar';
import Link from 'next/link';

export default function GrowthPage() {
  const growthOptions = [
    {
      title: 'Working Capital Loans',
      description: 'Get credit based on your sales history',
      details: 'Fast approval, flexible repayment terms, and no collateral required. Build credit history with every transaction.',
      icon: 'fas fa-money-bill-wave',
      href: '/login?service=credit',
      color: 'from-pesa-navy to-slate-800'
    },
    {
      title: 'Merchant Savings Wallet',
      description: 'Save for your business future',
      details: 'Set aside profits automatically with interest-bearing savings. Emergency fund for unexpected business challenges.',
      icon: 'fas fa-piggy-bank',
      href: '/login?service=savings',
      color: 'from-pesa-navy to-slate-800'
    },
    {
      title: 'Financial Inclusion',
      description: 'Join Rwanda\'s digital economy',
      details: 'Build your digital business profile. Access tax visibility tools. Create formal business records for growth.',
      icon: 'fas fa-chart-line',
      href: '/login?service=digital-footprint',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-emerald-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Future Financial Services from QORAPP
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Coming in Phase 3. Access credit, build savings, and achieve financial inclusion. Grow beyond payments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Growth Options */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {growthOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10`}></div>
                  
                  {/* Content */}
                  <div className="relative p-8 bg-white bg-opacity-95 h-full flex flex-col">
                    <div className="w-16 h-16 bg-gradient-to-br from-pesa-navy to-slate-800 rounded-2xl flex items-center justify-center mb-4">
                      <i className={`${option.icon} text-2xl text-white`}></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{option.title}</h3>
                    <p className="text-slate-600 font-semibold mb-4">{option.description}</p>
                    <p className="text-slate-600 text-sm mb-8 flex-grow">{option.details}</p>
                    
                    <Link 
                      href={option.href}
                      className={`block py-3 px-4 text-white rounded-lg font-bold text-center bg-gradient-to-r ${option.color} hover:shadow-lg transition`}
                    >
                      Learn More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why Choose QORAPP?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-pesa-navy mb-3">0.4%</div>
                <p className="text-slate-600">Lowest transaction fees in Rwanda. No hidden charges.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-pesa-navy mb-3">3 Phases</div>
                <p className="text-slate-600">Payments today. Inventory & analytics tomorrow. Credit & savings coming.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-purple-600 mb-3">Regulated</div>
                <p className="text-slate-600">Licensed by Central Bank of Rwanda. Your business data is safe.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-emerald-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to grow your business?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Join QORAPP today and start accepting payments, managing inventory, and planning for the future.
            </p>
            <Link 
              href="/login"
              className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
