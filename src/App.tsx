import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Search from './pages/Search'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Subscriptions from './pages/Subscriptions'
import Trending from './pages/Trending'
import Library from './pages/Library'
import Analytics from './pages/Analytics'

function App() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Login />
            </motion.div>
          } />
          <Route path="/register" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Register />
            </motion.div>
          } />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watch/:id" element={<Watch />} />
                <Route path="/search" element={<Search />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/library" element={<Library />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App