'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getTranslations, type Locale } from '@/lib/i18n'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)
  const router = useRouter()
  const { login, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    try {
      await login(formData.email, formData.password)
      router.push(`/${locale}/scavenger-hunt`)
    } catch (error: any) {
      setError(error.message || 'Invalid email or password')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="section bg-gradient-nature" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="text-center mb-8">
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--spacing-lg)' }}>🌿</span>
            <h2 style={{ color: 'var(--primary-green)', marginBottom: 'var(--spacing-md)' }}>
              {t.auth.loginTitle}
            </h2>
            <p style={{ color: 'var(--dark-gray)' }}>
              Don't have an account?{' '}
              <Link
                href={`/${locale}/signup`}
                style={{ 
                  color: 'var(--bright-green)', 
                  textDecoration: 'none',
                  fontWeight: 'var(--font-weight-medium)'
                }}
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="card fade-in">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {error && (
                <div className="error">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="form-label">
                  {t.auth.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  {t.auth.password}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                style={{ width: '100%' }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" style={{ marginRight: 'var(--spacing-sm)' }}></span>
                    Signing in...
                  </>
                ) : (
                  t.auth.loginButton
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}