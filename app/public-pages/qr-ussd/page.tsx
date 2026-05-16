'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../../components/ui/PublicNavbar';
import Link from 'next/link';

export default function QRUSSDPage() {
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
                QR & USSD Payment Solutions
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Accept payments instantly from any customer, anywhere in World. No internet required for USSD payments.
              </p>
              <Link 
                href="/login?service=qr-ussd"
                className="inline-block px-8 py-3 bg-pesa-navy text-white rounded-lg font-bold hover:bg-slate-800 transition"
              >
                Get Started with QR/USSD
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
                <h3 className="text-xl font-bold text-slate-900 mb-3">QR Code Payments</h3>
                <p className="text-slate-600">
                  Customers scan your unique QR code and complete payment instantly. Works both online and offline.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">USSD (No Internet)</h3>
                <p className="text-slate-600">
                  Customers dial a code (*000#) to pay. Works on any phone, no data or internet needed.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Settlement</h3>
                <p className="text-slate-600">
                  Money lands in your wallet immediately. No waiting, no hidden fees, no delays.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Tracking</h3>
                <p className="text-slate-600">
                  Monitor all payments in real-time. Get detailed reports and analytics instantly.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-slate-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to accept payments?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Sign up now and start accepting QR and USSD payments within minutes.
            </p>
            <Link 
              href="/login?service=qr-ussd"
              className="inline-block px-8 py-3 bg-pesa-navy text-white rounded-lg font-bold hover:bg-slate-800 transition"
            >
              Sign Up & Get Started
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
