'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/ui/PublicNavbar';
import Link from 'next/link';

export default function SupportPage() {
  const supportChannels = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      icon: 'fas fa-comments',
      action: 'Start Chat',
      href: '#chat'
    },
    {
      title: 'Email Support',
      description: 'Send us your questions and concerns',
      availability: 'Response within 2 hours',
      icon: 'fas fa-envelope',
      action: 'Email Us',
      href: 'infoqorapp@gmail.com'
    },
    {
      title: 'Phone Support',
      description: 'Call our support team directly',
      availability: 'Mon-Fri 8AM-6PM EAT',
      icon: 'fas fa-phone',
      action: 'Call Now',
      href: 'tel:+250791 801 416'
    },
    {
      title: 'WhatsApp',
      description: 'Quick support via WhatsApp',
      availability: 'Available 24/7',
      icon: 'fab fa-whatsapp',
      action: 'WhatsApp Us',
      href: 'https://wa.me/250788000000'
    }
  ];

  const commonIssues = [
    {
      category: 'Getting Started',
      items: [
        'How do I create an account?',
        'How do I verify my phone number?',
        'How long does onboarding take?',
        'What documents do I need?'
      ]
    },
    {
      category: 'Payments',
      items: [
        'How do I accept payments?',
        'When will I receive my money?',
        'What are the transaction fees?',
        'Can I refund a payment?'
      ]
    },
    {
      category: 'Security',
      items: [
        'Is my data safe?',
        'How do I reset my password?',
        'What if my account is compromised?',
        'How is data encrypted?'
      ]
    },
    {
      category: 'Billing',
      items: [
        'How am I charged?',
        'Can I change my plan?',
        'Do you offer refunds?',
        'What payment methods do you accept?'
      ]
    }
  ];

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
                QORAPP Support
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                We're here to help. Reach out via your preferred channel and we'll respond quickly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {supportChannels.map((channel, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition"
                >
                  <div className="w-16 h-16 bg-pesa-navy rounded-2xl flex items-center justify-center mb-4">
                    <i className={`${channel.icon} text-2xl text-white`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{channel.title}</h3>
                  <p className="text-slate-600 mb-2">{channel.description}</p>
                  <p className="text-sm text-slate-500 mb-6">{channel.availability}</p>
                  
                  <a
                    href={channel.href}
                    className="inline-block px-6 py-2 bg-pesa-navy text-white rounded-lg font-bold hover:bg-slate-800 transition"
                  >
                    {channel.action}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Issues */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Common Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {commonIssues.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white rounded-lg border border-gray-200"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{section.category}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start text-slate-600 text-sm">
                        <span className="mr-3 mt-1">
                          <svg className="w-5 h-5 text-pesa-navy" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Still need help?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Our support team is ready to help. Don't hesitate to reach out.
            </p>
            <a
              href="infoqorapp@gmail.com"
              className="inline-block px-8 py-3 bg-pesa-navy text-white rounded-lg font-bold hover:bg-slate-800 transition"
            >
              Contact Support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
