import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import VideoGrid from '../components/video/VideoGrid'
import VideoCard from '../components/video/VideoCard'
import { useVideoStore } from '../store/videoStore'
import { Loader2, TrendingUp, Clock, Eye } from 'lucide-react'

const Home: React.FC = () => {
  const { videos, isLoading, fetchVideos } = useVideoStore()

  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos()
    }
  }, [videos.length, fetchVideos])

  const trendingVideos = videos.filter(video => video.views > 100000).slice(0, 3)
  const recentVideos = videos.slice(0, 8)

  if (isLoading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 size={48} className="text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading amazing content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900/20 to-secondary-900/20 border border-primary-500/20 p-8"
      >
        <div className="relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="gradient-text">Welcome to VideoStream</span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Discover amazing content from creators around the world. Watch, learn, and be entertained.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-dark-surface/50 backdrop-blur-sm border border-dark-border rounded-lg p-4 flex items-center gap-3"
              >
                <TrendingUp className="text-primary-400" size={24} />
                <div>
                  <p className="text-sm text-gray-400">Trending Now</p>
                  <p className="font-semibold">{videos.length} Videos</p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-dark-surface/50 backdrop-blur-sm border border-dark-border rounded-lg p-4 flex items-center gap-3"
              >
                <Eye className="text-secondary-400" size={24} />
                <div>
                  <p className="text-sm text-gray-400">Total Views</p>
                  <p className="font-semibold">
                    {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 animate-gradient" />
      </motion.section>

      {/* Trending Videos Section */}
      {trendingVideos.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-primary-400" size={24} />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative group"
              >
                <VideoCard video={video} />
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                  <TrendingUp size={12} />
                  #{index + 1} Trending
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Recent Videos Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-secondary-400" size={24} />
          <h2 className="text-2xl font-bold">Latest Videos</h2>
        </div>
        <VideoGrid videos={recentVideos} />
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center py-12"
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready to Share Your Story?</h3>
          <p className="text-gray-300 mb-6">
            Join millions of creators and start sharing your content with the world.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-8 py-3"
            onClick={() => window.location.href = '/upload'}
          >
            Start Creating
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}

export default Home