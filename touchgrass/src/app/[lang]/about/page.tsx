import { getTranslations, type Locale } from '@/lib/i18n'

export default function AboutPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="section-spacing bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">
            {t.about.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the passionate team behind TouchGrass, dedicated to helping people reconnect with nature 
            and improve their well-being through outdoor exploration.
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="section-spacing bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Team Member 1 */}
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-gray-400">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-700 mb-3">
                  {t.about.name1}
                </h3>
                <div className="text-gray-600 space-y-3">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                    nostrud exercitation ullamco laboris.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-gray-400">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-700 mb-3">
                  {t.about.name2}
                </h3>
                <div className="text-gray-600 space-y-3">
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                    veritatis et quasi architecto beatae vitae dicta sunt.
                  </p>
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                    sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-gray-400">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-700 mb-3">
                  {t.about.name3}
                </h3>
                <div className="text-gray-600 space-y-3">
                  <p>
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis 
                    praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias 
                    excepturi sint occaecati cupiditate non provident.
                  </p>
                  <p>
                    Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum 
                    et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-gray-400">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-700 mb-3">
                  {t.about.name4}
                </h3>
                <div className="text-gray-600 space-y-3">
                  <p>
                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit 
                    quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, 
                    omnis dolor repellendus.
                  </p>
                  <p>
                    Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus 
                    saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-spacing bg-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-8">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8">
            We believe that connecting with nature is essential for human well-being. Our mission is to 
            make outdoor exploration accessible, engaging, and rewarding for people of all ages and backgrounds.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Environmental Awareness</h3>
              <p className="text-gray-600">Fostering a deeper appreciation for our natural environment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💚</span>
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Health & Wellness</h3>
              <p className="text-gray-600">Promoting physical and mental health through nature connection</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Community Building</h3>
              <p className="text-gray-600">Creating connections between people and their local environments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-spacing bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-12">Our Values</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  We believe everyone should have access to nature experiences, regardless of their location, 
                  physical abilities, or background.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Sustainability</h3>
                <p className="text-gray-600">
                  Our approach promotes environmental stewardship and sustainable practices that protect 
                  natural spaces for future generations.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Joy & Discovery</h3>
                <p className="text-gray-600">
                  We create experiences that spark curiosity, wonder, and joy in discovering the natural 
                  world around us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}