import React from 'react'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

const Profile: React.FC = () => {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <User size={64} className="text-primary-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">User Profile</h1>
        <p className="text-gray-400">
          User profile functionality coming soon! This will include channel customization,
          video management, and subscriber features.
        </p>
      </motion.div>
    </div>
  )
}

export default Profile