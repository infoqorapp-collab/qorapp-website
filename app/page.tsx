'use client';
import { motion } from 'framer-motion';
import PublicNavbar from './components/ui/PublicNavbar';
import { formatMarketMoney, useMarket } from '@/lib/market';

export default function LandingPage() {
  const { market } = useMarket();

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-slate-900">
      <PublicNavbar />

      {/* SECTION 1: HERO */}
      <header className="relative pt-0 pb-12 overflow-hidden bg-white flex-1">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            
            <h1 className="hero-title mb-8">
              <span className="text-pesa-navy">Merchant Operating <br/> System</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              A professional business banking and management platform for MSMEs in every market. Fast, affordable, and secure tools to help you receive payments and track growth in your local currency.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
              <a href="/login" className="px-10 py-4 bg-gradient-to-r from-pesa-navy to-slate-800 text-white text-center rounded-xl font-bold text-lg shadow-xl shadow-slate-200 hover:shadow-2xl transition-all transform hover:scale-105">
                Onboard Now
              </a>
              <a href="#solutions" className="px-10 py-4 border-2 border-slate-200 text-slate-700 text-center rounded-xl font-bold text-lg hover:bg-slate-50 transition">
                Explore Services
              </a>
            </div>
            <div className="flex items-center space-x-3 text-slate-500">
              <i className="fa-solid fa-building-columns text-pesa-navy"></i>
              <span className="text-sm font-semibold">
                Showing prices for {market.country} in {market.currency}. Example sale: {formatMarketMoney(125, market)}.
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-slate-50 to-slate-100 rounded-[40px] blur-3xl opacity-50"></div>
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
            <img
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1000&auto=format&fit=crop"
              className="rounded-3xl shadow-2xl w-full h-auto object-cover"
              alt="Smart Inventory Management - Real-time stock tracking and management"
              loading="lazy"
            />
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
      <footer className="bg-slate-900 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pesa-navy to-slate-800 flex items-center justify-center">
                  <svg viewBox="0 0 230 50" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                    <circle cx="25" cy="25" r="19" fill="#ffffff" />
                    <circle cx="25" cy="25" r="11.5" fill="#001a4d" />
                    <polygon points="29,31 41,43 35.5,43 23.5,31" fill="#ffffff" />
                    <polygon points="35.5,43 41,43 41,37.5" fill="#001a4d" />
                  </svg>
                </div>
                <span className="text-2xl font-bold">QORAPP</span>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Merchant operating system with professional banking and management tools for MSMEs to receive payments and track business growth in their local market.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-pesa-navy transition-colors">
                  <i className="fab fa-twitter text-slate-400 hover:text-white"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-pesa-navy transition-colors">
                  <i className="fab fa-linkedin text-slate-400 hover:text-white"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-pesa-navy transition-colors">
                  <i className="fab fa-facebook text-slate-400 hover:text-white"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-pesa-navy transition-colors">
                  <i className="fab fa-instagram text-slate-400 hover:text-white"></i>
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Products</h3>
              <ul className="space-y-3">
                <li><a href="/public-pages/qr-ussd" className="text-slate-400 hover:text-white transition-colors">QR/USSD Payments</a></li>
                <li><a href="/public-pages/inventory" className="text-slate-400 hover:text-white transition-colors">Inventory Management</a></li>
                <li><a href="/public-pages/analytics" className="text-slate-400 hover:text-white transition-colors">Business Analytics</a></li>
                <li><a href="/public-pages/expenses" className="text-slate-400 hover:text-white transition-colors">Expense Tracking</a></li>
                <li><a href="/compliance" className="text-slate-400 hover:text-white transition-colors">Compliance Tools</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="/support" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/support" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/pricing" className="text-slate-400 hover:text-white transition-colors">Investors</a></li>
                <li><a href="/support" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/support" className="text-slate-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-slate-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pesa-navy rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-white"></i>
                </div>
                <div>
                  <p className="font-semibold">{market.officeLabel}</p>
                  <p className="text-slate-400 text-sm">Regional support</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pesa-navy rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-phone text-white"></i>
                </div>
                <div>
                  <p className="font-semibold">{market.supportPhone}</p>
                  <p className="text-slate-400 text-sm">Support Hotline</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pesa-navy rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-white"></i>
                </div>
                <div>
                  <p className="font-semibold">{market.supportEmail}</p>
                  <p className="text-slate-400 text-sm">Business Inquiries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-slate-400 text-sm">© 2026 QORAPP Global. All rights reserved.</p>
                <div className="flex items-center space-x-4 text-xs">
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
                  <span className="text-slate-600">•</span>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
                  <span className="text-slate-600">•</span>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-400 text-sm">All systems operational</span>
                </div>
                <div className="text-slate-500 text-sm">Built for international commerce</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
