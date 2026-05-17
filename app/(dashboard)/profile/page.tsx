'use client';
import { useAppContext } from '../../context/AppContext';
import { ArrowUpRight, ArrowDownLeft, Send, Receipt, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { formatMarketMoney, marketAmountToUsd, useMarket } from '@/lib/market';
import QRCodeComponent from '../../components/QRCode';

export default function ProfileScreen() {
  const { walletBalance, cashBalance, mobileBankBalance, transactions, user, sendMoney } = useAppContext();
  const { market } = useMarket();
  const searchParams = useSearchParams();
  const [sendAmount, setSendAmount] = useState('');
  const [recipientCode, setRecipientCode] = useState('');
  const [sendNote, setSendNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isOwnRecipient, setIsOwnRecipient] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchRecipientName = async (code: string) => {
    if (code.length !== 6) {
      setRecipientName('');
      setIsOwnRecipient(false);
      return;
    }

    if (code === user?.refCode) {
      setRecipientName('');
      setIsOwnRecipient(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('get_user_by_ref_code', { recipient_ref_code: code });

      if (error) {
        setSendError(error.message);
        setRecipientName('');
        setIsOwnRecipient(false);
        return;
      }

      if (!data || data.length === 0) {
        setRecipientName('');
        setIsOwnRecipient(false);
      } else {
        setRecipientName(data[0].business_name);
        setIsOwnRecipient(false);
        setSendError('');
      }
    } catch (err) {
      console.error('RPC error:', err);
      setSendError('Unable to check recipient code. Please try again.');
      setRecipientName('');
      setIsOwnRecipient(false);
    }
  };

  useEffect(() => {
    if (recipientCode.length === 6) {
      fetchRecipientName(recipientCode);
    } else {
      setRecipientName('');
      setIsOwnRecipient(false);
    }
  }, [recipientCode]);

  useEffect(() => {
    const qrRecipient = searchParams.get('to');
    if (qrRecipient && qrRecipient.length === 6) {
      setRecipientCode(qrRecipient);
      document.getElementById('send-money-modal')?.classList.remove('hidden');
    }
  }, [searchParams]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const handleSendMoney = async () => {
    if (!sendAmount || !recipientCode) {
      setSendError('Please fill in all fields');
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      setSendError('Please enter a valid amount');
      return;
    }

    if (isOwnRecipient) {
      setSendError('You cannot send money to your own account. Use a different recipient code.');
      return;
    }

    if (!recipientName) {
      setSendError('Invalid recipient code');
      return;
    }

    setSendError('');
    setShowConfirmModal(true);
  };

  const confirmSendMoney = async () => {
    setShowConfirmModal(false);
    setIsSending(true);
    setSendError('');
    setSendSuccess('');

    const result = await sendMoney(recipientCode, marketAmountToUsd(parseFloat(sendAmount), market), 'Mobile Money', sendNote || 'Money transfer');

    if (result.error) {
      setSendError(result.error);
    } else {
      setSendSuccess('Money sent successfully!');
      setSendAmount('');
      setRecipientCode('');
      setSendNote('');
      setRecipientName('');
    }

    setIsSending(false);
  };

  const copyRefCode = () => {
    if (user?.refCode) {
      navigator.clipboard.writeText(user.refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Profile & Wallet</h1>
        <p className="text-neutral-500 font-medium mt-1">Manage your account and send/receive money.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Wallet Balance Card */}
        <div className="xl:col-span-1">
          <div className="bg-pesa-navy rounded-3xl md:rounded-[2rem] p-5 sm:p-8 text-center text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
            <p className="text-sm font-bold opacity-80 mb-2 drop-shadow-sm uppercase tracking-widest text-duma-green">Wallet Balance</p>
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-black tracking-tight mb-6"
              style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
            >
              {formatMarketMoney(walletBalance, market)}
            </motion.h2>

            {/* User Reference Code */}
            <div className="mb-6">
              <p className="text-xs font-bold opacity-70 mb-2">Your Reference Code</p>
              <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-3">
                <span className="font-mono text-lg font-bold">{user?.refCode || 'XXXXXX'}</span>
                <button
                  onClick={copyRefCode}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('send-money-modal')?.classList.remove('hidden')}
                className="w-full bg-duma-green hover:bg-emerald-600 transition-colors text-white font-bold py-4 rounded-xl shadow-lg text-lg"
              >
                <Send size={20} className="inline mr-2" />
                Send Money
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full bg-duma-blue text-white font-bold py-4 rounded-xl border border-[#1b5093] text-lg hover:bg-blue-800 transition-colors"
              >
                <Receipt size={20} className="inline mr-2" />
                Receive Money
              </motion.button>
            </div>
          </div>
        </div>

        {/* Account Balances and Recent Activity */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          {/* Account Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Receipt size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Cash Balance</p>
                  <p className="text-2xl font-black text-pesa-navy">{formatMarketMoney(cashBalance, market)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Send size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Mobile Bank</p>
                  <p className="text-2xl font-black text-pesa-navy">{formatMarketMoney(mobileBankBalance, market)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-pesa-navy mb-6">Recent Transactions</h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {recentTransactions.length === 0 ? (
                <div className="text-center py-10 text-neutral-400 font-bold">No transactions found.</div>
              ) : (
                recentTransactions.map(txn => {
                  const isPositive = txn.type === 'sale' || txn.type === 'transfer_in';
                  const Icon = isPositive ? ArrowDownLeft : ArrowUpRight;
                  return (
                    <motion.div variants={itemVariants} key={txn.id} className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`p-3 rounded-xl ${isPositive ? 'bg-green-100 text-duma-green' : 'bg-red-50 text-red-600'}`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-base sm:text-lg truncate">{txn.description}</p>
                          <p className="text-sm font-medium text-gray-500">
                            {new Date(txn.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className={`font-black text-base sm:text-xl shrink-0 ${isPositive ? 'text-duma-green' : 'text-neutral-900'}`}>
                        {isPositive ? '+' : '-'}{formatMarketMoney(Number(txn.amount), market)}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QRCodeComponent
          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/profile?to=${user?.refCode}`}
          businessName={user?.businessName || 'Your Business'}
          label="Share this QR code to receive payments instantly"
          size={280}
        />
        
        {/* How to Use Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-pesa-navy mb-6">How to Use Your QR Code</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pesa-navy text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Share Your QR Code</h4>
                <p className="text-gray-600 text-sm">
                  Download and share the QR code with customers, friends, or family. You can print it, send it via email, or display it in your shop.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pesa-navy text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">They Scan It</h4>
                <p className="text-gray-600 text-sm">
                  Anyone with a smartphone can scan the QR code using their camera app. It will instantly open your payment page.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pesa-navy text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">They Enter Amount</h4>
                <p className="text-gray-600 text-sm">
                  The sender enters the amount they want to send and an optional note. They'll see your business name clearly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pesa-navy text-white font-bold">
                  4
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Instant Payment</h4>
                <p className="text-gray-600 text-sm">
                  The money is transferred instantly to your wallet. You'll get a notification and can see it in your transactions.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span> No need to share your reference code manually
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span> Reduces payment errors and typos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span> Works offline - no internet needed to scan
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span> Perfect for shops, restaurants, and markets
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span> Payments settle instantly
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
      <div id="send-money-modal" className="fixed inset-0 bg-black/50 hidden flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full max-h-[calc(100vh-2rem)] overflow-y-auto qorapp-scrollbar">
          <h3 className="text-2xl font-black text-pesa-navy mb-6">Send Money</h3>

          {sendError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {sendError}
            </div>
          )}

          {sendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {sendSuccess}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Recipient Code (6 digits)</label>
              <input
                type="text"
                value={recipientCode}
                onChange={(e) => setRecipientCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-duma-green focus:border-transparent"
                placeholder="123456"
                maxLength={6}
              />
              {recipientName && (
                <p className="text-sm text-green-600 mt-1">Recipient: {recipientName}</p>
              )}
              {isOwnRecipient && (
                <p className="text-sm text-red-600 mt-1">This is your own account code; please enter another recipient code.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Amount ({market.currency})</label>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-duma-green focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Note (optional)</label>
              <input
                type="text"
                value={sendNote}
                onChange={(e) => setSendNote(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-duma-green focus:border-transparent"
                placeholder="Payment for..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => {
                document.getElementById('send-money-modal')?.classList.add('hidden');
                setSendError('');
                setSendSuccess('');
              }}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMoney}
              disabled={isSending || !recipientName}
              className="flex-1 py-3 px-4 bg-duma-green text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send Money'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full max-h-[calc(100vh-2rem)] overflow-y-auto qorapp-scrollbar">
            <h3 className="text-2xl font-black text-pesa-navy mb-6">Confirm Transfer</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Recipient</p>
                <p className="font-bold text-lg text-pesa-navy">{recipientName}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-bold text-lg text-pesa-navy">{formatMarketMoney(marketAmountToUsd(parseFloat(sendAmount), market), market)}</p>
              </div>
              
              {sendNote && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Note</p>
                  <p className="font-bold text-lg text-pesa-navy">{sendNote}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSendMoney}
                className="flex-1 py-3 px-4 bg-duma-green text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
