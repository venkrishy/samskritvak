import { useState, useEffect } from 'react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import PublicHeroSection from '@/components/public/PublicHeroSection'
import PublicContactForm from '@/components/public/PublicContactForm'
import PublicFeatureCard from '@/components/public/PublicFeatureCard'
import { Button } from '@/components/ui/button'
import { Check, Users, Globe, TrendingUp } from 'lucide-react'
export default function BusinessPage() {
  const [demoRequested, setDemoRequested] = useState(false)
  
  // Hardcoded R2 URLs for reliable loading
  const heroImage = 'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/business-hero.jpg'
  const caseStudyImage = 'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/business-case-study.jpg'

  const benefits = [
    {
      title: 'Personalized Learning',
      description: 'Customized language training programs designed for your team\'s specific needs and industry requirements.',
      icon: '🎯'
    },
    {
      title: 'Flexible Scheduling',
      description: 'Learn at your own pace with flexible scheduling that fits your team\'s busy work calendar.',
      icon: '📅'
    },
    {
      title: 'Progress Tracking',
      description: 'Comprehensive reporting and analytics to measure your team\'s language learning progress.',
      icon: '📊'
    }
  ]

  const useCases = [
    'Employee relocation support',
    'International business expansion',
    'Customer service improvement',
    'Cross-cultural team building',
    'Executive language coaching',
    'Technical language training'
  ]

  const caseStudies = [
    {
      company: 'TechCorp International',
      industry: 'Technology',
      challenge: 'Expanding to Spanish-speaking markets',
      solution: 'Spanish business communication training for 50+ employees',
      result: '40% improvement in client satisfaction scores'
    },
    {
      company: 'Global Finance Ltd',
      industry: 'Finance',
      challenge: 'Preparing team for European operations',
      solution: 'French and German language training for finance team',
      result: 'Successful launch in 3 European markets'
    }
  ]

  const handleDemoRequest = (formData) => {
    console.log('Demo requested:', formData)
    setDemoRequested(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <PublicHeroSection
        headline="Corporate language training for business"
        subtitle="Empower your team with personalized language learning solutions. Boost productivity, improve communication, and expand your global reach."
        primaryCta={{
          text: "Book a demo",
          onClick: () => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
        }}
        secondaryCta={{
          text: "Learn more",
          onClick: () => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })
        }}
        heroImage="/images/business-hero.jpg"
      />

      {/* Benefits Section */}
      <div id="benefits" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why choose BhashaBoli for your business?
            </h2>
            <p className="text-xl text-gray-600">
              Transform your team's language skills with our proven corporate training solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <PublicFeatureCard
                key={index}
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common use cases
            </h2>
            <p className="text-xl text-gray-600">
              See how businesses like yours are using BhashaBoli
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-900 font-medium">{useCase}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success stories
            </h2>
            <p className="text-xl text-gray-600">
              Real results from our corporate clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{study.company}</h3>
                  <p className="text-sm text-gray-500">{study.industry}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Challenge:</h4>
                    <p className="text-gray-600">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Solution:</h4>
                    <p className="text-gray-600">{study.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Result:</h4>
                    <p className="text-gray-600">{study.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by leading companies
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Companies trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Employees trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div id="contact-form" className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to transform your team's language skills?
            </h2>
            <p className="text-xl text-gray-600">
              Book a demo to see how BhashaBoli can help your business
            </p>
          </div>
          
          {demoRequested ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Demo Request Received!
              </h3>
              <p className="text-gray-600 mb-4">
                Thank you for your interest. Our team will contact you within 24 hours to schedule your demo.
              </p>
              <Button
                onClick={() => setDemoRequested(false)}
                variant="outline"
              >
                Request Another Demo
              </Button>
            </div>
          ) : (
            <PublicContactForm
              type="business"
              onSubmit={handleDemoRequest}
            />
          )}
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}

