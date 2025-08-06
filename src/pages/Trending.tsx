import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

const Trending: React.FC = () => {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <TrendingUp size={64} className="text-primary-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Trending</h1>
        <p className="text-gray-400">
          Trending videos functionality coming soon.
        </p>
      </motion.div>
    </div>
  )
}

export default Trending