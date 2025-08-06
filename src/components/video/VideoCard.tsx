import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  Play, 
  Eye, 
  Clock, 
  MoreVertical, 
  Plus, 
  Share2, 
  Flag,
  CheckCircle,
  Dot
} from 'lucide-react'
import { Video } from '../../types'

interface VideoCardProps {
  video: Video
  layout?: 'grid' | 'list'
}

const VideoCard: React.FC<VideoCardProps> = ({ video, layout = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'LIVE'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
  }

  const formatUploadDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  if (layout === 'list') {
    return (
      <motion.div
        className="flex gap-4 group"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          to={`/watch/${video.id}`}
          className="relative flex-shrink-0 w-40 sm:w-48"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="video-thumbnail aspect-video">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isHovered ? 1 : 0.8 }}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Play size={20} className="text-white ml-1" />
              </motion.div>
            </motion.div>
            
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
            
            {video.isLive && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                LIVE
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/watch/${video.id}`}>
            <h3 className="font-semibold text-white line-clamp-2 group-hover:text-primary-400 transition-colors">
              {video.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
            <span>{formatViews(video.views)}</span>
            <Dot size={16} />
            <span>{formatUploadDate(video.uploadDate)}</span>
          </div>

          <Link
            to={`/profile/${video.user.username}`}
            className="flex items-center gap-2 mt-2 group/channel"
          >
            <img
              src={video.user.avatar}
              alt={video.user.displayName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-300 group-hover/channel:text-white transition-colors">
              {video.user.displayName}
            </span>
            {video.user.isVerified && (
              <CheckCircle size={14} className="text-primary-400" />
            )}
          </Link>

          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {video.description}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="group cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <Link to={`/watch/${video.id}`} className="block relative">
        <div className="video-thumbnail aspect-video hover-lift">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: isHovered ? 1 : 0.8 }}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Play size={24} className="text-white ml-1" />
            </motion.div>
          </motion.div>
          
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
            {formatDuration(video.duration)}
          </div>
          
          {video.isLive && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="pt-3">
        <div className="flex gap-3">
          <Link
            to={`/profile/${video.user.username}`}
            className="flex-shrink-0"
          >
            <img
              src={video.user.avatar}
              alt={video.user.displayName}
              className="w-9 h-9 rounded-full object-cover hover:ring-2 hover:ring-primary-500 transition-all"
            />
          </Link>

          <div className="flex-1 min-w-0">
            <Link to={`/watch/${video.id}`}>
              <h3 className="font-semibold text-white line-clamp-2 group-hover:text-primary-400 transition-colors leading-tight">
                {video.title}
              </h3>
            </Link>
            
            <Link
              to={`/profile/${video.user.username}`}
              className="flex items-center gap-1 mt-1 group/channel"
            >
              <span className="text-sm text-gray-400 group-hover/channel:text-gray-300 transition-colors">
                {video.user.displayName}
              </span>
              {video.user.isVerified && (
                <CheckCircle size={14} className="text-primary-400" />
              )}
            </Link>

            <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{formatViews(video.views)}</span>
              </div>
              <Dot size={16} />
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatUploadDate(video.uploadDate)}</span>
              </div>
            </div>
          </div>

          {/* More Options */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowMenu(!showMenu)
              }}
              className="p-1 rounded-full hover:bg-dark-surface transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>

            {showMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-8 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-xl z-50 py-2"
                >
                  <button className="flex items-center gap-3 px-4 py-2 hover:bg-dark-card transition-colors w-full text-left text-sm text-gray-300">
                    <Plus size={16} />
                    Add to queue
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2 hover:bg-dark-card transition-colors w-full text-left text-sm text-gray-300">
                    <Plus size={16} />
                    Save to playlist
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2 hover:bg-dark-card transition-colors w-full text-left text-sm text-gray-300">
                    <Share2 size={16} />
                    Share
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2 hover:bg-dark-card transition-colors w-full text-left text-sm text-gray-300">
                    <Flag size={16} />
                    Report
                  </button>
                </motion.div>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VideoCard