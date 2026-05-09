'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../../components/ui/PublicNavbar';
import Link from 'next/link';

export default function HelpPage() {
  const helpItems = [
    {
      title: 'Pricing',
      description: 'Transparent, affordable plans for all business sizes',
      details: [
        'Free startup plan - perfect for testing',
        'Essential - RWF 5,000/month with 2% transaction fee',
        'Professional - RWF 15,000/month with 1.5% transaction fee',
        'Enterprise - Custom pricing for high volume'
      ],
      href: '/pricing',
      color: 'blue'
    },
    {
      title: 'Support',
      description: 'Get help when you need it',
      details: [
        'Live chat support 24/7',
        'Email support (support@QORAPP.rw)',
        'Phone support (+250 788 XXX XXX)',
        'Video tutorials and documentation'
      ],
      href: '/support',
      color: 'green'
    },
    {
      title: 'BNR Compliance',
      description: 'Regulated and trusted by Rwanda',
      details: [
        'Licensed by Central Bank of Rwanda',
        'ISO 27001 certified data security',
        'GDPR compliant for data protection',
        'Annual audits for transparency'
      ],
      href: '/compliance',
      color: 'purple'
    }
  ];

  const colorClasses = {
    blue: 'from-blue-400 to-blue-600 text-blue-600',
    green: 'from-green-400 to-green-600 text-green-600',
    purple: 'from-purple-400 to-purple-600 text-purple-600'
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Help & Support
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                We're here to help. Get pricing info, support, and learn about our compliance standards.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Help Items */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {helpItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition"
                >
                  <h3 className={`text-2xl font-bold mb-3 ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                    {item.title}
                  </h3>
                  <p className="text-slate-600 font-semibold mb-6">{item.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {item.details.map((detail, i) => (
                      <li key={i} className="flex items-start text-slate-600 text-sm">
                        <span className="mr-3 mt-1">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href={item.href}
                    className={`block py-3 px-4 text-white rounded-lg font-bold text-center bg-gradient-to-r ${colorClasses[item.color as keyof typeof colorClasses].replace('text-', 'from-')} hover:shadow-lg transition`}
                  >
                    Learn More
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {[
                {
                  q: 'How long does onboarding take?',
                  a: 'Usually less than 5 minutes. Just provide your phone number and business details.'
                },
                {
                  q: 'Is there a setup fee?',
                  a: 'No. QORAPP is completely free to set up. You only pay transaction fees when you receive payments.'
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes. You can cancel your subscription anytime with no penalties or hidden fees.'
                },
                {
                  q: 'Is my data safe?',
                  a: 'Absolutely. We use enterprise-grade encryption and are audited by the Central Bank of Rwanda.'
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

        {/* Contact CTA */}
        <section className="py-16 px-6 bg-blue-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Still have questions?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Contact our support team. We're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@QORAPP.rw"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Email Support
              </a>
              <a 
                href="https://wa.me/250788000000"
                className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
