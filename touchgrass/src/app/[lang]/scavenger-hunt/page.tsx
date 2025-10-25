'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, type Locale } from '@/lib/i18n'
import Camera from '@/components/Camera'
import { authApi } from '@/lib/api'

export default function ScavengerHuntPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)
  const router = useRouter()
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [huntStarted, setHuntStarted] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [showCamera, setShowCamera] = useState(false)

  // Check authentication on component mount
  useEffect(() => {
    if (authApi.isAuthenticated()) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const startHunt = () => {
    // Get random prompt
    const prompts = t.scavengerHunt.prompts
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
    const prompts = t.scavengerHunt.prompts
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
            <span className="text-6xl">🔒</span>
            <h2 className="mt-6 text-3xl font-bold text-green-700">
              Authentication Required
            </h2>
            <p className="mt-4 text-gray-600">
              Please log in or sign up to access the scavenger hunt.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/login`}
                className="btn-primary"
              >
                {t.nav.login}
              </Link>
              <Link
                href={`/${locale}/signup`}
                className="btn-secondary"
              >
                {t.nav.signup}
              </Link>
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
              {t.scavengerHunt.title}
            </h1>
            <p className="text-lg text-gray-600">
              Explore nature and find the items in our challenges!
            </p>
          </div>

          {/* Hunt Not Started */}
          {!huntStarted && (
            <div className="text-center">
              <div className="card max-w-2xl mx-auto">
                <div className="text-6xl mb-6">🎯</div>
                <h2 className="text-2xl font-bold text-green-700 mb-4">
                  Ready for Your Nature Adventure?
                </h2>
                <p className="text-gray-600 mb-8">
                  Click the button below to get your first challenge. Use your camera to find and capture the items we ask for!
                </p>
                <button
                  onClick={startHunt}
                  className="btn-primary text-lg px-8 py-4"
                >
                  🌿 {t.scavengerHunt.startButton}
                </button>
              </div>
            </div>
          )}

          {/* Hunt Started */}
          {huntStarted && (
            <div className="space-y-8">
              {/* Current Challenge */}
              <div className="card text-center">
                <h2 className="text-2xl font-bold text-green-700 mb-4">
                  Your Challenge
                </h2>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                  <p className="text-xl font-semibold text-green-800">
                    {t.scavengerHunt.prompt}{currentPrompt}
                  </p>
                </div>
                
                {!showCamera && (
                  <div className="space-y-4">
                    <button
                      onClick={openCamera}
                      className="btn-primary"
                    >
                      📷 {t.scavengerHunt.cameraButton}
                    </button>
                    <div>
                      <button
                        onClick={getNewChallenge}
                        className="btn-secondary"
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