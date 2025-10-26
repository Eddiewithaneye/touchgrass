'use client'

import { useState, useEffect } from 'react'
import { getTranslations, type Locale } from '@/lib/i18n'
import { generalApi } from '@/lib/api'

interface LeaderboardUser {
  id: number
  displayName: string
  wins: number
  rank: number
}

export default function LeaderboardPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Load leaderboard from backend
      const response = await generalApi.getLeaderboard()
      setUsers(response.leaderboard)
    } catch (error: any) {
      setError(error.message || 'Failed to load leaderboard')
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  if (isLoading) {
    return (
      <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center scale-in">
          <div className="spinner glow" style={{ width: '3rem', height: '3rem', margin: '0 auto var(--spacing-md)' }}></div>
          <p style={{ color: 'var(--dark-gray)' }} className="pulse">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="section bg-gradient-nature bg-animate" style={{ minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--spacing-lg)' }} className="bounce-in float">🏆</span>
          <h1 style={{ color: 'var(--primary-green)', marginBottom: 'var(--spacing-md)' }} className="slide-up stagger-1 text-shimmer">
            TouchGrass Leaderboard
          </h1>
          <p style={{ color: 'var(--dark-gray)', maxWidth: '600px', margin: '0 auto' }} className="slide-up stagger-2">
            See how you rank against other nature explorers! Complete scavenger hunts to earn wins and climb the leaderboard.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error" style={{ marginBottom: 'var(--spacing-xl)' }}>
            {error}
          </div>
        )}

        {/* Leaderboard */}
        <div className="card scale-in hover-glow">
          {users.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-xl)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--spacing-md)' }} className="bounce-in">🌱</span>
              <h3 style={{ color: 'var(--primary-green)', marginBottom: 'var(--spacing-md)' }} className="slide-up stagger-1">
                No explorers yet!
              </h3>
              <p style={{ color: 'var(--dark-gray)', marginBottom: 'var(--spacing-lg)' }} className="slide-up stagger-2">
                Be the first to sign up and start your nature adventure.
              </p>
              <a
                href={`/${locale}/signup`}
                className="btn btn-primary hover-lift pulse"
              >
                Join the Adventure
              </a>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--light-gray)' }}>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: 'var(--spacing-lg) var(--spacing-xl)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--primary-green)'
                    }}>
                      Rank
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: 'var(--spacing-lg) var(--spacing-xl)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--primary-green)'
                    }}>
                      Explorer
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: 'var(--spacing-lg) var(--spacing-xl)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--primary-green)'
                    }}>
                      Wins
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} style={{
                      borderBottom: '1px solid var(--light-gray)',
                      transition: 'background-color var(--transition-fast)'
                    }} className={`slide-in-left stagger-${Math.min(index + 1, 6)} hover-lift`}>
                      <td style={{ padding: 'var(--spacing-lg) var(--spacing-xl)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '1.5rem' }} className={user.rank <= 3 ? 'pulse float' : 'bounce-in'}>
                            {getRankIcon(user.rank)}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--spacing-lg) var(--spacing-xl)' }}>
                        <div style={{
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--text-black)'
                        }}>
                          {user.displayName}
                        </div>
                      </td>
                      <td style={{ padding: 'var(--spacing-lg) var(--spacing-xl)' }}>
                        <span style={{
                          fontSize: '1.125rem',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--bright-green)'
                        }}>
                          {user.wins}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 slide-up stagger-3">
          <p style={{ color: 'var(--dark-gray)', marginBottom: 'var(--spacing-md)' }}>
            Ready to climb the leaderboard? Start your nature adventure!
          </p>
          <a
            href={`/${locale}/scavenger-hunt`}
            className="btn btn-primary hover-lift pulse glow"
          >
            Start Scavenger Hunt
          </a>
        </div>
      </div>
    </div>
  )
}