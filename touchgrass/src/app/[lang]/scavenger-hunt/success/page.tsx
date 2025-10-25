import Link from 'next/link'
import { getTranslations, type Locale } from '@/lib/i18n'

export default function SuccessPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="card">
          {/* Success Animation */}
          <div className="text-8xl mb-6 animate-bounce">
            🎉
          </div>
          
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            {t.scavengerHunt.success}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Congratulations! You successfully found the item and completed this challenge. 
            You're getting great at connecting with nature!
          </p>

          {/* Achievement Badge */}
          <div className="bg-green-100 border-2 border-green-300 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-1">🏆</div>
              <div className="text-sm font-semibold text-green-800">Nature Explorer</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">+1</div>
              <div className="text-sm text-gray-600">Item Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">+10</div>
              <div className="text-sm text-gray-600">Nature Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">+5</div>
              <div className="text-sm text-gray-600">Minutes Outdoors</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/scavenger-hunt`}
              className="btn-primary"
            >
              🎯 Try Another Challenge
            </Link>
            <Link
              href={`/${locale}`}
              className="btn-secondary"
            >
              🏠 Back to Home
            </Link>
          </div>

          {/* Encouragement */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-medium">
              💚 Keep exploring! Every moment in nature helps improve your well-being and connection to the environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}