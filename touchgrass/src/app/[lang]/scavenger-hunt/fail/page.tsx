import Link from 'next/link'
import { getTranslations, type Locale } from '@/lib/i18n'

export default function FailPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="card">
          {/* Encouragement Icon */}
          <div className="text-8xl mb-6">
            🌱
          </div>
          
          <h1 className="text-4xl font-bold text-yellow-700 mb-4">
            {t.scavengerHunt.failure}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Don't worry! Finding items in nature can be challenging. 
            The important thing is that you're outside exploring and connecting with the natural world.
          </p>

          {/* Encouragement Badge */}
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-1">🔍</div>
              <div className="text-sm font-semibold text-yellow-800">Keep Exploring</div>
            </div>
          </div>

          {/* Positive Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-700">+5</div>
              <div className="text-sm text-gray-600">Minutes Outdoors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-700">+1</div>
              <div className="text-sm text-gray-600">Attempt Made</div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-blue-700 mb-4">💡 Tips for Next Time</h3>
            <ul className="text-left space-y-2 text-blue-800">
              <li>• Try looking in different areas or environments</li>
              <li>• Take your time to observe your surroundings carefully</li>
              <li>• Consider different times of day for better lighting</li>
              <li>• Remember, the journey is just as important as the destination!</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/scavenger-hunt`}
              className="btn-primary"
            >
              🎯 Try Again
            </Link>
            <Link
              href={`/${locale}`}
              className="btn-secondary"
            >
              🏠 Back to Home
            </Link>
          </div>

          {/* Motivational Message */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-medium">
              🌿 Every step outside is a victory! You're building a stronger connection with nature, 
              and that's what truly matters.
            </p>
          </div>

          {/* Fun Fact */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-bold text-purple-700 mb-2">🌟 Did You Know?</h4>
            <p className="text-purple-800 text-sm">
              Studies show that spending just 20 minutes in nature can significantly reduce stress hormones 
              and improve your mood, regardless of whether you complete specific tasks!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}