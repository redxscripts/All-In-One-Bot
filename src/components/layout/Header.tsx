import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  Search, 
  Upload, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Video,
  Play
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useVideoStore } from '../../store/videoStore'

interface HeaderProps {
  onToggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { searchVideos } = useVideoStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchVideos(searchQuery)
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-dark-surface border-b border-dark-border z-50"
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-dark-card transition-colors"
          >
            <Menu size={20} className="text-gray-300" />
          </button>
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Play size={16} className="text-white ml-0.5" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              VideoStream
            </span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, channels, playlists..."
                className="w-full px-4 py-2 pl-12 bg-dark-card border border-dark-border rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
              <Search size={20} className="absolute left-4 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 p-1.5 bg-primary-600 hover:bg-primary-700 rounded-full transition-colors"
              >
                <Search size={16} className="text-white" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Upload Button */}
              <Link
                to="/upload"
                className="p-2 rounded-lg hover:bg-dark-card transition-colors group"
                title="Upload Video"
              >
                <Upload size={20} className="text-gray-300 group-hover:text-white" />
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg hover:bg-dark-card transition-colors group relative"
                  title="Notifications"
                >
                  <Bell size={20} className="text-gray-300 group-hover:text-white" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </button>

                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-dark-surface border border-dark-border rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-dark-border">
                      <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 text-center text-gray-400">
                        No new notifications
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-dark-card transition-colors group"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                    alt={user?.displayName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary-500 transition-all"
                  />
                </button>

                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-dark-surface border border-dark-border rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-dark-border">
                      <div className="flex items-center gap-3">
                        <img
                          src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                          alt={user?.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white">{user?.displayName}</p>
                          <p className="text-sm text-gray-400">@{user?.username}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to={`/profile/${user?.username}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors text-gray-300 hover:text-white"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={18} />
                        <span>Your Profile</span>
                      </Link>
                      
                      <Link
                        to="/analytics"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors text-gray-300 hover:text-white"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Video size={18} />
                        <span>Your Videos</span>
                      </Link>
                      
                      <button
                        className="flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors text-gray-300 hover:text-white w-full text-left"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </button>
                      
                      <div className="border-t border-dark-border my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-dark-card transition-colors text-red-400 hover:text-red-300 w-full text-left"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="btn-secondary text-sm px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm px-4 py-2"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Close dropdowns when clicking outside */}
      {(userMenuOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false)
            setNotificationsOpen(false)
          }}
        />
      )}
    </motion.header>
  )
}

export default Header