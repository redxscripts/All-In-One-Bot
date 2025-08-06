import { create } from 'zustand'
import { Video, SearchFilters } from '../types'

interface VideoState {
  videos: Video[]
  currentVideo: Video | null
  searchResults: Video[]
  filters: SearchFilters
  isLoading: boolean
  hasMoreVideos: boolean
  fetchVideos: () => Promise<void>
  fetchVideoById: (id: string) => Promise<void>
  searchVideos: (query: string, filters?: Partial<SearchFilters>) => Promise<void>
  setFilters: (filters: Partial<SearchFilters>) => void
  likeVideo: (videoId: string) => Promise<void>
  dislikeVideo: (videoId: string) => Promise<void>
  addView: (videoId: string) => Promise<void>
}

// Mock video data
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Building a Modern React App with TypeScript',
    description: 'Learn how to build a modern React application using TypeScript, Vite, and Tailwind CSS.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 1834,
    views: 145720,
    likes: 8934,
    dislikes: 234,
    uploadDate: '2024-01-15T10:30:00Z',
    category: 'Technology',
    tags: ['react', 'typescript', 'web development'],
    isLive: false,
    quality: [
      { resolution: '1080p', url: 'video_1080p.mp4', bitrate: 5000 },
      { resolution: '720p', url: 'video_720p.mp4', bitrate: 3000 },
      { resolution: '480p', url: 'video_480p.mp4', bitrate: 1500 }
    ],
    user: {
      id: 'user1',
      username: 'techguru',
      email: 'tech@example.com',
      displayName: 'Tech Guru',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      subscribers: 567890,
      isVerified: true,
      createdAt: '2022-03-15T10:30:00Z'
    }
  },
  {
    id: '2',
    title: 'Advanced Animation Techniques in CSS',
    description: 'Master advanced CSS animations and create stunning visual effects for your websites.',
    thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=225&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 2145,
    views: 89340,
    likes: 5632,
    dislikes: 123,
    uploadDate: '2024-01-10T14:20:00Z',
    category: 'Design',
    tags: ['css', 'animation', 'web design'],
    isLive: false,
    quality: [
      { resolution: '1080p', url: 'video_1080p.mp4', bitrate: 5000 },
      { resolution: '720p', url: 'video_720p.mp4', bitrate: 3000 }
    ],
    user: {
      id: 'user2',
      username: 'designmaster',
      email: 'design@example.com',
      displayName: 'Design Master',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face',
      subscribers: 234567,
      isVerified: true,
      createdAt: '2021-08-20T09:15:00Z'
    }
  },
  {
    id: '3',
    title: '🔴 LIVE: JavaScript Q&A Session',
    description: 'Live coding session answering your JavaScript questions!',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 0,
    views: 1234,
    likes: 156,
    dislikes: 5,
    uploadDate: new Date().toISOString(),
    category: 'Technology',
    tags: ['javascript', 'live', 'coding'],
    isLive: true,
    quality: [
      { resolution: '1080p', url: 'live_1080p.m3u8', bitrate: 5000 }
    ],
    user: {
      id: 'user3',
      username: 'jsexpert',
      email: 'js@example.com',
      displayName: 'JS Expert',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      subscribers: 890123,
      isVerified: true,
      createdAt: '2020-05-10T16:45:00Z'
    }
  }
]

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  currentVideo: null,
  searchResults: [],
  filters: {
    query: '',
    sortBy: 'relevance',
    duration: 'any',
    uploadDate: 'any',
    category: ''
  },
  isLoading: false,
  hasMoreVideos: true,

  fetchVideos: async () => {
    set({ isLoading: true })
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ videos: mockVideos, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  fetchVideoById: async (id: string) => {
    set({ isLoading: true })
    try {
      const video = mockVideos.find(v => v.id === id)
      set({ currentVideo: video || null, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  searchVideos: async (query: string, filters?: Partial<SearchFilters>) => {
    set({ isLoading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const filteredVideos = mockVideos.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      
      set({ 
        searchResults: filteredVideos, 
        isLoading: false,
        filters: { ...get().filters, query, ...filters }
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  setFilters: (filters: Partial<SearchFilters>) => {
    set(state => ({ filters: { ...state.filters, ...filters } }))
  },

  likeVideo: async (videoId: string) => {
    const { videos, currentVideo } = get()
    
    // Update videos array
    const updatedVideos = videos.map(video =>
      video.id === videoId
        ? { ...video, likes: video.likes + 1 }
        : video
    )
    
    // Update current video if it matches
    const updatedCurrentVideo = currentVideo?.id === videoId
      ? { ...currentVideo, likes: currentVideo.likes + 1 }
      : currentVideo

    set({ videos: updatedVideos, currentVideo: updatedCurrentVideo })
  },

  dislikeVideo: async (videoId: string) => {
    const { videos, currentVideo } = get()
    
    const updatedVideos = videos.map(video =>
      video.id === videoId
        ? { ...video, dislikes: video.dislikes + 1 }
        : video
    )
    
    const updatedCurrentVideo = currentVideo?.id === videoId
      ? { ...currentVideo, dislikes: currentVideo.dislikes + 1 }
      : currentVideo

    set({ videos: updatedVideos, currentVideo: updatedCurrentVideo })
  },

  addView: async (videoId: string) => {
    const { videos, currentVideo } = get()
    
    const updatedVideos = videos.map(video =>
      video.id === videoId
        ? { ...video, views: video.views + 1 }
        : video
    )
    
    const updatedCurrentVideo = currentVideo?.id === videoId
      ? { ...currentVideo, views: currentVideo.views + 1 }
      : currentVideo

    set({ videos: updatedVideos, currentVideo: updatedCurrentVideo })
  }
}))