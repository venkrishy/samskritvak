import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, ChevronRight, Upload, Video, Calendar } from 'lucide-react'

export default function PublicTutorSignupForm({ 
  onSubmit,
  className = "" 
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    full_name: '',
    email: '',
    phone: '',
    languages_to_teach: [],
    native_languages: [],
    teaching_experience_years: '',
    education: '',
    certifications: '',
    why_teach: '',
    
    // Step 2: Media
    profile_photo_url: '',
    intro_video_url: '',
    
    // Step 3: Availability & Pricing
    availability_json: {},
    desired_hourly_rate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    { number: 1, title: 'Basic Information', icon: '👤' },
    { number: 2, title: 'Photo & Video', icon: '📸' },
    { number: 3, title: 'Availability & Pricing', icon: '💰' }
  ]

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Sanskrit'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      const currentValues = formData[name] || []
      if (checked) {
        setFormData(prev => ({ ...prev, [name]: [...currentValues, value] }))
      } else {
        setFormData(prev => ({ ...prev, [name]: currentValues.filter(v => v !== value) }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/tutor-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSubmit?.(formData)
      } else {
        console.error('Error submitting application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <Input
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <Input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages you want to teach *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((language) => (
            <label key={language} className="flex items-center">
              <input
                type="checkbox"
                name="languages_to_teach"
                value={language}
                checked={formData.languages_to_teach?.includes(language)}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teaching Experience (years)
        </label>
        <Input
          name="teaching_experience_years"
          type="number"
          min="0"
          value={formData.teaching_experience_years}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Education
        </label>
        <Input
          name="education"
          value={formData.education}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Why do you want to teach?
        </label>
        <Textarea
          name="why_teach"
          rows={3}
          value={formData.why_teach}
          onChange={handleChange}
          placeholder="Tell us about your passion for teaching languages..."
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Upload a professional headshot
          </p>
          <input
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={(e) => {
              // Handle file upload
              console.log('Photo upload:', e.target.files[0])
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Introduction Video
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Record a 2-minute introduction video
          </p>
          <input
            type="file"
            accept="video/*"
            className="mt-2"
            onChange={(e) => {
              // Handle video upload
              console.log('Video upload:', e.target.files[0])
            }}
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Set your available hours (coming soon)
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Desired Hourly Rate (USD)
        </label>
        <Input
          name="desired_hourly_rate"
          type="number"
          min="5"
          step="1"
          value={formData.desired_hourly_rate}
          onChange={handleChange}
          placeholder="e.g., 15"
        />
        <p className="text-sm text-gray-500 mt-1">
          Most tutors charge $15-25 per hour
        </p>
      </div>
    </div>
  )

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.number}
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-200 mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white hover:bg-gray-800"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

