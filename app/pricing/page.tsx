'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/ui/PublicNavbar';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Transaction Fee',
      price: '0.4',
      period: 'per transaction',
      description: 'Pay only for what you use',
      features: [
        'QR Code & USSD payments',
        'Instant payment confirmations',
        'Mobile money integrations',
        'Fast settlements',
        'Merchant dashboard',
        'Daily sales reports'
      ],
      cta: 'Start Free',
      ctaHref: '/login?service=qr-ussd',
      highlighted: true
    },
    {
      name: 'Phase 1 Included',
      price: 'Free',
      period: 'MVP Launch',
      description: 'Core platform features',
      features: [
        'Smart Payments system',
        'Merchant Dashboard',
        'Daily sales reports',
        'Weekly performance tracking',
        'Inventory Management',
        'Cash flow monitoring'
      ],
      cta: 'Join Pilot',
      ctaHref: '/login?service=inventory',
      highlighted: false
    },
    {
      name: 'Future: Credit Access',
      price: 'TBD',
      period: 'Phase 3',
      description: 'Working capital loans',
      features: [
        'Credit scoring based on transactions',
        'Loan amounts: varies',
        'Fast approval process',
        'Flexible repayment terms',
        'Growing credit limits',
        'No collateral required'
      ],
      cta: 'Learn More',
      ctaHref: '/login?service=credit',
      highlighted: false
    },
    {
      name: 'Future: Savings Wallet',
      price: 'TBD',
      period: 'Phase 3',
      description: 'Merchant savings tools',
      features: [
        'Secure savings accounts',
        'Interest-bearing deposits',
        'Emergency fund builder',
        'Business growth planning',
        'Mobile access',
        'Transparent rates'
      ],
      cta: 'Get Notified',
      ctaHref: '/login?service=savings',
      highlighted: false
    }
  ];

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
                QORAPP Pricing: 0.4% Per Transaction
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                No monthly subscriptions. No hidden fees. Pay only 0.4% on each payment. Start free, scale without limits.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg p-8 flex flex-col ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl transform lg:scale-105'
                      : 'bg-white border border-gray-200 hover:shadow-lg transition'
                  }`}
                >
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={plan.highlighted ? 'text-green-100' : 'text-slate-600'}>
                    {plan.description}
                  </p>
                  
                  <div className="my-6">
                    <div className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                      {plan.price}
                    </div>
                    <div className={plan.highlighted ? 'text-green-100' : 'text-slate-600'}>
                      {plan.period}
                    </div>
                  </div>

                  <ul className={`space-y-3 flex-grow mb-8 ${plan.highlighted ? 'text-green-50' : 'text-slate-600'}`}>
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-3">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaHref}
                    className={`block py-3 px-4 rounded-lg font-bold text-center transition ${
                      plan.highlighted
                        ? 'bg-white text-green-600 hover:bg-green-50'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Pricing FAQs</h2>
            
            <div className="space-y-6">
              {[
                {
                  q: 'Can I change plans anytime?',
                  a: 'Yes! You can upgrade or downgrade your plan anytime. Changes take effect immediately.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept mobile money (MTN, Airtel), bank transfers, and card payments.'
                },
                {
                  q: 'Is there a contract?',
                  a: 'No contracts. Pay month-to-month and cancel anytime. No penalties.'
                },
                {
                  q: 'What about transaction fees?',
                  a: 'Transaction fees depend on your plan (0% for Starter, 2% for Essential, 1.5% for Professional).'
                }
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-6 bg-white rounded-lg border border-gray-200"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-green-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to get started?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Choose a plan and start growing your business today.
            </p>
            <Link 
              href="/login"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
