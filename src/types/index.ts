export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  displayName: string
  subscribers: number
  isVerified: boolean
  createdAt: string
  bio?: string
  location?: string
  website?: string
}

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: number
  views: number
  likes: number
  dislikes: number
  uploadDate: string
  category: string
  tags: string[]
  isLive: boolean
  quality: VideoQuality[]
  user: User
}

export interface VideoQuality {
  resolution: string
  url: string
  bitrate: number
}

export interface Comment {
  id: string
  content: string
  user: User
  videoId: string
  parentId?: string
  replies?: Comment[]
  likes: number
  createdAt: string
  isPinned: boolean
}

export interface Playlist {
  id: string
  title: string
  description: string
  thumbnail: string
  videos: Video[]
  user: User
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  subscriber: User
  channel: User
  createdAt: string
  notifications: boolean
}

export interface SearchFilters {
  query: string
  sortBy: 'relevance' | 'upload_date' | 'view_count' | 'rating'
  duration: 'any' | 'short' | 'medium' | 'long'
  uploadDate: 'any' | 'hour' | 'today' | 'week' | 'month' | 'year'
  category: string
}

export interface UploadProgress {
  percentage: number
  stage: 'uploading' | 'processing' | 'complete' | 'error'
  message: string
}

export interface VideoStats {
  totalViews: number
  totalLikes: number
  totalComments: number
  subscribers: number
  watchTime: number
  impressions: number
  clickThroughRate: number
}

export interface NotificationData {
  id: string
  type: 'like' | 'comment' | 'subscribe' | 'upload'
  message: string
  user: User
  video?: Video
  read: boolean
  createdAt: string
}

export interface LiveStream {
  id: string
  title: string
  description: string
  thumbnail: string
  streamKey: string
  viewers: number
  isLive: boolean
  startTime: string
  user: User
  chatEnabled: boolean
}

export interface ChatMessage {
  id: string
  message: string
  user: User
  timestamp: string
  isSuperchat: boolean
  amount?: number
}