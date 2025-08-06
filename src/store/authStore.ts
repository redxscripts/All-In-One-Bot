import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Partial<User> & { password: string }) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // Simulate API call
          const mockUser: User = {
            id: '1',
            username: 'john_doe',
            email,
            displayName: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            subscribers: 12500,
            isVerified: true,
            createdAt: new Date().toISOString(),
            bio: 'Content creator and tech enthusiast',
            location: 'San Francisco, CA',
            website: 'https://johndoe.com'
          }
          
          set({ user: mockUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          // Simulate API call
          const newUser: User = {
            id: Date.now().toString(),
            username: userData.username || '',
            email: userData.email || '',
            displayName: userData.displayName || '',
            avatar: userData.avatar,
            subscribers: 0,
            isVerified: false,
            createdAt: new Date().toISOString(),
            bio: userData.bio,
            location: userData.location,
            website: userData.website
          }
          
          set({ user: newUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) return

        set({ isLoading: true })
        try {
          const updatedUser = { ...user, ...updates }
          set({ user: updatedUser, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)