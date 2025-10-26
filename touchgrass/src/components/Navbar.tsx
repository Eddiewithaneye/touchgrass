'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getTranslations, type Locale } from '@/lib/i18n'
import { useAuth } from '@/hooks/useAuth'

interface NavbarProps {
  locale: Locale
}

export default function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = getTranslations(locale)
  const { user, isAuthenticated, isGuest, logout } = useAuth()

  const handleSignOut = async () => {
    try {
      await logout()
      router.push(`/${locale}`)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname === `/${locale}${path}/`
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex justify-between items-center" style={{ padding: '1rem 0' }}>
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center" style={{ gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem' }}>🌱</span>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'var(--font-weight-black)', 
              color: 'var(--primary-green)' 
            }}>
              TouchGrass
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center" style={{ gap: '2rem' }}>
            <Link
              href={`/${locale}`}
              className={`nav-link ${isActive('') || isActive('/') ? 'active' : ''}`}
            >
              {t.nav.home}
            </Link>
            {isAuthenticated && (
              <Link
                href={`/${locale}/scavenger-hunt`}
                className={`nav-link ${isActive('/scavenger-hunt') ? 'active' : ''}`}
              >
                {t.nav.scavengerHunt}
              </Link>
            )}
            <Link
              href={`/${locale}/leaderboard`}
              className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
            >
              🏆 Leaderboard
            </Link>
            <Link
              href={`/${locale}/about`}
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              {t.nav.about}
            </Link>
          </div>

          {/* Auth Links */}
          <div className="flex items-center" style={{ gap: '1rem' }}>
            {!isAuthenticated ? (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="nav-link"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', minHeight: 'auto' }}
                >
                  {t.nav.signup}
                </Link>
              </>
            ) : (
              <>
                <span style={{
                  fontSize: '0.875rem',
                  color: 'var(--medium-gray)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  {isGuest ? '👤' : '👋'} {user?.displayName || user?.email.split('@')[0]}
                  {isGuest && <span style={{ fontSize: '0.75rem', opacity: 0.7 }}> (Guest)</span>}
                </span>
                <button
                  onClick={handleSignOut}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem', minHeight: 'auto' }}
                >
                  Sign Out
                </button>
              </>
            )}
            
            {/* Language Switcher */}
            <div className="flex items-center" style={{ 
              gap: '0.5rem', 
              marginLeft: '1rem', 
              borderLeft: '1px solid var(--medium-gray)', 
              paddingLeft: '1rem' 
            }}>
              <Link
                href={pathname.replace(`/${locale}`, '/en')}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 'var(--font-weight-medium)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  backgroundColor: locale === 'en' ? 'var(--light-green)' : 'transparent',
                  color: locale === 'en' ? 'var(--primary-green)' : 'var(--medium-gray)'
                }}
              >
                EN
              </Link>
              <Link
                href={pathname.replace(`/${locale}`, '/fr')}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 'var(--font-weight-medium)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  backgroundColor: locale === 'fr' ? 'var(--light-green)' : 'transparent',
                  color: locale === 'fr' ? 'var(--primary-green)' : 'var(--medium-gray)'
                }}
              >
                FR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}