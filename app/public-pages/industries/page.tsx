'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../../components/ui/PublicNavbar';
import Link from 'next/link';

export default function IndustriesPage() {
  const industries = [
    {
      name: 'Retail Shops',
      description: 'Complete payment & inventory solution for retail stores',
      features: ['QR & USSD payments', 'Stock tracking', 'Daily sales reports'],
      href: '/login?service=retail',
      color: 'bg-pesa-navy hover:bg-slate-800'
    },
    {
      name: 'Mini Markets',
      description: 'Affordable tools for small market operators',
      features: ['Easy payment collection', 'Quick inventory updates', 'Cash flow tracking'],
      href: '/login?service=mini-markets',
      color: 'bg-pesa-navy hover:bg-slate-800'
    },
    {
      name: 'Salons & Barbershops',
      description: 'Service business solution with digital payments',
      features: ['Payment collection', 'Service tracking', 'Client management'],
      href: '/login?service=salons',
      color: 'bg-pink-600 hover:bg-pink-700'
    },
    {
      name: 'Pharmacies',
      description: 'Medicine inventory management with payments',
      features: ['Stock alerts', 'Payment processing', 'Expiry tracking'],
      href: '/login?service=pharmacies',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      name: 'Food Vendors & Restaurants',
      description: 'Fast payment collection for food businesses',
      features: ['Mobile money integration', 'Sales tracking', 'Income reporting'],
      href: '/login?service=food-vendors',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      name: 'Market Traders',
      description: 'Simple digital tools for informal traders',
      features: ['Quick setup', 'Low transaction fees', 'Daily reconciliation'],
      href: '/login?service=market-traders',
      color: 'bg-yellow-600 hover:bg-yellow-700'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-indigo-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                QORAPP for Your Business
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Serving 300,000+ SMEs across World. Simple digital payment and inventory tools designed for your industry.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Industries Grid */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{industry.name}</h3>
                  <p className="text-slate-600 mb-6">{industry.description}</p>
                  
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-slate-500 mb-3">Key Features:</p>
                    <ul className="space-y-2">
                      {industry.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-slate-600">
                          <span className="w-2 h-2 bg-pesa-navy rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    href={industry.href}
                    className={`block py-3 px-4 text-white rounded-lg font-bold text-center ${industry.color} transition`}
                  >
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-indigo-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Not sure which is right for you?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Contact our team and we'll help you find the perfect solution for your business.
            </p>
            <Link 
              href="/login"
              className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
