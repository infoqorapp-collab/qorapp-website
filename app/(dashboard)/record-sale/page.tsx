'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import { Banknote, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMarketMoney, useMarket } from '@/lib/market';

export default function RecordSaleScreen() {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [method, setMethod] = useState<'Cash' | 'Mobile Money'>('Cash');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { inventory, addSale } = useAppContext();
  const { market } = useMarket();
  const router = useRouter();

  const selectedProduct = useMemo(
    () => inventory.find(item => item.id === productId) || null,
    [inventory, productId]
  );

  const parsedQuantity = Number.parseInt(quantity || '0', 10);
  const validQuantity = Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 0;
  const totalUsd = selectedProduct ? selectedProduct.price * validQuantity : 0;

  const exceedsStock = !!selectedProduct && validQuantity > selectedProduct.stock;
  const canSubmit = !!selectedProduct && validQuantity > 0 && !exceedsStock && !isSubmitting;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedProduct || validQuantity <= 0) return;
    if (exceedsStock) {
      setError(`Only ${selectedProduct.stock} unit(s) of ${selectedProduct.name} left in stock.`);
      return;
    }

    setIsSubmitting(true);
    const { error: saleError } = await addSale(selectedProduct.id, validQuantity, method);
    setIsSubmitting(false);

    if (saleError) {
      setError(saleError);
      return;
    }

    setIsConfirming(true);
    // Allow animation to play before routing
    setTimeout(() => router.push('/dashboard'), 800);
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col items-center">

        <AnimatePresence>
          {isConfirming && (
            <motion.div
              initial={{ y: 200, opacity: 1, scale: 1 }}
              animate={{ y: -100, opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-0 right-0 pointer-events-none z-50 flex justify-center mt-32"
            >
              <span className="text-5xl font-black text-duma-green drop-shadow-lg">+{formatMarketMoney(totalUsd, market)}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-2xl bg-white rounded-3xl md:rounded-[2rem] p-5 sm:p-8 shadow-lg border border-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-pesa-navy tracking-tight">Record Sale</h1>
            <p className="text-neutral-500 font-medium mt-1">Capture revenue and update your daily tracking.</p>
          </div>

          <form id="record-sale" onSubmit={handleConfirm} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-2">Item Sold</label>
              <select
                required
                value={productId}
                onChange={e => setProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg bg-white focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition-all shadow-sm"
              >
                <option value="" disabled>Choose a product...</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id} disabled={item.stock <= 0}>
                    {item.name} {item.stock <= 0 ? '(Out of stock)' : `— ${item.stock} in stock`}
                  </option>
                ))}
              </select>
              {inventory.length === 0 && (
                <p className="text-sm text-neutral-500 mt-2">No products in inventory yet. Add one from the Inventory page first.</p>
              )}
            </div>

            {selectedProduct && (
              <div className="flex items-center justify-between bg-slate-50 border border-gray-200 rounded-xl px-4 py-3">
                <span className="text-sm font-bold text-neutral-600">Unit price</span>
                <span className="text-lg font-black text-pesa-navy">{formatMarketMoney(selectedProduct.price, market)}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-2">Quantity</label>
              <input
                required
                type="number"
                min={1}
                max={selectedProduct ? selectedProduct.stock : undefined}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-2xl font-black text-duma-green focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition-all bg-white shadow-sm"
                placeholder="1"
                disabled={!selectedProduct}
              />
              {exceedsStock && (
                <p className="text-sm font-bold text-red-600 mt-2">
                  Only {selectedProduct?.stock} unit(s) available.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between bg-green-50 border border-duma-green/30 rounded-xl px-4 py-3">
              <span className="text-sm font-bold text-neutral-700">Total</span>
              <span className="text-2xl font-black text-duma-green">{formatMarketMoney(totalUsd, market)}</span>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-800 mb-3">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMethod('Cash')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${method === 'Cash' ? 'border-duma-green bg-green-50 text-duma-green shadow-sm' : 'border-gray-200 text-neutral-400 bg-white hover:bg-gray-50'}`}
                >
                  <Banknote size={32} className="mb-3" />
                  <span className="font-bold">Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('Mobile Money')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${method === 'Mobile Money' ? 'border-duma-green bg-green-50 text-duma-green shadow-sm' : 'border-gray-200 text-neutral-400 bg-white hover:bg-gray-50'}`}
                >
                  <Smartphone size={32} className="mb-3" />
                  <span className="font-bold px-2 text-center">Mobile Money</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 font-bold text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 mt-8">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-duma-green text-white font-bold text-xl py-4 rounded-[1.5rem] shadow-xl shadow-green-200 hover:bg-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Recording...' : 'Confirm Sale'}
              </motion.button>
            </div>
          </form>
        </div>
    </div>
  );
}
