'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getTranslations, type Locale } from '@/lib/i18n'
import { useAuth } from '@/hooks/useAuth'

export default function SignupPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate form
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.displayName) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await signup(formData.email, formData.password, formData.displayName)
      router.push(`/${locale}/scavenger-hunt`)
    } catch (error: any) {
      setError(error.message || 'Failed to create account')
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
              {t.auth.signupTitle}
            </h2>
            <p style={{ color: 'var(--dark-gray)' }}>
              Already have an account?{' '}
              <Link
                href={`/${locale}/login`}
                style={{ 
                  color: 'var(--bright-green)', 
                  textDecoration: 'none',
                  fontWeight: 'var(--font-weight-medium)'
                }}
              >
                Sign in here
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
                <label htmlFor="displayName" className="form-label">
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your display name"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                />
                <p style={{ fontSize: '0.875rem', color: 'var(--medium-gray)', marginTop: 'var(--spacing-xs)' }}>
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  {t.auth.confirmPassword}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
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
                    Creating account...
                  </>
                ) : (
                  t.auth.signupButton
                )}
              </button>
            </form>

            <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
              <div style={{ 
                position: 'relative',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div style={{ 
                  position: 'absolute',
                  inset: '0',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{ width: '100%', borderTop: '1px solid var(--medium-gray)' }} />
                </div>
                <div style={{ 
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ 
                    padding: '0 var(--spacing-sm)',
                    background: 'var(--neutral-white)',
                    color: 'var(--medium-gray)'
                  }}>
                    Terms
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--dark-gray)' }}>
                By signing up, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}