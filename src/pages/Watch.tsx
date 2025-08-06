import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  Bell,
  BellOff,
  Eye,
  CheckCircle,
  Flag
} from 'lucide-react'
import VideoPlayer from '../components/video/VideoPlayer'
import VideoGrid from '../components/video/VideoGrid'
import { useVideoStore } from '../store/videoStore'
import { useAuthStore } from '../store/authStore'

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { currentVideo, videos, fetchVideoById, likeVideo, dislikeVideo, addView } = useVideoStore()
  const { isAuthenticated } = useAuthStore()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  useEffect(() => {
    if (id) {
      fetchVideoById(id)
    }
  }, [id, fetchVideoById])

  useEffect(() => {
    if (currentVideo) {
      addView(currentVideo.id)
    }
  }, [currentVideo, addView])

  const handleLike = () => {
    if (!currentVideo || !isAuthenticated) return
    
    if (isDisliked) {
      setIsDisliked(false)
    }
    
    setIsLiked(!isLiked)
    if (!isLiked) {
      likeVideo(currentVideo.id)
    }
  }

  const handleDislike = () => {
    if (!currentVideo || !isAuthenticated) return
    
    if (isLiked) {
      setIsLiked(false)
    }
    
    setIsDisliked(!isDisliked)
    if (!isDisliked) {
      dislikeVideo(currentVideo.id)
    }
  }

  const handleSubscribe = () => {
    if (!isAuthenticated) return
    setIsSubscribed(!isSubscribed)
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

  const relatedVideos = videos.filter(v => v.id !== currentVideo?.id).slice(0, 12)

  if (!currentVideo) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-video"
          >
            <VideoPlayer video={currentVideo} autoplay />
          </motion.div>

          {/* Video Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-bold text-white mb-3">
              {currentVideo.title}
            </h1>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>{formatViews(currentVideo.views)}</span>
                </div>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(currentVideo.uploadDate), { addSuffix: true })}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Like/Dislike */}
                <div className="flex items-center bg-dark-surface rounded-full overflow-hidden">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-dark-card transition-colors ${
                      isLiked ? 'text-primary-400' : 'text-gray-300'
                    }`}
                    disabled={!isAuthenticated}
                  >
                    <ThumbsUp size={18} className={isLiked ? 'fill-current' : ''} />
                    <span>{(currentVideo.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
                  </button>
                  <div className="w-px h-6 bg-dark-border" />
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-dark-card transition-colors ${
                      isDisliked ? 'text-red-400' : 'text-gray-300'
                    }`}
                    disabled={!isAuthenticated}
                  >
                    <ThumbsDown size={18} className={isDisliked ? 'fill-current' : ''} />
                  </button>
                </div>

                {/* Share */}
                <button className="flex items-center gap-2 px-4 py-2 bg-dark-surface hover:bg-dark-card rounded-full transition-colors text-gray-300">
                  <Share2 size={18} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {/* Download */}
                <button className="flex items-center gap-2 px-4 py-2 bg-dark-surface hover:bg-dark-card rounded-full transition-colors text-gray-300">
                  <Download size={18} />
                  <span className="hidden sm:inline">Download</span>
                </button>

                {/* More */}
                <button className="p-2 bg-dark-surface hover:bg-dark-card rounded-full transition-colors text-gray-300">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Channel Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-surface rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link to={`/profile/${currentVideo.user.username}`}>
                  <img
                    src={currentVideo.user.avatar}
                    alt={currentVideo.user.displayName}
                    className="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-primary-500 transition-all"
                  />
                </Link>
                
                <div>
                  <Link
                    to={`/profile/${currentVideo.user.username}`}
                    className="flex items-center gap-2 group"
                  >
                    <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {currentVideo.user.displayName}
                    </h3>
                    {currentVideo.user.isVerified && (
                      <CheckCircle size={16} className="text-primary-400" />
                    )}
                  </Link>
                  <p className="text-sm text-gray-400">
                    {currentVideo.user.subscribers.toLocaleString()} subscribers
                  </p>
                </div>
              </div>

              {isAuthenticated && (
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-dark-card rounded-full transition-colors text-gray-300">
                    {isSubscribed ? <BellOff size={20} /> : <Bell size={20} />}
                  </button>
                  
                  <button
                    onClick={handleSubscribe}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      isSubscribed
                        ? 'bg-dark-card text-gray-300 hover:bg-dark-border'
                        : 'btn-primary'
                    }`}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <div className={`text-gray-300 ${showDescription ? '' : 'line-clamp-3'}`}>
                {currentVideo.description}
              </div>
              {currentVideo.description.length > 200 && (
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="text-gray-400 hover:text-white mt-2 text-sm font-medium"
                >
                  {showDescription ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>

            {/* Tags */}
            {currentVideo.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {currentVideo.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${tag}`}
                    className="px-3 py-1 bg-dark-card hover:bg-dark-border rounded-full text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Comments Section Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-surface rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            <div className="text-center py-8 text-gray-400">
              <p>Comments section coming soon...</p>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
            <div className="space-y-4">
              {relatedVideos.map((video) => (
                <div key={video.id} className="group">
                  <Link
                    to={`/watch/${video.id}`}
                    className="flex gap-3 hover:bg-dark-surface/50 rounded-lg p-2 transition-colors"
                  >
                    <div className="relative flex-shrink-0 w-40">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration > 0 ? 
                          `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 
                          'LIVE'
                        }
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white line-clamp-2 group-hover:text-primary-400 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {video.user.displayName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <span>{formatViews(video.views)}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(video.uploadDate), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Watch