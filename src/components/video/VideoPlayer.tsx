import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw,
  Loader2
} from 'lucide-react'
import { Video } from '../../types'

interface VideoPlayerProps {
  video: Video
  autoplay?: boolean
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  autoplay = false,
  onTimeUpdate,
  onEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [quality, setQuality] = useState(video.quality[0]?.resolution || '720p')
  const [showSettings, setShowSettings] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const hideControlsTimeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      const time = videoElement.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoElement.addEventListener('timeupdate', handleTimeUpdate)
    videoElement.addEventListener('ended', handleEnded)
    videoElement.addEventListener('loadstart', handleLoadStart)
    videoElement.addEventListener('canplay', handleCanPlay)

    if (autoplay) {
      videoElement.play().then(() => setIsPlaying(true)).catch(console.error)
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoElement.removeEventListener('timeupdate', handleTimeUpdate)
      videoElement.removeEventListener('ended', handleEnded)
      videoElement.removeEventListener('loadstart', handleLoadStart)
      videoElement.removeEventListener('canplay', handleCanPlay)
    }
  }, [autoplay, onTimeUpdate, onEnded])

  const togglePlay = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (isPlaying) {
      videoElement.pause()
      setIsPlaying(false)
    } else {
      videoElement.play().then(() => setIsPlaying(true)).catch(console.error)
    }
  }

  const handleSeek = (time: number) => {
    const videoElement = videoRef.current
    if (!videoElement) return
    
    videoElement.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (newVolume: number) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    setVolume(newVolume)
    videoElement.volume = newVolume
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (isMuted) {
      videoElement.volume = volume
      setIsMuted(false)
    } else {
      videoElement.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const skipTime = (seconds: number) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    handleSeek(newTime)
  }

  const changePlaybackRate = (rate: number) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.playbackRate = rate
    setPlaybackRate(rate)
    setShowSettings(false)
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current)
    }
    
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleMouseMove = () => {
    showControlsTemporarily()
  }

  const handleClick = () => {
    togglePlay()
    showControlsTemporarily()
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={handleClick}
        poster={video.thumbnail}
        preload="metadata"
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="text-center">
              <Loader2 size={48} className="text-white animate-spin mx-auto mb-4" />
              <p className="text-white">Loading video...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play Button Overlay */}
      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Play size={32} className="text-white ml-2" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"
          >
            {/* Progress Bar */}
            <div className="absolute bottom-20 left-4 right-4">
              <div className="relative h-2 bg-white/20 rounded-full cursor-pointer group/progress">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-150"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity cursor-grab"
                  style={{ left: `calc(${progressPercentage}% - 8px)` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <Pause size={24} className="text-white" />
                  ) : (
                    <Play size={24} className="text-white ml-1" />
                  )}
                </button>

                {/* Skip Controls */}
                <button
                  onClick={() => skipTime(-10)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  title="Rewind 10s"
                >
                  <SkipBack size={20} className="text-white" />
                </button>
                
                <button
                  onClick={() => skipTime(10)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  title="Forward 10s"
                >
                  <SkipForward size={20} className="text-white" />
                </button>

                {/* Volume Controls */}
                <div
                  className="flex items-center gap-2 group/volume"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={20} className="text-white" />
                    ) : (
                      <Volume2 size={20} className="text-white" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 80 }}
                        exit={{ opacity: 0, width: 0 }}
                        className="h-2 bg-white/20 rounded-full relative overflow-hidden"
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-white rounded-full"
                          style={{ width: `${volume * 100}%` }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Time Display */}
                <div className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Settings */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Settings size={20} className="text-white" />
                  </button>

                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-12 right-0 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-xl overflow-hidden"
                      >
                        <div className="p-2">
                          <div className="text-sm font-semibold text-gray-300 px-2 py-1">
                            Playback Speed
                          </div>
                          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-dark-card transition-colors ${
                                playbackRate === rate ? 'text-primary-400' : 'text-gray-300'
                              }`}
                            >
                              {rate === 1 ? 'Normal' : `${rate}x`}
                            </button>
                          ))}
                          
                          <div className="border-t border-dark-border my-2" />
                          
                          <div className="text-sm font-semibold text-gray-300 px-2 py-1">
                            Quality
                          </div>
                          {video.quality.map((q) => (
                            <button
                              key={q.resolution}
                              onClick={() => setQuality(q.resolution)}
                              className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-dark-card transition-colors ${
                                quality === q.resolution ? 'text-primary-400' : 'text-gray-300'
                              }`}
                            >
                              {q.resolution}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize size={20} className="text-white" />
                  ) : (
                    <Maximize size={20} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VideoPlayer