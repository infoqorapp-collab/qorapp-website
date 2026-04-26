'use client';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TopBar from '../components/ui/TopBar';
import BottomNav from '../components/ui/BottomNav';
import { Search } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

export default function InventoryScreen() {
  const { inventory, addProduct, updateStock } = useAppContext();
  
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  
  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  
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
    if (newProductName && newProductStock) {
      await addProduct(newProductName, parseInt(newProductStock));
      setIsAddOpen(false);
      setNewProductName('');
      setNewProductStock('');
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
    <div className="flex flex-col h-full bg-slate-50 relative pb-16">
      <TopBar title="Inventory Management" showAdd={true} onAdd={() => setIsAddOpen(true)} />

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm text-lg focus:outline-none focus:ring-4 focus:ring-[#0E472D]/20 focus:border-[#0E472D] transition-all"
          />
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4 mb-24">
          {inventory.map(item => (
            <motion.div variants={itemVariants} key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-neutral-800 mb-1">Product Name</p>
                <h3 className="text-xl font-bold text-black">{item.name.replace('Product Name ', '')}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'Full' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-semibold ${item.status === 'Full' ? 'text-green-700' : 'text-red-700 bg-red-100 px-2 py-0.5 rounded-md'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-neutral-800 mb-1">Stock</p>
                <motion.h3 
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }} key={item.stock} className="text-3xl font-bold text-black"
                >
                  {item.stock}
                </motion.h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 px-5 flex gap-4 z-10 pointer-events-none">
        <div className="flex-1 pointer-events-auto">
          <motion.button onClick={() => setIsAddOpen(true)} whileTap={{ scale: 0.95 }} className="w-full bg-[#0E472D] text-white font-bold py-3 rounded-[1.5rem] shadow-lg flex items-center justify-center gap-2 text-sm">
            <span>+</span> Add Product
          </motion.button>
        </div>
        <div className="flex-1 pointer-events-auto">
          <motion.button onClick={() => setIsUpdateOpen(true)} whileTap={{ scale: 0.95 }} className="w-full bg-[#0E472D] text-white font-bold py-3 rounded-[1.5rem] shadow-lg flex items-center justify-center gap-2 text-sm">
            <span>↑</span> Update stock
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isAddOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center px-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-6 w-full shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Add Product</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <input required type="text" placeholder="Product Name" value={newProductName} onChange={e => setNewProductName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-[#0E472D]/20 focus:outline-none" />
                <input required type="number" placeholder="Initial Stock" value={newProductStock} onChange={e => setNewProductStock(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-[#0E472D]/20 focus:outline-none" />
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-3 font-bold text-gray-500">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#0E472D] text-white rounded-xl font-bold">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isUpdateOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center px-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-6 w-full shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Update Stock</h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <select required value={updateProductId} onChange={e => setUpdateProductId(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-4 focus:ring-[#0E472D]/20 focus:outline-none">
                  <option value="" disabled>Select product</option>
                  {inventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <input required type="number" placeholder="New Stock Total" value={updateStockAmount} onChange={e => setUpdateStockAmount(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-4 focus:ring-[#0E472D]/20 focus:outline-none" />
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsUpdateOpen(false)} className="flex-1 py-3 font-bold text-gray-500">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#0E472D] text-white rounded-xl font-bold">Update</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
