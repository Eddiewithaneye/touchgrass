'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, type Locale } from '@/lib/i18n'
import Camera from '@/components/Camera'
import { useAuth } from '@/hooks/useAuth'
import {
  detectUserLocation,
  getScavengerHunt,
  hasCustomHunt,
  US_STATES,
  DEFAULT_HUNT,
  STATE_HUNTS,
  type LocationData,
  type ScavengerHunt
} from '@/lib/scavengerHunts'

export default function ScavengerHuntPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)
  const router = useRouter()
  const { isAuthenticated, isLoading, loginAsGuest } = useAuth()
  
  const [huntStarted, setHuntStarted] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [locationStep, setLocationStep] = useState<'detecting' | 'manual' | 'hunt_selection' | 'complete'>('detecting')
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [selectedState, setSelectedState] = useState<string>('')
  const [currentHunt, setCurrentHunt] = useState<ScavengerHunt | null>(null)
  const [locationError, setLocationError] = useState<string>('')
  const [availableHunts, setAvailableHunts] = useState<ScavengerHunt[]>([])

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest()
      // The component will re-render with isAuthenticated = true
    } catch (error) {
      console.error('Guest login failed:', error)
    }
  }

  // Location detection effect
  useEffect(() => {
    if (isAuthenticated && locationStep === 'detecting') {
      detectLocation()
    }
  }, [isAuthenticated, locationStep])

  const detectLocation = async () => {
    try {
      const location = await detectUserLocation()
      if (location) {
        setUserLocation(location)
        // Set up available hunts based on location
        const hunts = getAvailableHunts(location)
        setAvailableHunts(hunts)
        setLocationStep('hunt_selection')
      } else {
        setLocationStep('manual')
      }
    } catch (error) {
      console.error('Location detection failed:', error)
      setLocationError('Unable to detect location automatically')
      setLocationStep('manual')
    }
  }

  const getAvailableHunts = (location?: LocationData): ScavengerHunt[] => {
    const hunts = [getScavengerHunt()] // Always include default hunt
    
    if (location?.state && hasCustomHunt(location.state)) {
      hunts.push(getScavengerHunt(location)) // Add state-specific hunt
    }
    
    return hunts
  }

  const handleManualStateSelection = () => {
    if (selectedState) {
      const location: LocationData = { state: selectedState }
      setUserLocation(location)
      const hunts = getAvailableHunts(location)
      setAvailableHunts(hunts)
      setLocationStep('hunt_selection')
    }
  }

  const skipLocationSelection = () => {
    const hunts = [getScavengerHunt()] // Only default hunt
    setAvailableHunts(hunts)
    setLocationStep('hunt_selection')
  }

  const selectHunt = (hunt: ScavengerHunt) => {
    setCurrentHunt(hunt)
    setLocationStep('complete')
  }

  const startHunt = () => {
    if (!currentHunt) return
    
    // Get random prompt from current hunt
    const prompts = currentHunt.prompts
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    setCurrentPrompt(randomPrompt)
    setHuntStarted(true)
  }

  const openCamera = () => {
    setShowCamera(true)
  }

  const handleSuccess = () => {
    router.push(`/${locale}/scavenger-hunt/success`)
  }

  const handleFailure = () => {
    router.push(`/${locale}/scavenger-hunt/fail`)
  }

  const getNewChallenge = () => {
    if (!currentHunt) return
    
    const prompts = currentHunt.prompts
    let newPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    // Ensure we don't get the same prompt twice in a row
    while (newPrompt === currentPrompt && prompts.length > 1) {
      newPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    }
    setCurrentPrompt(newPrompt)
    setShowCamera(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <span className="text-6xl">🌿</span>
            <h2 className="mt-6 text-3xl font-bold text-green-700">
              Ready to Explore Nature?
            </h2>
            <p className="mt-4 text-gray-600">
              Choose how you'd like to start your scavenger hunt adventure!
            </p>
            <div className="mt-8 space-y-4">
              <div className="card">
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--primary-green)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  🏆 Create Account
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--dark-gray)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Save your progress and compete on the leaderboard
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <Link
                    href={`/${locale}/login`}
                    className="btn btn-primary"
                    style={{ textAlign: 'center' }}
                  >
                    Login
                  </Link>
                  <Link
                    href={`/${locale}/signup`}
                    className="btn btn-secondary"
                    style={{ textAlign: 'center' }}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
              <div className="card">
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--dark-gray)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  👤 Play as Guest
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--dark-gray)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Quick start - no registration needed (session only)
                </p>
                <button
                  onClick={handleGuestLogin}
                  className="btn btn-accent"
                  style={{ width: '100%' }}
                >
                  🚀 Start as Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-spacing">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-700 mb-4">
              {currentHunt ? currentHunt.name : t.scavengerHunt.title}
            </h1>
            <p className="text-lg text-gray-600">
              {currentHunt ? currentHunt.description : 'Explore nature and find the items in our challenges!'}
            </p>
          </div>

          {/* Location Detection Step */}
          {locationStep === 'detecting' && (
            <div className="text-center">
              <div className="card max-w-2xl mx-auto scale-in hover-glow">
                <div className="text-6xl mb-6 bounce-in">📍</div>
                <h2 className="text-2xl font-bold text-green-700 mb-4 slide-up stagger-1">
                  Detecting Your Location
                </h2>
                <p className="text-gray-600 mb-8 slide-up stagger-2">
                  We're trying to detect your location to provide you with the best scavenger hunt experience...
                </p>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4 glow"></div>
                <button
                  onClick={() => setLocationStep('manual')}
                  className="btn btn-secondary hover-lift"
                >
                  Skip Auto-Detection
                </button>
              </div>
            </div>
          )}

          {/* Manual State Selection */}
          {locationStep === 'manual' && (
            <div className="text-center">
              <div className="card max-w-2xl mx-auto scale-in hover-glow">
                <div className="text-6xl mb-6 rotate-in">🗺️</div>
                <h2 className="text-2xl font-bold text-green-700 mb-4 slide-up stagger-1">
                  Select Your State
                </h2>
                <p className="text-gray-600 mb-6 slide-up stagger-2">
                  {locationError || 'Choose your state to get location-specific challenges, or skip for the default hunt.'}
                </p>
                
                <div className="mb-6 slide-up stagger-3">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover-glow transition-all duration-300"
                  >
                    <option value="">Select a state...</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>
                        {state} {hasCustomHunt(state) ? '🎯' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-3 slide-up stagger-4">
                  <button
                    onClick={handleManualStateSelection}
                    disabled={!selectedState}
                    className="btn btn-primary w-full hover-lift pulse"
                  >
                    {selectedState && hasCustomHunt(selectedState)
                      ? `Start ${selectedState} Hunt 🎯`
                      : 'Start Hunt'}
                  </button>
                  <button
                    onClick={skipLocationSelection}
                    className="btn btn-secondary w-full hover-lift"
                  >
                    Skip - Use Default Hunt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hunt Selection Step */}
          {locationStep === 'hunt_selection' && (
            <div className="text-center">
              <div className="card max-w-2xl mx-auto scale-in hover-glow" style={{ paddingBottom: 'var(--spacing-3xl)' }}>
                <div className="text-6xl mb-6 bounce-in">🎯</div>
                <h2 className="text-2xl font-bold text-green-700 mb-12 slide-up stagger-1">
                  Choose Your Hunt
                </h2>
                <p className="text-gray-600 mb-16 slide-up stagger-2">
                  {userLocation?.state
                    ? `We detected you're in ${userLocation.state}! Choose your adventure:`
                    : 'Choose your scavenger hunt adventure:'}
                </p>
                
                <div style={{ marginTop: 'var(--spacing-3xl)' }}>
                  {availableHunts.map((hunt, index) => (
                    <div key={hunt.id} className={`border border-gray-200 rounded-lg p-6 hover:border-green-300 transition-colors hover-lift scale-in stagger-${index + 3}`} style={{
                      marginBottom: 'var(--spacing-3xl)',
                      paddingBottom: 'var(--spacing-2xl)',
                      marginTop: index === 0 ? 'var(--spacing-2xl)' : 'var(--spacing-3xl)'
                    }}>
                      <h3 className="text-lg font-semibold text-green-700 mb-3">
                        {hunt.name} {hunt.id !== 'default' && '🎯'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6">
                        {hunt.description}
                      </p>
                      <div style={{ paddingBottom: 'var(--spacing-md)' }}>
                        <button
                          onClick={() => selectHunt(hunt)}
                          className="btn btn-primary w-full hover-lift"
                        >
                          Choose {hunt.name}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hunt Not Started */}
          {locationStep === 'complete' && !huntStarted && (
            <div className="text-center">
              <div className="card max-w-2xl mx-auto scale-in hover-glow">
                <div className="text-6xl mb-6 bounce-in">🎯</div>
                <h2 className="text-2xl font-bold text-green-700 mb-4 slide-up stagger-1">
                  Ready for Your Nature Adventure?
                </h2>
                <p className="text-gray-600 mb-8 slide-up stagger-2">
                  Click the button below to get your first challenge. Use your camera to find and capture the items we ask for!
                </p>
                <button
                  onClick={startHunt}
                  className="btn btn-primary hover-lift pulse glow"
                  style={{
                    fontSize: '1.125rem',
                    padding: 'var(--spacing-lg) var(--spacing-2xl)'
                  }}
                >
                  🌿 {t.scavengerHunt.startButton}
                </button>
              </div>
            </div>
          )}

          {/* Hunt Started */}
          {locationStep === 'complete' && huntStarted && (
            <div className="space-y-8">
              {/* Current Challenge */}
              <div className="card text-center scale-in hover-glow">
                <h2 className="text-2xl font-bold text-green-700 mb-4 slide-up">
                  Your Challenge
                </h2>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6 glow">
                  <p className="text-xl font-semibold text-green-800">
                    {t.scavengerHunt.prompt}{currentPrompt}
                  </p>
                </div>
                
                {!showCamera && (
                  <div className="space-y-4 slide-up stagger-1">
                    <button
                      onClick={openCamera}
                      className="btn btn-primary hover-lift"
                    >
                      📷 {t.scavengerHunt.cameraButton}
                    </button>
                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                      <button
                        onClick={getNewChallenge}
                        className="btn btn-secondary hover-lift"
                      >
                        🎲 Get New Challenge
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Component */}
              {showCamera && (
                <Camera
                  prompt={currentPrompt}
                  onSuccess={handleSuccess}
                  onFailure={handleFailure}
                />
              )}

              {/* Instructions */}
              <div className="card">
                <h3 className="text-xl font-bold text-green-700 mb-4">
                  How to Play
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">1.</span>
                    <p>Read your challenge above</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">2.</span>
                    <p>Go outside and look for the item</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">3.</span>
                    <p>Open your camera and take a photo</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">4.</span>
                    <p>Submit your photo and see if you found it!</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="text-xl font-bold text-blue-700 mb-4">
                  💡 Tips for Success
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• Look carefully at your surroundings</li>
                  <li>• Try different locations if you can't find the item</li>
                  <li>• Make sure your photo is clear and well-lit</li>
                  <li>• Have fun and enjoy being in nature!</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}