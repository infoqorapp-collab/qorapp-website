'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pesa-navy to-slate-900 flex items-center justify-center">
            <svg viewBox="0 0 230 50" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              {/* Outer pesa-navy Q ring */}
              <circle cx="25" cy="25" r="19" fill="#ffffff" />
              {/* Inner navy hole */}
              <circle cx="25" cy="25" r="11.5" fill="#001a4d" />
              {/* Arrow tail */}
              <polygon points="29,31 41,43 35.5,43 23.5,31" fill="#ffffff" />
              {/* Arrow tip notch */}
              <polygon points="35.5,43 41,43 41,37.5" fill="#001a4d" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pesa-navy to-slate-800 bg-clip-text text-transparent">QORAPP</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1 font-semibold text-slate-700 text-sm">
          <Link href="/#solutions" className="px-4 py-2 rounded-lg hover:text-pesa-navy hover:bg-slate-100 transition-all duration-200">
            Solutions
          </Link>
          <Link href="/#features" className="px-4 py-2 rounded-lg hover:text-pesa-navy hover:bg-slate-100 transition-all duration-200">
            Features
          </Link>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link 
            href="/login" 
            className="px-6 py-2.5 border-2 border-pesa-navy text-pesa-navy rounded-lg font-semibold hover:bg-slate-50 transition-all duration-200 hover:shadow-md"
          >
            Login
          </Link>
          <Link 
            href="/login" 
            className="px-6 py-2.5 bg-gradient-to-r from-duma-green to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-duma-green/20 transition-all duration-200 transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-pesa-navy p-2 hover:bg-slate-100 rounded-lg transition-colors"
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
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-2 font-semibold text-slate-700">
              <Link 
                href="/#solutions" 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-lg hover:text-pesa-navy hover:bg-slate-100 transition-all"
              >
                Solutions
              </Link>
              <Link 
                href="/#features" 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-lg hover:text-pesa-navy hover:bg-slate-100 transition-all"
              >
                Features
              </Link>
              <div className="pt-4 flex flex-col space-y-2 border-t border-slate-200">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 border-2 border-pesa-navy text-pesa-navy rounded-lg text-center font-bold hover:bg-slate-50 transition-all"
                >
                  Login
                </Link>
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-gradient-to-r from-duma-green to-emerald-600 text-white rounded-lg text-center font-bold transition-all hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
