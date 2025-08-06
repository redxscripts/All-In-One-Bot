import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Search as SearchIcon, Grid, List } from 'lucide-react'
import VideoGrid from '../components/video/VideoGrid'
import VideoCard from '../components/video/VideoCard'
import { useVideoStore } from '../store/videoStore'

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchResults, filters, isLoading, searchVideos, setFilters } = useVideoStore()
  const [showFilters, setShowFilters] = useState(false)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  useEffect(() => {
    if (query || category) {
      const searchFilters = {
        ...filters,
        query,
        category
      }
      setFilters(searchFilters)
      searchVideos(query, searchFilters)
    }
  }, [query, category])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams)
    if (updatedFilters.query) {
      newSearchParams.set('q', updatedFilters.query)
    }
    if (updatedFilters.category) {
      newSearchParams.set('category', updatedFilters.category)
    } else {
      newSearchParams.delete('category')
    }
    setSearchParams(newSearchParams)

    searchVideos(updatedFilters.query, updatedFilters)
  }

  const categories = [
    'All',
    'Technology',
    'Gaming',
    'Music',
    'Education',
    'Entertainment',
    'Sports',
    'News',
    'Lifestyle',
    'Travel',
    'Food',
    'DIY'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'upload_date', label: 'Upload Date' },
    { value: 'view_count', label: 'View Count' },
    { value: 'rating', label: 'Rating' }
  ]

  const durationOptions = [
    { value: 'any', label: 'Any Duration' },
    { value: 'short', label: 'Under 4 minutes' },
    { value: 'medium', label: '4-20 minutes' },
    { value: 'long', label: 'Over 20 minutes' }
  ]

  const uploadDateOptions = [
    { value: 'any', label: 'Any Time' },
    { value: 'hour', label: 'Last Hour' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ]

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Search Results
            {query && (
              <span className="text-gray-400 font-normal"> for "{query}"</span>
            )}
          </h1>
          <p className="text-gray-400 mt-1">
            {searchResults.length} results found
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Layout Toggle */}
          <div className="flex items-center bg-dark-surface rounded-lg p-1">
            <button
              onClick={() => setLayout('grid')}
              className={`p-2 rounded-md transition-colors ${
                layout === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-2 rounded-md transition-colors ${
                layout === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={18} />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-surface hover:bg-dark-card rounded-lg transition-colors text-gray-300"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </motion.div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterChange({ 
              category: cat === 'All' ? '' : cat.toLowerCase() 
            })}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              (cat === 'All' && !filters.category) || 
              (cat.toLowerCase() === filters.category)
                ? 'bg-primary-600 text-white'
                : 'bg-dark-surface text-gray-300 hover:bg-dark-card'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-dark-surface rounded-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ 
                  sortBy: e.target.value as typeof filters.sortBy 
                })}
                className="w-full input-field"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange({ 
                  duration: e.target.value as typeof filters.duration 
                })}
                className="w-full input-field"
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Date
              </label>
              <select
                value={filters.uploadDate}
                onChange={(e) => handleFilterChange({ 
                  uploadDate: e.target.value as typeof filters.uploadDate 
                })}
                className="w-full input-field"
              >
                {uploadDateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                const defaultFilters = {
                  query: filters.query,
                  sortBy: 'relevance' as const,
                  duration: 'any' as const,
                  uploadDate: 'any' as const,
                  category: ''
                }
                handleFilterChange(defaultFilters)
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Searching videos...</p>
            </div>
          </div>
        ) : layout === 'grid' ? (
          <VideoGrid videos={searchResults} />
        ) : (
          <div className="space-y-4">
            {searchResults.map((video) => (
              <VideoCard key={video.id} video={video} layout="list" />
            ))}
          </div>
        )}
      </motion.div>

      {/* No Results */}
      {!isLoading && searchResults.length === 0 && query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <SearchIcon size={64} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No results found for "{query}"
          </h3>
          <p className="text-gray-400 mb-6">
            Try different keywords or check your spelling
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Suggestions:</p>
            <ul className="space-y-1">
              <li>• Try more general keywords</li>
              <li>• Check spelling of your keywords</li>
              <li>• Try different keywords</li>
              <li>• Try fewer keywords</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Search