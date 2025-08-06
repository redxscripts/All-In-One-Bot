import React from 'react'
import { motion } from 'framer-motion'
import { Upload as UploadIcon } from 'lucide-react'

const Upload: React.FC = () => {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <UploadIcon size={64} className="text-primary-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Upload Videos</h1>
        <p className="text-gray-400">
          Video upload functionality coming soon! This will include drag & drop, 
          progress tracking, and video processing.
        </p>
      </motion.div>
    </div>
  )
}

export default Upload