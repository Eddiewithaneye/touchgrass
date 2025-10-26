'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, type User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isGuest: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  loginAsGuest: () => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshAuth = () => {
    const currentUser = authApi.getCurrentUser()
    const isAuth = authApi.isAuthenticated()
    
    if (isAuth && currentUser) {
      setUser(currentUser)
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    refreshAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(email, password)
      setUser(response.user)
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, displayName: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.signup(email, password, displayName)
      setUser(response.user)
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsGuest = async () => {
    setIsLoading(true)
    try {
      const response = await authApi.loginAsGuest()
      setUser(response.user)
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authApi.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear user state even if API call fails
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isGuest: authApi.isGuest(),
    isLoading,
    login,
    signup,
    loginAsGuest,
    logout,
    refreshAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}