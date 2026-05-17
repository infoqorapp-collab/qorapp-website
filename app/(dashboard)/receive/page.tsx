'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useAppContext } from '../../context/AppContext';
import { supabase } from '../../../lib/supabase';
import PublicNavbar from '../../components/ui/PublicNavbar';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Check } from 'lucide-react';
import { formatMarketMoney, marketAmountToUsd, useMarket } from '@/lib/market';

function ReceivePaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, sendMoney } = useAppContext();
  const { market } = useMarket();
  
  const recipientCode = searchParams.get('to');
  const [recipientName, setRecipientName] = useState('');
  const [recipientBusiness, setRecipientBusiness] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (recipientCode) {
      router.push(`/profile?to=${recipientCode}`);
    }
  }, [recipientCode, router]);

  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please log in to send money.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setIsSending(true);
    setError('');

    const result = await sendMoney(
      recipientCode || '',
      marketAmountToUsd(parseFloat(amount), market),
      'QR Payment',
      `Payment via QR code to ${recipientBusiness}`
    );

    if (result.error) {
      setError(result.error);
      setIsSending(false);
    } else {
      setSuccess('Payment sent successfully! ✓');
      setAmount('');
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pesa-navy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <PublicNavbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-pesa-navy hover:text-slate-800 font-semibold mb-8"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-700 font-semibold">{error}</p>
              {error.includes('Invalid') && (
                <p className="text-red-600 text-sm mt-2">This payment request appears to be invalid or expired.</p>
              )}
            </div>
          )}

          {!error && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              {/* Recipient Card */}
              <div className="mb-8 p-6 bg-gradient-to-br from-pesa-navy to-slate-800 rounded-2xl text-white">
                <p className="text-sm opacity-80 mb-2">Send Money To</p>
                <h1 className="text-4xl font-black mb-2">{recipientBusiness}</h1>
                <p className="text-sm opacity-70">{recipientName}</p>
              </div>

              {success ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-pesa-navy mb-4">{success}</h2>
                  <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
                  <p className="text-sm text-gray-500">Redirecting to your profile...</p>
                </div>
              ) : (
                <form onSubmit={handleSendPayment} className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Amount ({market.currency})
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500 font-bold text-lg">
                        {market.currency === 'RWF' ? 'Frw' : market.currency}
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pesa-navy focus:ring-2 focus:ring-pesa-navy/10 text-lg font-semibold"
                        disabled={isSending}
                      />
                    </div>
                    {amount && (
                      <p className="text-sm text-gray-500 mt-2">
                        ≈ {formatMarketMoney(parseFloat(amount), market)}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSending || !amount}
                    className="w-full bg-gradient-to-r from-pesa-navy to-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    <Send size={24} />
                    {isSending ? 'Processing...' : `Send ${formatMarketMoney(parseFloat(amount) || 0, market)}`}
                  </motion.button>
                </form>
              )}

              {/* Info Box */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900 font-semibold mb-2">🔒 Security</p>
                <p className="text-sm text-blue-800">
                  Your payment is encrypted and secure. You'll receive a confirmation once the payment is processed.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function ReceivePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pesa-navy"></div>
      </div>
    }>
      <ReceivePaymentContent />
    </Suspense>
  );
}
