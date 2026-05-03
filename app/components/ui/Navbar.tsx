'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-3xl font-black tracking-tighter text-pesa-navy italic">
            duma<span className="text-red-600">pay</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 font-semibold text-pesa-navy text-sm">
          <Link href="/#solutions" className="hover:text-duma-blue transition">Solutions</Link>
          <Link href="/#features" className="hover:text-duma-blue transition">Features</Link>
          <Link href="/login" className="px-6 py-2 border border-pesa-navy rounded font-bold hover:bg-slate-50 transition">
            Login
          </Link>
          <Link href="/login" className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition">
            Register
          </Link>
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
              <Link 
                href="/#solutions" 
                onClick={() => setIsOpen(false)}
                className="hover:text-duma-blue transition"
              >
                Solutions
              </Link>
              <Link 
                href="/#features" 
                onClick={() => setIsOpen(false)}
                className="hover:text-duma-blue transition"
              >
                Features
              </Link>
              <div className="pt-4 flex flex-col space-y-3 border-t border-gray-100">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 border border-pesa-navy rounded text-center font-bold hover:bg-slate-50 transition"
                >
                  Login
                </Link>
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-red-600 text-white rounded text-center font-bold hover:bg-red-700 transition"
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
