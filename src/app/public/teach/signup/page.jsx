import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import PublicTutorSignupForm from '@/components/public/PublicTutorSignupForm'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function TeachSignupPage() {
  const navigate = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (formData) => {
    console.log('Tutor application submitted:', formData)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Application Submitted!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in becoming a BhashaBoli tutor. We'll review your application and get back to you within 5 business days.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
            >
              Return to Homepage
            </button>
          </div>
        </div>

        <PublicFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/teach')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Become a Tutor
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create your tutor profile
          </h1>
          <p className="text-gray-600 mt-2">
            Join thousands of tutors already earning with BhashaBoli
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <PublicTutorSignupForm onSubmit={handleSubmit} />
          </div>

          {/* Tips Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tips for a great profile
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Profile Photo</h4>
                  <p className="text-sm text-gray-600">
                    Use a clear, professional headshot. Smile and make eye contact with the camera.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Introduction Video</h4>
                  <p className="text-sm text-gray-600">
                    Keep it under 2 minutes. Introduce yourself, your teaching style, and what makes you unique.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                  <p className="text-sm text-gray-600">
                    Highlight your experience, qualifications, and teaching approach. Be authentic and engaging.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                  <p className="text-sm text-gray-600">
                    Start with a competitive rate to attract your first students. You can always adjust later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}

