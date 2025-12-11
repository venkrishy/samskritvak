import { useState } from 'react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import PublicHeroSection from '@/components/public/PublicHeroSection'
import PublicStatCard from '@/components/public/PublicStatCard'
import PublicFeatureCard from '@/components/public/PublicFeatureCard'
import { Button } from '@/components/ui/button'
import { TrendingUp, Target, Award, Users } from 'lucide-react'

export default function ProvenProgressPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  const stats = [
    { number: '97%', label: 'of learners say practicing with a real person is very important', description: 'From the 2025 BhashaBoli Efficiency Study' },
    { number: '2M+', label: 'learners worldwide', description: 'Trust BhashaBoli for their language learning' },
    { number: '300,000+', label: '5-star reviews', description: 'From satisfied students' },
    { number: '4.8', label: 'average rating', description: 'On the App Store' }
  ]

  const features = [
    {
      title: 'Personalized Learning Paths',
      description: 'AI-powered recommendations that adapt to your learning style and pace.',
      icon: <Target className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Progress Tracking',
      description: 'Detailed analytics showing your improvement across all language skills.',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />
    },
    {
      title: 'Achievement System',
      description: 'Earn badges and certificates as you reach new milestones in your learning journey.',
      icon: <Award className="w-8 h-8 text-yellow-600" />
    },
    {
      title: 'Community Support',
      description: 'Connect with fellow learners and practice together in our supportive community.',
      icon: <Users className="w-8 h-8 text-purple-600" />
    }
  ]

  const researchFindings = [
    {
      title: 'Faster Learning with Real Tutors',
      description: 'Students learn 3x faster with personalized tutoring compared to self-study methods.',
      percentage: '300%'
    },
    {
      title: 'Improved Retention',
      description: 'Regular practice with native speakers leads to 85% better long-term retention.',
      percentage: '85%'
    },
    {
      title: 'Confidence Building',
      description: '94% of students report increased confidence in speaking after just 4 weeks.',
      percentage: '94%'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader onLoginClick={() => setLoginOpen(true)} />
      
      {/* Hero Section */}
      <PublicHeroSection
        headline="Proven progress that's personal"
        subtitle="Track your language learning journey with data-driven insights and personalized recommendations. See real results with our proven methodology."
        primaryCta={{
          text: "Start your journey",
          onClick: () => setLoginOpen(true)
        }}
        secondaryCta={{
          text: "Learn more",
          onClick: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
        }}
        heroImage="/images/progress-dashboard.jpg"
        gradient={true}
      />

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The numbers speak for themselves
            </h2>
            <p className="text-xl text-gray-600">
              Real data from millions of successful language learners
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

      {/* Features Section */}
      <div id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How we measure progress
            </h2>
            <p className="text-xl text-gray-600">
              Advanced analytics and personalized insights to track your language learning journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Findings */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Research-backed results
            </h2>
            <p className="text-xl text-gray-600">
              Our methodology is based on extensive research in language acquisition
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchFindings.map((finding, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {finding.percentage}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {finding.title}
                </h3>
                <p className="text-gray-600">
                  {finding.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Dashboard Preview */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your progress dashboard
            </h2>
            <p className="text-xl text-gray-600">
              Visualize your learning journey with detailed analytics and insights
            </p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Learning Analytics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Speaking</span>
                      <span className="text-sm text-gray-500">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Listening</span>
                      <span className="text-sm text-gray-500">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Reading</span>
                      <span className="text-sm text-gray-500">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Writing</span>
                      <span className="text-sm text-gray-500">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <Award className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-gray-700">Completed 10 lessons</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Target className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">7-day streak</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Level up to Intermediate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start tracking your progress today
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join millions of learners who are already seeing real results with BhashaBoli
          </p>
          <Button
            onClick={() => setLoginOpen(true)}
            className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg"
          >
            Start Learning Now
          </Button>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}

