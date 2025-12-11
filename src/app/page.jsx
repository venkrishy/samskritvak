import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import LoginModal from '../components/auth/LoginModal.jsx'
import PublicHeader from '../components/layout/PublicHeader.jsx'
import PublicFooter from '../components/layout/PublicFooter.jsx'
import PublicHeroSection from '../components/public/PublicHeroSection.jsx'
import PublicStatCard from '../components/public/PublicStatCard.jsx'
import PublicFeatureCard from '../components/public/PublicFeatureCard.jsx'
import PublicTestimonialCard from '../components/public/PublicTestimonialCard.jsx'
import { 
  getStats, 
  getHowItWorks, 
  getTestimonials, 
  getPopularSubjects,
  siteConfig 
} from '../config/siteConfig.js'
export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = (() => { try { return useAuth() } catch { return {} } })()

  useEffect(() => {
    if (user) {
      navigate('/courses/sanskrit', { replace: true })
    }
  }, [user, navigate])

  // Hardcoded R2 URLs for reliable loading
  const heroImage = '/images/hero-student-learning.jpg' // Keep local for fastest loading
  const testimonialImages = {
    avatar1: 'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/testimonial-avatar-1.jpg',
    avatar2: 'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/testimonial-avatar-2.jpg'
  }

  const stats = getStats()
  const features = getHowItWorks()
  const testimonials = getTestimonials()
  const popularSubjects = getPopularSubjects()

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader onLoginClick={() => setLoginOpen(true)} />
      
      {/* Hero Section */}
      <PublicHeroSection
        headline={siteConfig.siteTagline}
        subtitle={siteConfig.siteDescription}
        primaryCta={{
          text: "Find your tutor",
          onClick: () => navigate('/tutors')
        }}
        secondaryCta={{
          text: "Become a tutor",
          onClick: () => navigate('/teach')
        }}
        heroImage={heroImage}
        gradient={true}
      />

      {/* Popular Subjects */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular online courses
            </h2>
          </div>
          
          {/* Languages Section */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Languages</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {popularSubjects.languages.map((subject) => (
                <div
                  key={subject}
                  onClick={() => {
                    if (subject.toLowerCase() === 'sanskrit') {
                      navigate('/chapters/1/topics/1.2')
                    } else {
                      // For other languages, navigate to tutors page with filter
                      navigate('/tutors')
                    }
                  }}
                  className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="text-lg font-medium text-gray-900">{subject}</div>
                  <div className="text-sm text-gray-500">tutors</div>
                </div>
              ))}
            </div>
          </div>

          {/* Culture Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Culture & Heritage</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {popularSubjects.culture.map((subject) => (
                <div
                  key={subject}
                  className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="text-lg font-medium text-gray-900">{subject}</div>
                  <div className="text-sm text-gray-500">tutors</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Progress starts with the right tutor
            </h2>
            <p className="text-xl text-gray-600">
              2M+ learners. Over 100,000 tutors. Progress that's personal (and proven).
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <PublicStatCard
                key={index}
                number={stat.number}
                label={stat.label}
                description={stat.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How BhashaBoli works:
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <PublicFeatureCard
                key={index}
                number={feature.number}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lessons you'll love. Guaranteed.
            </h2>
            <p className="text-xl text-gray-600">
              Try another tutor for free if you're not satisfied.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <PublicTestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                rating={testimonial.rating}
                avatar={testimonialImages[`avatar${index + 1}`] || testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students already learning with BhashaBoli
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLoginOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-black hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.676 31.659 29.223 35 24 35 16.82 35 11 29.18 11 22S16.82 9 24 9c3.17 0 6.066 1.203 8.262 3.162l5.657-5.657C34.676 2.676 29.676 1 24 1 10.745 1 0 11.745 0 25s10.745 24 24 24 24-10.745 24-24c0-1.627-.174-3.214-.389-4.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.26 15.108 18.76 12 24 12c3.17 0 6.066 1.203 8.262 3.162l5.657-5.657C34.676 5.676 29.676 4 24 4 15.319 4 7.846 8.717 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 46c5.166 0 9.86-1.977 13.393-5.197l-6.19-5.238C29.145 37.488 26.7 38 24 38c-5.196 0-9.632-3.305-11.24-7.943l-6.51 5.02C8.737 41.74 15.86 46 24 46z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.091 3.159-3.48 5.651-6.503 7.014.001-.001 6.19 5.238 6.19 5.238C37.43 38.162 40 32.5 40 26c0-2.033-.222-3.984-.389-5.917z"/>
              </svg>
              Start Learning with Google
            </button>
            <a
              href="/tutors"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-transparent px-6 py-3 text-white hover:bg-gray-800 transition-colors"
            >
              Browse All Tutors
            </a>
          </div>
        </div>
      </div>

      <PublicFooter />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}
