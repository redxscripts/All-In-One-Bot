import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './Header'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex pt-16">
        <motion.div
          initial={false}
          animate={{
            width: sidebarOpen ? 240 : 80,
            opacity: 1
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-dark-surface border-r border-dark-border z-40"
        >
          <Sidebar isOpen={sidebarOpen} />
        </motion.div>

        <motion.main
          initial={false}
          animate={{
            marginLeft: sidebarOpen ? 240 : 80
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 min-h-[calc(100vh-4rem)] bg-dark-bg"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}

export default Layout