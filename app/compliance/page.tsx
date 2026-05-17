'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/ui/PublicNavbar';

export default function CompliancePage() {
  const complianceItems = [
    {
      title: 'Central Bank of Rwanda License',
      description: 'QORAPP is fully licensed and regulated by the Central Bank of Rwanda',
      details: [
        'License No: CBR/FIS/2024/001',
        'Category: Money Transmitter',
        'Regulated under: National Bank of Rwanda Regulations',
        'Regular audits and compliance checks'
      ],
      icon: '🏦'
    },
    {
      title: 'Data Security (ISO 27001)',
      description: 'Enterprise-grade security standards for data protection',
      details: [
        'ISO 27001 certification',
        'AES-256 encryption for all data',
        'SSL/TLS for all communications',
        'Regular security audits and penetration testing'
      ],
      icon: 'fas fa-shield-alt'
    },
    {
      title: 'GDPR Compliance',
      description: 'Full compliance with General Data Protection Regulation',
      details: [
        'User data privacy protected',
        'Right to access and delete personal data',
        'Data processing agreements in place',
        'Privacy policy updated regularly'
      ],
      icon: 'fas fa-user-shield'
    },
    {
      title: 'AML/KYC Compliance',
      description: 'Anti-Money Laundering and Know Your Customer procedures',
      details: [
        'Comprehensive KYC verification process',
        'Transaction monitoring for suspicious activity',
        'Regular AML audits',
        'Compliance with Rwanda Revenue Authority'
      ],
      icon: 'fas fa-check-circle'
    }
  ];

  const certifications = [
    { name: 'ISO 27001', icon: 'fas fa-certificate' },
    { name: 'CBR License', icon: 'fas fa-university' },
    { name: 'GDPR', icon: 'fas fa-globe' },
    { name: 'AML Certified', icon: 'fas fa-check' }
  ];

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
                QORAPP: Security & Compliance
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                We take your security seriously. QORAPP is regulated by the Central Bank of Rwanda and complies with all major security standards.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Certifications</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-white rounded-lg border border-gray-200"
                >
                  <div className="w-16 h-16 bg-pesa-navy rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <i className={`${cert.icon} text-2xl text-white`}></i>
                  </div>
                  <p className="font-bold text-slate-900">{cert.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Details */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {complianceItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition"
                >
                  <div className="w-16 h-16 bg-pesa-navy rounded-2xl flex items-center justify-center mb-4">
                    <i className={`${item.icon} text-2xl text-white`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 mb-6">{item.description}</p>
                  
                  <ul className="space-y-3">
                    {item.details.map((detail, i) => (
                      <li key={i} className="flex items-start text-slate-600 text-sm">
                        <span className="mr-3 mt-1">
                          <svg className="w-5 h-5 text-pesa-navy" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Statement */}
        <section className="py-16 px-6 bg-purple-50">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg border border-purple-200 text-center"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Your Data is Safe</h2>
              <p className="text-lg text-slate-600 mb-6">
                QORAPP uses the same security technology as major banks. Your money and data are protected 24/7.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-pesa-navy mb-2">99.9%</div>
                  <p className="text-slate-600 text-sm">Uptime Guarantee</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pesa-navy mb-2">24/7</div>
                  <p className="text-slate-600 text-sm">Monitoring & Support</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
                  <p className="text-slate-600 text-sm">Data Redundancy</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact for Compliance Info */}
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Questions About Compliance?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Our compliance team is ready to answer any questions about security and regulatory compliance.
            </p>
            <a
              href="mailto:infoqorapp@gmail.com"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Contact Compliance Team
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
