'use client'

import { AuthProvider } from '@/hooks/useAuth'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}