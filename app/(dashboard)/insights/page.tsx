'use client';
import { motion, Variants } from 'framer-motion';

export default function InsightsScreen() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-pesa-navy tracking-tight">AI Insights & Analytics</h1>
        <p className="text-neutral-500 font-medium mt-1">Smart recommendations based on your store's performance.</p>
      </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
              <i className="fa-solid fa-arrow-trend-up text-xl"></i>
            </div>
            <p className="text-lg font-bold text-neutral-800 leading-snug">
              Your sales increased <span className="text-duma-green font-extrabold text-xl">20%</span> this week compared to last.
            </p>
          </motion.div>
          
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <i className="fa-solid fa-coins text-xl"></i>
            </div>
            <p className="text-lg font-bold text-neutral-800 leading-snug">
              You spend most on inventory (approx. <span className="text-duma-green font-extrabold text-xl">60%</span> of expenses).
            </p>
          </motion.div>
          
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <i className="fa-solid fa-lightbulb text-xl"></i>
            </div>
            <p className="text-lg font-bold text-neutral-800 leading-snug">
              Your profit margin is low on soft drinks - consider adjusting prices.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <button 
            className="w-full max-w-md bg-duma-green text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-emerald-700 transition"
          >
            View Detailed Analysis
          </button>
        </motion.div>
    </div>
  );
}
