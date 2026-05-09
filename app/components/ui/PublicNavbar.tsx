'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    {
      label: 'Primary Goal',
      submenu: [
        { label: 'QR/USSD Payments', href: '/public-pages/qr-ussd' },
        { label: 'Inventory Management', href: '/public-pages/inventory' },
        { label: 'Expense Tracking', href: '/public-pages/expenses' },
        { label: 'Analytics', href: '/public-pages/analytics' }
      ]
    },
    {
      label: 'Feature Education',
      submenu: [
        { label: 'Retail Shops', href: '/login?service=retail' },
        { label: 'Restaurants & Bars', href: '/login?service=restaurants' },
        { label: 'Services & Salons', href: '/login?service=services' },
        { label: 'MSMEs', href: '/login?service=msme' }
      ]
    },
    {
      label: 'Market Relevance',
      submenu: [
        { label: 'Credit Access', href: '/login?service=credit' },
        { label: 'Savings', href: '/login?service=savings' },
        { label: 'Digital Footprint', href: '/login?service=digital-footprint' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Pricing', href: '/pricing' },
        { label: 'Support', href: '/support' },
        { label: 'BNR Compliance', href: '/compliance' }
      ]
    }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <svg viewBox="0 0 230 50" xmlns="http://www.w3.org/2000/svg" width="180" height="40">
            {/* Outer blue Q ring */}
            <circle cx="25" cy="25" r="19" fill="#1A6AFF" />
            {/* Inner white hole */}
            <circle cx="25" cy="25" r="11.5" fill="#ffffff" />
            {/* Arrow tail */}
            <polygon points="29,31 41,43 35.5,43 23.5,31" fill="#1A6AFF" />
            {/* Arrow tip notch */}
            <polygon points="35.5,43 41,43 41,37.5" fill="#ffffff" />
            {/* Wordmark */}
            <text x="54" y="33"
              fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
              fontWeight="800" fontSize="22" letterSpacing="2.5" fill="#0C1B33">
              QORAPP
            </text>
          </svg>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 font-semibold text-pesa-navy text-sm">
          {navItems.map((item, index) => (
            <div key={index} className="relative group">
              <button className="flex items-center space-x-1 hover:text-duma-blue transition py-2">
                <span>{item.label}</span>
                <ChevronDown size={16} className="group-hover:rotate-180 transition" />
              </button>

              {/* Desktop Dropdown */}
              <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {item.submenu.map((subitem, subindex) => (
                  <Link
                    key={subindex}
                    href={subitem.href}
                    className="block px-4 py-3 hover:bg-blue-50 hover:text-duma-blue transition first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                  >
                    {subitem.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center space-x-3 border-l border-gray-200 pl-8">
            <Link href="/login" className="px-6 py-2 border border-pesa-navy rounded font-bold hover:bg-slate-50 transition">
              Login
            </Link>
            <Link href="/login?register=true" className="px-6 py-2 bg-duma-green text-white rounded font-bold hover:bg-emerald-700 transition">
              Register
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-pesa-navy p-2 focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4 font-semibold text-pesa-navy">
              {navItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="flex items-center justify-between w-full py-2 hover:text-duma-blue transition"
                  >
                    <span>{item.label}</span>
                    <ChevronDown 
                      size={16} 
                      className={`transition ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Mobile Dropdown */}
                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 flex flex-col space-y-2 mt-2 border-l-2 border-blue-200"
                      >
                        {item.submenu.map((subitem, subindex) => (
                          <Link
                            key={subindex}
                            href={subitem.href}
                            onClick={() => setIsOpen(false)}
                            className="py-2 hover:text-duma-blue transition"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="pt-4 flex flex-col space-y-3 border-t border-gray-100">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 border border-pesa-navy rounded text-center font-bold hover:bg-slate-50 transition"
                >
                  Login
                </Link>
                <Link 
                  href="/login?register=true" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-duma-green text-white rounded text-center font-bold hover:bg-emerald-700 transition"
                >
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
