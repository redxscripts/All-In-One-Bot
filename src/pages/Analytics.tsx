import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

const Analytics: React.FC = () => {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <BarChart3 size={64} className="text-primary-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">
          Channel analytics and insights coming soon.
        </p>
      </motion.div>
    </div>
  )
}

export default Analytics