'use client';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { formatMarketMoney, marketAmountToUsd, useMarket } from '@/lib/market';

export default function InventoryScreen() {
  const { inventory, addProduct, updateStock } = useAppContext();
  const { market } = useMarket();
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  
  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  
  const [updateProductId, setUpdateProductId] = useState('');
  const [updateStockAmount, setUpdateStockAmount] = useState('');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductName && newProductStock && newProductPrice) {
      const priceInUsd = marketAmountToUsd(Number.parseFloat(newProductPrice), market);
      await addProduct(newProductName, parseInt(newProductStock), priceInUsd);
      setIsAddOpen(false);
      setNewProductName('');
      setNewProductStock('');
      setNewProductPrice('');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updateProductId && updateStockAmount) {
      await updateStock(updateProductId, parseInt(updateStockAmount));
      setIsUpdateOpen(false);
      setUpdateProductId('');
      setUpdateStockAmount('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-pesa-navy tracking-tight">Inventory Management</h1>
            <p className="text-neutral-500 font-medium mt-1">Track and manage your store's stock levels.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
             <motion.button onClick={() => setIsAddOpen(true)} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none bg-duma-green text-white font-bold py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-emerald-700 transition">
               <span>+</span> Add Product
             </motion.button>
             <motion.button onClick={() => setIsUpdateOpen(true)} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none bg-white border border-gray-200 text-pesa-navy font-bold py-3 px-6 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition">
               <span>↑</span> Update stock
             </motion.button>
          </div>
        </div>

        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm text-lg focus:outline-none focus:ring-4 focus:ring-duma-green/20 focus:border-duma-green transition-all"
          />
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {inventory.map(item => (
            <motion.div variants={itemVariants} key={item.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex justify-between items-center gap-4 hover:shadow-md transition">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">Product</p>
                <h3 className="text-xl font-bold text-pesa-navy truncate">{item.name.replace('Product Name ', '')}</h3>
                <div className="flex items-center gap-2 mt-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'Full' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${item.status === 'Full' ? 'text-green-700' : 'text-red-700 bg-red-50 px-2 py-1 rounded-md'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-neutral-500 mt-2">{formatMarketMoney(item.price, market)} / unit</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">Stock</p>
                <motion.h3 
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }} key={item.stock} className="text-4xl font-black text-duma-blue"
                >
                  {item.stock}
                </motion.h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

      <AnimatePresence>
        {isAddOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-pesa-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-5 sm:p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-black text-pesa-navy mb-6">Add New Product</h2>
              <form onSubmit={handleAddSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Product Name</label>
                  <input required type="text" placeholder="e.g. Rice 5kg" value={newProductName} onChange={e => setNewProductName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-duma-green/20 focus:outline-none focus:border-duma-green transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Initial Stock</label>
                  <input required type="number" placeholder="0" value={newProductStock} onChange={e => setNewProductStock(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-duma-green/20 focus:outline-none focus:border-duma-green transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Unit Price ({market.currency})</label>
                  <input required type="number" min={0} step="0.01" placeholder="0.00" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-duma-green/20 focus:outline-none focus:border-duma-green transition" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-3.5 border border-gray-200 font-bold text-neutral-600 rounded-xl hover:bg-slate-50 transition">Cancel</button>
                  <button type="submit" className="flex-1 py-3.5 bg-duma-green text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-green-200">Save Product</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isUpdateOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-pesa-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-5 sm:p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-black text-pesa-navy mb-6">Update Stock</h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Select Product</label>
                  <select required value={updateProductId} onChange={e => setUpdateProductId(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-4 focus:ring-duma-green/20 focus:outline-none focus:border-duma-green transition">
                    <option value="" disabled>Choose a product...</option>
                    {inventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">New Stock Total</label>
                  <input required type="number" placeholder="0" value={updateStockAmount} onChange={e => setUpdateStockAmount(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-duma-green/20 focus:outline-none focus:border-duma-green transition" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button type="button" onClick={() => setIsUpdateOpen(false)} className="flex-1 py-3.5 border border-gray-200 font-bold text-neutral-600 rounded-xl hover:bg-slate-50 transition">Cancel</button>
                  <button type="submit" className="flex-1 py-3.5 bg-duma-blue text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">Update Stock</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
