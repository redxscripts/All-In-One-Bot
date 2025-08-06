import React from 'react'
import { motion } from 'framer-motion'
import { Library as LibraryIcon } from 'lucide-react'

const Library: React.FC = () => {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <LibraryIcon size={64} className="text-primary-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Your Library</h1>
        <p className="text-gray-400">
          Your saved videos and playlists will appear here.
        </p>
      </motion.div>
    </div>
  )
}

export default Library