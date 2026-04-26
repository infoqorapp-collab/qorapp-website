'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from './context/AppContext';
import { motion } from 'framer-motion';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [businessName, setBusinessName] = useState('');
  const { login } = useAppContext();
  const router = useRouter();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(phone, businessName || 'My Business');
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col flex-1 mt-10"
      >
        <h1 className="text-2xl font-bold text-center mb-10 text-neutral-900 tracking-wider">LOGIN / SIGN UP</h1>
        
        <form onSubmit={handleContinue} className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-1">Phone number</label>
            <input 
              required
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-[#0E472D]/20 focus:border-[#0E472D] transition-all bg-gray-50/50"
              placeholder="Phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-1">OTP verification</label>
            <input 
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-[#0E472D]/20 focus:border-[#0E472D] transition-all bg-gray-50/50"
              placeholder="OTP verification"
            />
            <p className="text-xs text-gray-400 mt-1">Request new password • receive via SMS</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-neutral-800 mb-1">Business Name</label>
            <input 
              required
              type="text"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-[#0E472D]/20 focus:border-[#0E472D] transition-all bg-gray-50/50"
              placeholder="Business Name"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            className="w-full mt-4 text-white font-bold text-lg py-4 rounded-[2rem] shadow-xl transition-all"
            style={{ background: 'linear-gradient(135deg, #DFB981 0%, #B89565 100%)' }}
          >
            Continue
          </motion.button>
          
          <div className="text-center mt-6">
            <button type="button" className="text-sm font-medium text-neutral-600 hover:text-black">
              Login or <span className="font-bold underline text-[#0E472D]">Create account</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
