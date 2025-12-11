import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import PublicHeroSection from '@/components/public/PublicHeroSection'
import PublicFeatureCard from '@/components/public/PublicFeatureCard'
import PublicStatCard from '@/components/public/PublicStatCard'
import { Button } from '@/components/ui/button'
import { ChevronDown, Check } from 'lucide-react'
import { 
  getTutorBenefits, 
  getFaqs, 
  siteConfig 
} from '@/config/siteConfig'
export default function TeachPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  
  // Hardcoded R2 URLs for reliable loading
  const heroImage = 'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/teach-hero.jpg'
  const benefitsImage = 'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/teach-benefits.jpg'

  const steps = [
    {
      number: 1,
      title: 'Sign up',
      description: 'to create your tutor profile',
      icon: '📝'
    },
    {
      number: 2,
      title: 'Get approved',
      description: 'by our team in 5 business days',
      icon: '✅'
    },
    {
      number: 3,
      title: 'Start earning',
      description: 'by teaching students all over the world!',
      icon: '💰'
    }
  ]

  const benefits = getTutorBenefits()

  const features = [
    'Steady stream of new students',
    'Smart calendar',
    'Interactive classroom',
    'Convenient payment methods',
    'Professional development webinars',
    'Supportive tutor community'
  ]

  const faqs = getFaqs()

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <PublicHeroSection
        headline="Make a living by teaching the largest community of learners worldwide"
        subtitle="Join thousands of tutors already earning with BhashaBoli. Set your own schedule, choose your rates, and teach from anywhere."
        primaryCta={{
          text: "Create a tutor profile now",
          onClick: () => navigate('/teach/signup')
        }}
        heroImage="/images/teach-hero.jpg"
      />

      {/* Steps Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to become a tutor
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <PublicFeatureCard
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Teach students from over 180 countries
            </h2>
            <p className="text-xl text-gray-600">
              BhashaBoli tutors teach 800,000+ students globally. Join us and you'll have everything you need to teach successfully.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PublicStatCard
              number="800,000+"
              label="Students taught"
              description="Globally"
            />
            <PublicStatCard
              number="180+"
              label="Countries"
              description="Worldwide reach"
            />
            <PublicStatCard
              number="$550"
              label="Weekly earnings"
              description="Top tutors"
            />
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Everything you need to teach successfully
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl font-medium text-gray-900 mb-4">
            "BhashaBoli allowed me to make a living without leaving home!"
          </blockquote>
          <div className="text-lg text-gray-600">
            Krista A. • English tutor
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get paid to teach online
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Connect with thousands of learners around the world and teach from your living room
          </p>
          <Button
            onClick={() => navigate('/teach/signup')}
            className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg"
          >
            Create a tutor profile now
          </Button>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
