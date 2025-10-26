// API service for communicating with the Flask backend
// Falls back to localStorage when backend is not available

const API_BASE_URL = 'http://localhost:5000/api'
const USE_BACKEND = true // Set to true when Python backend is running

// Types
export interface User {
  id: number
  email: string
  displayName: string
}

export interface AuthResponse {
  message: string
  session_token: string
  user: User
}

export interface ApiResponse<T = any> {
  message?: string
  error?: string
  data?: T
}

export interface ImageUploadResponse {
  message: string
  image_id: number
  status: string
  success: boolean
}

export interface UserImage {
  id: number
  prompt: string
  status: string
  created_at: string
}

// Helper function to get session token from localStorage
function getSessionToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('session_token')
  }
  return null
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // Add authorization header if session token exists
  const sessionToken = getSessionToken()
  if (sessionToken) {
    defaultHeaders['Authorization'] = `Bearer ${sessionToken}`
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }
  
  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Initialize demo users if they don't exist
function initializeDemoUsers() {
  // No longer initializing demo users - users must sign up
  if (typeof window !== 'undefined') {
    const existingUsers = localStorage.getItem('users')
    if (!existingUsers) {
      localStorage.setItem('users', JSON.stringify([]))
    }
  }
}

// Fallback localStorage functions
const localStorageAuth = {
  async signup(email: string, password: string, displayName: string): Promise<AuthResponse> {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find((u: any) => u.email === email.toLowerCase())) {
      throw new Error('User with this email already exists')
    }
    
    // Add new user
    const newUser = { id: Date.now(), email: email.toLowerCase(), password, displayName }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    // Create session
    const sessionToken = Math.random().toString(36).substring(2, 15)
    localStorage.setItem('session_token', sessionToken)
    localStorage.setItem('user', JSON.stringify({ id: newUser.id, email: newUser.email, displayName: newUser.displayName }))
    
    return {
      message: 'User created successfully',
      session_token: sessionToken,
      user: { id: newUser.id, email: newUser.email, displayName: newUser.displayName }
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u: any) => u.email === email.toLowerCase() && u.password === password)
    
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    // Create session
    const sessionToken = Math.random().toString(36).substring(2, 15)
    localStorage.setItem('session_token', sessionToken)
    localStorage.setItem('user', JSON.stringify({ id: user.id, email: user.email, displayName: user.displayName }))
    
    return {
      message: 'Login successful',
      session_token: sessionToken,
      user: { id: user.id, email: user.email, displayName: user.displayName }
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('session_token')
    localStorage.removeItem('user')
  }
}

// Initialize demo users on module load
if (typeof window !== 'undefined') {
  initializeDemoUsers()
}

// Guest user management
function createGuestUser(): User {
  const guestId = Date.now()
  const guestNames = [
    'Anonymous Explorer', 'Mystery Hiker', 'Secret Naturalist', 'Hidden Wanderer',
    'Unknown Adventurer', 'Stealth Walker', 'Phantom Hunter', 'Shadow Seeker'
  ]
  const randomName = guestNames[Math.floor(Math.random() * guestNames.length)]
  
  return {
    id: guestId,
    email: `guest_${guestId}@touchgrass.temp`,
    displayName: `${randomName} #${guestId.toString().slice(-4)}`
  }
}

// Authentication API functions
export const authApi = {
  async signup(email: string, password: string, displayName: string): Promise<AuthResponse> {
    if (USE_BACKEND) {
      const response = await apiRequest<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, displayName }),
      })
      
      // Store session token in localStorage
      if (response.session_token) {
        localStorage.setItem('session_token', response.session_token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      
      return response
    } else {
      return await localStorageAuth.signup(email, password, displayName)
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_BACKEND) {
      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      
      // Store session token in localStorage
      if (response.session_token) {
        localStorage.setItem('session_token', response.session_token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      
      return response
    } else {
      return await localStorageAuth.login(email, password)
    }
  },

  async logout(): Promise<void> {
    if (USE_BACKEND) {
      try {
        await apiRequest('/auth/logout', {
          method: 'POST',
        })
      } finally {
        // Always clear local storage, even if API call fails
        localStorage.removeItem('session_token')
        localStorage.removeItem('user')
        localStorage.removeItem('is_guest')
      }
    } else {
      await localStorageAuth.logout()
      localStorage.removeItem('is_guest')
    }
  },

  async verifySession(): Promise<{ user: User }> {
    if (USE_BACKEND) {
      return await apiRequest('/auth/verify')
    } else {
      const user = this.getCurrentUser()
      if (user) {
        return { user }
      }
      throw new Error('No valid session')
    }
  },

  // Check if user is authenticated (has valid session token)
  isAuthenticated(): boolean {
    return !!getSessionToken()
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  },

  // Create and login as guest
  async loginAsGuest(): Promise<AuthResponse> {
    if (USE_BACKEND) {
      const response = await apiRequest<AuthResponse>('/auth/guest', {
        method: 'POST',
      })
      
      // Store session token in localStorage
      if (response.session_token) {
        localStorage.setItem('session_token', response.session_token)
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('is_guest', 'true')
      }
      
      return response
    } else {
      const guestUser = createGuestUser()
      
      // Create session (but don't persist guest to users list)
      const sessionToken = Math.random().toString(36).substring(2, 15)
      localStorage.setItem('session_token', sessionToken)
      localStorage.setItem('user', JSON.stringify(guestUser))
      localStorage.setItem('is_guest', 'true')
      
      return {
        message: 'Guest session created',
        session_token: sessionToken,
        user: guestUser
      }
    }
  },

  // Check if current user is guest
  isGuest(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('is_guest') === 'true'
    }
    return false
  },

}

// Image API functions
export const imageApi = {
  async uploadImage(prompt: string, imageData?: string): Promise<ImageUploadResponse> {
    if (USE_BACKEND) {
      return await apiRequest<ImageUploadResponse>('/images/upload', {
        method: 'POST',
        body: JSON.stringify({ prompt, image_data: imageData }),
      })
    } else {
      // Simulate backend response with localStorage fallback
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const success = Math.random() > 0.2 // 80% success rate
      const imageId = Date.now()
      
      // Store image info in localStorage
      const images = JSON.parse(localStorage.getItem('user_images') || '[]')
      images.push({
        id: imageId,
        prompt,
        status: success ? 'success' : 'failure',
        created_at: new Date().toISOString()
      })
      localStorage.setItem('user_images', JSON.stringify(images))
      
      return {
        message: 'Image uploaded successfully',
        image_id: imageId,
        status: success ? 'success' : 'failure',
        success
      }
    }
  },

  async getUserImages(): Promise<{ images: UserImage[] }> {
    if (USE_BACKEND) {
      return await apiRequest('/images/user')
    } else {
      const images = JSON.parse(localStorage.getItem('user_images') || '[]')
      return { images }
    }
  }
}

// General API functions
export const generalApi = {
  async healthCheck(): Promise<{ status: string; message: string }> {
    if (USE_BACKEND) {
      return await apiRequest('/health')
    } else {
      return { status: 'healthy', message: 'TouchGrass API is running (localStorage mode)' }
    }
  },

  async getStats(): Promise<{
    total_users: number
    total_images: number
    successful_hunts: number
    success_rate: number
  }> {
    if (USE_BACKEND) {
      return await apiRequest('/stats')
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const images = JSON.parse(localStorage.getItem('user_images') || '[]')
      const successfulHunts = images.filter((img: any) => img.status === 'success').length
      
      return {
        total_users: users.length,
        total_images: images.length,
        successful_hunts: successfulHunts,
        success_rate: images.length > 0 ? Math.round((successfulHunts / images.length) * 100) : 0
      }
    }
  },

  async getLeaderboard(): Promise<{
    leaderboard: Array<{
      id: number
      displayName: string
      wins: number
      rank: number
      isGuest: boolean
    }>
  }> {
    if (USE_BACKEND) {
      return await apiRequest('/leaderboard')
    } else {
      // Fallback to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const leaderboard = users
        .map((user: any, index: number) => ({
          id: user.id,
          displayName: user.displayName || user.email.split('@')[0],
          wins: Math.floor(Math.random() * 20),
          rank: index + 1,
          isGuest: false
        }))
        .sort((a: any, b: any) => b.wins - a.wins)
        .map((user: any, index: number) => ({ ...user, rank: index + 1 }))
      
      return { leaderboard }
    }
  }
}

// Error handling utility
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// Export default API object
export default {
  auth: authApi,
  images: imageApi,
  general: generalApi,
}