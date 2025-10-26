import { getTranslations, type Locale } from '@/lib/i18n'

export default function AboutPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="section-spacing bg-gradient-to-br from-green-50 to-emerald-50 bg-animate">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6 bounce-in text-shimmer">
            {t.about.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto slide-up stagger-1">
            Meet the passionate team behind TouchGrass, dedicated to helping people reconnect with nature
            and improve their well-being through outdoor exploration.
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="section-spacing bg-gradient-to-br from-white to-green-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-16 fade-in">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Team Member 1 */}
            <div className="group scale-in stagger-1">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-green-100 hover:border-green-300 hover-lift hover-glow">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 float">
                  <span className="text-3xl text-white">🌱</span>
                </div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  {t.about.name1}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Spent 10 years coding indoors before realizing he'd never actually touched grass. Now he's on a mission to help other basement dwellers see sunlight.
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto glow"></div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group scale-in stagger-2">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-green-100 hover:border-green-300 hover-lift hover-glow">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 float" style={{ animationDelay: '0.5s' }}>
                  <span className="text-3xl text-white">🌿</span>
                </div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  {t.about.name2}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Former Discord moderator who discovered that grass is actually pretty soft. Still thinks trees are just really big houseplants.
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto glow"></div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="group scale-in stagger-3">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-green-100 hover:border-green-300 hover-lift hover-glow">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 float" style={{ animationDelay: '1s' }}>
                  <span className="text-3xl text-white">🍃</span>
                </div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  {t.about.name3}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Builds servers so robust they could survive in the wilderness. Ironically, he couldn't survive 5 minutes without WiFi until recently.
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full mx-auto glow"></div>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="group scale-in stagger-4">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-green-100 hover:border-green-300 hover-lift hover-glow">
                <div className="w-24 h-24 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 float" style={{ animationDelay: '1.5s' }}>
                  <span className="text-3xl text-white">🌳</span>
                </div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  {t.about.name4}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Coordinates our team from his gaming chair. His idea of "outdoor experience" used to be opening a window while playing Minecraft.
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-lime-400 to-green-500 rounded-full mx-auto glow"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-spacing bg-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-8 bounce-in">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8 slide-up stagger-1">
            We believe that connecting with nature is essential for human well-being. Our mission is to
            make outdoor exploration accessible, engaging, and rewarding for people of all ages and backgrounds.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center slide-in-left stagger-1 hover-lift">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 pulse hover-grow">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Environmental Awareness</h3>
              <p className="text-gray-600">Fostering a deeper appreciation for our natural environment</p>
            </div>
            <div className="text-center slide-up stagger-2 hover-lift">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 pulse hover-grow" style={{ animationDelay: '0.5s' }}>
                <span className="text-2xl">💚</span>
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Health & Wellness</h3>
              <p className="text-gray-600">Promoting physical and mental health through nature connection</p>
            </div>
            <div className="text-center slide-in-right stagger-3 hover-lift">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 pulse hover-grow" style={{ animationDelay: '1s' }}>
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Community Building</h3>
              <p className="text-gray-600">Creating connections between people and their local environments</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}