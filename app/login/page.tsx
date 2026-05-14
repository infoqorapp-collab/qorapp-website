'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/ui/PublicNavbar';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [service, setService] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { sendOtp, verifyOtp } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const registerParam = searchParams.get('register');
    if (serviceParam) setService(serviceParam);
    if (registerParam) setIsRegister(true);
  }, [searchParams]);

  const redirectToDashboard = () => {
    if (service) {
      switch (service) {
        case 'inventory':
          router.push('/dashboard/inventory');
          break;
        case 'expenses':
          router.push('/dashboard/expense');
          break;
        case 'analytics':
          router.push('/dashboard/insights');
          break;
        case 'qr-ussd':
          router.push('/dashboard/record-sale');
          break;
        case 'wallet':
          router.push('/dashboard/wallet');
          break;
        default:
          router.push('/dashboard/inventory');
      }
    } else {
      router.push('/dashboard/inventory');
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus('Please enter a valid email address.');
      return;
    }

    setIsProcessing(true);
    setStatus('Sending OTP to your email...');

    const result = await sendOtp(email);
    if (result.error) {
      setStatus(result.error);
    } else {
      setIsOtpSent(true);
      setStatus(`OTP sent to ${email}. Copy the code from your inbox and paste it here.`);
    }

    setIsProcessing(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setStatus('Please enter the code sent to your email.');
      return;
    }

    setIsProcessing(true);
    setStatus('Verifying OTP...');

    const result = await verifyOtp(email, otp, businessName || 'My Business');
    if (result.error) {
      setStatus(result.error);
      setIsProcessing(false);
      return;
    }

    redirectToDashboard();
  };

  const handleContinue = (e: React.FormEvent) => {
    if (isOtpSent) {
      return handleVerifyOtp(e);
    }
    return handleRequestOtp(e);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />

      <div className="flex-1 flex">
        {/* Left Side - Get Started Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pesa-navy to-slate-800 flex-col justify-center items-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md text-center"
          >
            <h2 className="text-4xl font-bold mb-6 tracking-wide">
              Get Started
            </h2>
            <p className="text-lg mb-8 text-slate-200 leading-relaxed">
              Join thousands of businesses using QORAPP to manage their inventory, track expenses, and grow their operations with smart analytics.
            </p>
            <div className="mb-8">
              <div className="w-full h-64 bg-white/10 rounded-lg shadow-2xl p-6 flex items-center justify-center">
                <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="50" y="80" width="120" height="80" rx="8" fill="white" opacity="0.9"/>
                  <rect x="70" y="100" width="80" height="8" rx="4" fill="#001a4d"/>
                  <rect x="70" y="120" width="60" height="8" rx="4" fill="#64748b"/>
                  <rect x="70" y="140" width="40" height="8" rx="4" fill="#64748b"/>
                  <circle cx="110" cy="110" r="15" fill="#10b981"/>
                  <text x="110" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">✓</text>

                  <rect x="230" y="60" width="120" height="100" rx="8" fill="white" opacity="0.9"/>
                  <rect x="250" y="80" width="80" height="8" rx="4" fill="#001a4d"/>
                  <rect x="250" y="100" width="60" height="8" rx="4" fill="#64748b"/>
                  <rect x="250" y="120" width="70" height="8" rx="4" fill="#64748b"/>
                  <rect x="250" y="140" width="50" height="8" rx="4" fill="#64748b"/>
                  <circle cx="290" cy="90" r="15" fill="#3b82f6"/>
                  <text x="290" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">📊</text>

                  <rect x="140" y="180" width="120" height="80" rx="8" fill="white" opacity="0.9"/>
                  <rect x="160" y="200" width="80" height="8" rx="4" fill="#001a4d"/>
                  <rect x="160" y="220" width="60" height="8" rx="4" fill="#64748b"/>
                  <rect x="160" y="240" width="40" height="8" rx="4" fill="#64748b"/>
                  <circle cx="200" cy="210" r="15" fill="#f59e0b"/>
                  <text x="200" y="215" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">💰</text>

                  <circle cx="200" cy="50" r="25" fill="#10b981" opacity="0.8"/>
                  <text x="200" y="58" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Q</text>
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-duma-green mr-2"></i>
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-duma-green mr-2"></i>
                <span>Easy to Use</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-md"
          >
          <h1 className="text-2xl font-bold text-center mb-10 text-pesa-navy tracking-wider">
            {isRegister ? 'CREATE ACCOUNT' : 'LOGIN / SIGN UP'}
          </h1>

          {service && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-pesa-navy font-semibold">
                ✓ You're signing up to access <span className="capitalize">{service.replace('-', ' ')}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1">Email address</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition-all bg-gray-50/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1">Business Name</label>
              <input
                required
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition-all bg-gray-50/50"
                placeholder="Business Name"
              />
            </div>

            {isOtpSent && (
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1">OTP verification</label>
                <input
                  required
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition-all bg-gray-50/50"
                  placeholder="Enter code from email"
                />
                <p className="text-xs text-gray-400 mt-1">
                  We sent a one-time code to your email. Copy it from your inbox and paste it here.
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isProcessing}
              className="w-full mt-4 bg-gradient-to-r from-pesa-navy to-slate-800 text-white font-bold text-lg py-4 rounded-[2rem] shadow-xl shadow-slate-200 transition-all hover:bg-slate-900 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isOtpSent ? 'Verify OTP' : 'Send verification code'}
            </motion.button>

            {isOtpSent && (
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-sm font-medium text-neutral-600 hover:text-black"
                >
                  Resend code
                </button>
              </div>
            )}

            {status && <p className="text-sm text-center text-slate-500 mt-3">{status}</p>}
          </form>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LoginScreen() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-white">
        <PublicNavbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-duma-green"></div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
