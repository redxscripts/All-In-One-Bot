import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  TrendingUp,
  Users,
  Library,
  Clock,
  ThumbsUp,
  PlaySquare,
  Settings,
  HelpCircle,
  Flame,
  Music,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface SidebarProps {
  isOpen: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  const mainNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Users, label: 'Subscriptions', path: '/subscriptions', requireAuth: true },
  ]

  const libraryItems = [
    { icon: Library, label: 'Library', path: '/library', requireAuth: true },
    { icon: Clock, label: 'Watch Later', path: '/library?list=WL', requireAuth: true },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/library?list=LL', requireAuth: true },
    { icon: PlaySquare, label: 'Your Videos', path: '/analytics', requireAuth: true },
  ]

  const exploreItems = [
    { icon: Flame, label: 'Trending', path: '/trending' },
    { icon: Music, label: 'Music', path: '/search?category=music' },
    { icon: Gamepad2, label: 'Gaming', path: '/search?category=gaming' },
    { icon: Newspaper, label: 'News', path: '/search?category=news' },
    { icon: Trophy, label: 'Sports', path: '/search?category=sports' },
    { icon: Lightbulb, label: 'Learning', path: '/search?category=education' },
  ]

  const settingsItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const renderNavItem = (item: any, index: number) => {
    if (item.requireAuth && !isAuthenticated) return null

    return (
      <motion.div
        key={item.path}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link
          to={item.path}
          className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
          title={!isOpen ? item.label : ''}
        >
          <item.icon size={20} />
          {isOpen && <span className="text-sm font-medium">{item.label}</span>}
        </Link>
      </motion.div>
    )
  }

  const renderSection = (title: string, items: any[], startIndex: number = 0) => (
    <div className="mb-6">
      {isOpen && (
        <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {items.map((item, index) => renderNavItem(item, startIndex + index))}
      </div>
    </div>
  )

  return (
    <div className="h-full overflow-y-auto scrollbar-hide py-4">
      <div className="space-y-1">
        {/* Main Navigation */}
        <div className="mb-6">
          <div className="space-y-1">
            {mainNavItems.map((item, index) => renderNavItem(item, index))}
          </div>
        </div>

        {/* Divider */}
        {isOpen && <div className="border-t border-dark-border mx-4 mb-6" />}

        {/* Library Section */}
        {isAuthenticated && renderSection('Library', libraryItems, 3)}

        {/* Divider */}
        {isOpen && isAuthenticated && <div className="border-t border-dark-border mx-4 mb-6" />}

        {/* Explore Section */}
        {renderSection('Explore', exploreItems, 7)}

        {/* Divider */}
        {isOpen && <div className="border-t border-dark-border mx-4 mb-6" />}

        {/* Settings Section */}
        {renderSection('More', settingsItems, 13)}

        {/* Sign in prompt for non-authenticated users */}
        {!isAuthenticated && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-4 p-4 bg-dark-card rounded-lg border border-dark-border"
          >
            <p className="text-sm text-gray-300 mb-3">
              Sign in to access your library, subscriptions, and more features.
            </p>
            <Link
              to="/login"
              className="btn-primary w-full text-center block text-sm py-2"
            >
              Sign In
            </Link>
          </motion.div>
        )}

        {/* Footer */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="px-4 py-6 text-xs text-gray-500 space-y-2"
          >
            <div className="space-y-1">
              <p>&copy; 2024 VideoStream</p>
              <p>Advanced Video Platform</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Sidebar