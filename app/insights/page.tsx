'use client';
import TopBar from '../components/ui/TopBar';
import BottomNav from '../components/ui/BottomNav';
import { motion, Variants } from 'framer-motion';

export default function InsightsScreen() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 } // progressive disclosure
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-16">
      <TopBar title="AI Insights & Analytics" />

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-lg font-bold text-neutral-800 leading-snug">
              Your sales increased <span className="text-green-500 font-extrabold text-xl">20%</span> this week compared to last.
            </p>
          </motion.div>
          
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-lg font-bold text-neutral-800 leading-snug">
              You spend most on inventory (approx. <span className="text-green-500 font-extrabold text-xl">60%</span> of expenses).
            </p>
          </motion.div>
          
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-lg font-bold text-neutral-800 leading-snug">
              Your profit margin is low on soft drinks - consider adjusting prices.
            </p>
          </motion.div>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-8 bg-[#0E472D] text-white font-bold py-4 rounded-[2rem] shadow-xl text-sm"
        >
          View Detailed Analysis
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
