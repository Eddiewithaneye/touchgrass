import Link from 'next/link'
import { getTranslations, type Locale } from '@/lib/i18n'

export default function HomePage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale
  const t = getTranslations(locale)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--neutral-white)' }}>
      <main>
        {/* Hero Section */}
        <section className="section bg-gradient-nature bg-animate">
          <div className="container text-center">
            <h1 className="bounce-in text-shimmer" style={{
              fontSize: '4rem',
              fontWeight: 'var(--font-weight-black)',
              marginBottom: 'var(--spacing-xl)',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {t.home.title}
            </h1>
            <p className="slide-up stagger-1" style={{
              fontSize: '1.25rem',
              color: 'var(--text-black)',
              marginBottom: 'var(--spacing-lg)',
              maxWidth: '800px',
              margin: '0 auto var(--spacing-lg) auto',
              lineHeight: '1.8'
            }}>
              {t.home.subtitle}
            </p>
            <p className="slide-up stagger-2" style={{
              fontSize: '1.125rem',
              color: 'var(--dark-gray)',
              marginBottom: 'var(--spacing-2xl)',
              maxWidth: '900px',
              margin: '0 auto var(--spacing-2xl) auto',
              lineHeight: '1.7'
            }}>
              {t.home.description}
            </p>
            <Link
              href={`/${locale}/scavenger-hunt`}
              className="btn btn-primary hover-lift glow pulse"
              style={{
                fontSize: '1.125rem',
                padding: 'var(--spacing-lg) var(--spacing-2xl)',
                minHeight: '56px'
              }}
            >
              🌱 {t.home.startButton}
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="section" style={{ background: 'var(--neutral-white)' }}>
          <div className="container">
            <h2 className="text-center" style={{ marginBottom: 'var(--spacing-3xl)' }}>
              {t.home.features.title}
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 'var(--spacing-xl)' 
            }}>
              <div className="card text-center slide-in-left stagger-1 hover-lift">
                <div className="float" style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(135deg, var(--light-green), var(--pastel-green))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-lg) auto',
                  fontSize: '2rem',
                  boxShadow: 'var(--shadow-md)'
                }}>🌳</div>
                <h3 style={{ color: 'var(--accent-green)', marginBottom: 'var(--spacing-md)' }}>
                  {t.home.features.outdoor.title}
                </h3>
                <p style={{ color: 'var(--dark-gray)', marginBottom: '0' }}>
                  {t.home.features.outdoor.description}
                </p>
              </div>
              <div className="card text-center slide-in-right stagger-2 hover-lift">
                <div className="float" style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(135deg, var(--warm-orange), var(--sunset-pink))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-lg) auto',
                  fontSize: '2rem',
                  boxShadow: 'var(--shadow-md)',
                  animationDelay: '0.5s'
                }}>🏃‍♂️</div>
                <h3 style={{ color: 'var(--accent-green)', marginBottom: 'var(--spacing-md)' }}>
                  {t.home.features.active.title}
                </h3>
                <p style={{ color: 'var(--dark-gray)', marginBottom: '0' }}>
                  {t.home.features.active.description}
                </p>
              </div>
              <div className="card text-center slide-in-left stagger-3 hover-lift">
                <div className="float" style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(135deg, var(--sky-blue), var(--bright-green))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-lg) auto',
                  fontSize: '2rem',
                  boxShadow: 'var(--shadow-md)',
                  animationDelay: '1s'
                }}>🧘‍♀️</div>
                <h3 style={{ color: 'var(--accent-green)', marginBottom: 'var(--spacing-md)' }}>
                  {t.home.features.mindful.title}
                </h3>
                <p style={{ color: 'var(--dark-gray)', marginBottom: '0' }}>
                  {t.home.features.mindful.description}
                </p>
              </div>
              <div className="card text-center slide-in-right stagger-4 hover-lift">
                <div className="float" style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(135deg, var(--accent-green), var(--primary-green))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-lg) auto',
                  fontSize: '2rem',
                  boxShadow: 'var(--shadow-md)',
                  animationDelay: '1.5s'
                }}>🎉</div>
                <h3 style={{ color: 'var(--accent-green)', marginBottom: 'var(--spacing-md)' }}>
                  {t.home.features.fun.title}
                </h3>
                <p style={{ color: 'var(--dark-gray)', marginBottom: '0' }}>
                  {t.home.features.fun.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section" style={{ background: 'var(--light-gray)' }}>
          <div className="container">
            <h2 className="text-center" style={{ marginBottom: 'var(--spacing-3xl)' }}>
              How It Works
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 'var(--spacing-xl)' 
            }}>
              <div className="card text-center scale-in stagger-1 hover-glow">
                <div className="pulse" style={{
                  width: '5rem',
                  height: '5rem',
                  background: 'linear-gradient(135deg, var(--bright-green) 0%, var(--accent-green) 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-lg) auto',
                  fontSize: '1.5rem',
                  fontWeight: 'var(--font-weight-bold)',
                  boxShadow: 'var(--shadow-lg)'
                }}>1</div>
                <h3 style={{ color: 'var(--primary-green)', marginBottom: 'var(--spacing-md)' }}>
                  Sign Up & Start
                </h3>
                <p style={{ color: 'var(--dark-gray)', marginBottom: '0' }}>
                  Create your account and begin your nature adventure with our scavenger hunt challenges.
                </p>
              </div>
              <div className="card text-center scale-in stagger-2 hover-glow">
                <div className="pulse" style={{
                  width: '5rem',
                  height: '5rem',
                  background: 'linear-gradient(135deg, var(--warm-orange) 0%, var(--sunset-pink) 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-lg) auto',
                  fontSize: '1.5rem',
                  fontWeight: 'var(--font-weight-bold)',
                  boxShadow: 'var(--shadow-lg)',
                  animationDelay: '0.5s'
                }}>2</div>
                <h3 style={{ color: 'var(--primary-green)', marginBottom: 'var(--spacing-md)' }}>
                  Explore & Find
                </h3>
                <p style={{ color: 'var(--dark-gray)', marginBottom: '0' }}>
                  Use your camera to find and capture the natural items from our challenge prompts.
                </p>
              </div>
              <div className="card text-center scale-in stagger-3 hover-glow">
                <div className="pulse" style={{
                  width: '5rem',
                  height: '5rem',
                  background: 'linear-gradient(135deg, var(--sky-blue) 0%, var(--bright-green) 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-lg) auto',
                  fontSize: '1.5rem',
                  fontWeight: 'var(--font-weight-bold)',
                  boxShadow: 'var(--shadow-lg)',
                  animationDelay: '1s'
                }}>3</div>
                <h3 style={{ color: 'var(--primary-green)', marginBottom: 'var(--spacing-md)' }}>
                  Share & Celebrate
                </h3>
                <p style={{ color: 'var(--dark-gray)', marginBottom: '0' }}>
                  Submit your findings and celebrate your connection with nature!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="section">
          <div className="container text-center">
            <div className="card bg-gradient-sky" style={{ 
              padding: 'var(--spacing-3xl)',
              color: 'white',
              textAlign: 'center'
            }}>
              <h2 style={{ 
                color: 'white', 
                marginBottom: 'var(--spacing-lg)',
                fontSize: '2.5rem'
              }}>
                Ready to Touch Grass?
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                marginBottom: 'var(--spacing-xl)',
                color: 'rgba(255,255,255,0.9)'
              }}>
                Join thousands of nature explorers and start your adventure today!
              </p>
              <Link
                href={`/${locale}/scavenger-hunt`}
                className="btn hover-lift wiggle"
                style={{
                  background: 'white',
                  color: 'var(--primary-green)',
                  fontSize: '1.125rem',
                  padding: 'var(--spacing-lg) var(--spacing-2xl)',
                  minHeight: '56px',
                  fontWeight: 'var(--font-weight-bold)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }}
              >
                🚀 {t.home.startButton}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}