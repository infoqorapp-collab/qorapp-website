'use client';
import { motion } from 'framer-motion';
import PublicNavbar from './components/ui/PublicNavbar';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-slate-900">
      <PublicNavbar />

      {/* SECTION 1: HERO */}
      <header className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-white flex-1">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-blue-50 text-duma-blue px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
              Coming Soon: QORAPP RWANDA
            </div>
            <h1 className="hero-title mb-8">
              Rwanda's Complete <br/>
              <span className="text-duma-blue">Merchant Operating <br/> System</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              A professional business banking and management platform for MSMEs. Fast, affordable, and secure tools to help you receive payments and track growth.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
              <a href="/login" className="px-10 py-4 bg-duma-green text-white text-center rounded-xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-emerald-700 transition">
                Onboard Now
              </a>
              <a href="#solutions" className="px-10 py-4 border-2 border-slate-200 text-slate-700 text-center rounded-xl font-bold text-lg hover:bg-slate-50 transition">
                Explore Services
              </a>
            </div>
            <div className="flex items-center space-x-3 text-slate-500">
              <i className="fa-solid fa-building-columns text-duma-blue"></i>
              <span className="text-sm font-semibold">Trusted by Rwanda's emerging businesses. Regulated by Central Bank of Rwanda.</span>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-50 to-green-50 rounded-[40px] blur-3xl opacity-50"></div>
            <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000" className="relative rounded-[32px] shadow-2xl border-4 border-white" alt="Merchant POS" />
          </motion.div>
        </div>
      </header>

      {/* SECTION 2: SMART QR/USSD */}
      <section id="solutions" className="py-24 lg:py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1000" className="rounded-3xl shadow-2xl" alt="QR Payments" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="feature-title mb-6">Smart QR/USSD <br /> Payments</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">Accept payments instantly via mobile money or QR codes. Customers pay using USSD or by scanning your QR code. Get confirmed in seconds.</p>
            <ul className="space-y-4 benefit-list font-medium text-gray-700">
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>QR Code payments with instant confirmation</span></li>
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>USSD for customers without smartphones</span></li>
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Mobile money integrations</span></li>
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Fast settlements to your account</span></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: ANALYTICS */}
      <section id="features" className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="feature-title mb-6">Merchant Dashboard & <br /> Business Analytics</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">See your complete business at a glance. Daily sales reports, weekly performance tracking, and cash flow monitoring all in one place.</p>
            <ul className="space-y-4 benefit-list font-medium text-gray-700">
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Daily sales reports & revenue tracking</span></li>
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Weekly performance analysis</span></li>
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Cash flow monitoring</span></li>
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Business growth insights</span></li>
            </ul>
          </motion.div>
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000" className="rounded-3xl shadow-2xl" alt="Analytics" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: INVENTORY */}
      <section className="py-24 lg:py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://images.unsplash.com/photo-1633613286991-611bcfb63bff?q=80&w=1000" className="rounded-3xl shadow-2xl" alt="Inventory" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="feature-title mb-6">Smart Inventory <br /> Management</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">Track your stock in real-time. Get alerts when items are running low, and keep detailed purchase logs to manage your supply chain efficiently.</p>
            <ul className="space-y-4 benefit-list font-medium text-gray-700">
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Real-time product tracking</span></li>
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Low stock alerts</span></li>
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Purchase log history</span></li>
              <li className="flex items-center space-x-3"><i className="fa-regular fa-circle-check"></i> <span>Inventory-to-sales integration</span></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-pesa-navy text-white py-12 text-center">
        <p className="text-sm opacity-50 uppercase tracking-widest">QORAPP RWANDA © 2026</p>
      </footer>
    </div>
  );
}
