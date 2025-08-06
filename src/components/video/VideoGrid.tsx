import React from 'react'
import { motion } from 'framer-motion'
import VideoCard from './VideoCard'
import { Video } from '../../types'

interface VideoGridProps {
  videos: Video[]
  columns?: number
  loading?: boolean
}

const VideoGrid: React.FC<VideoGridProps> = ({ 
  videos, 
  columns = 4,
  loading = false 
}) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-6`}>
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-video bg-dark-surface rounded-lg mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-dark-surface rounded w-3/4" />
              <div className="h-3 bg-dark-surface rounded w-1/2" />
              <div className="h-3 bg-dark-surface rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No videos found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${gridClass} gap-6`}
    >
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          variants={itemVariants}
          custom={index}
          className="group"
        >
          <VideoCard video={video} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default VideoGrid