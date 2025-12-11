import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function PublicContactForm({ 
  type = 'general',
  onSubmit,
  className = "" 
}) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    number_of_learners: '',
    message: '',
    preferred_language: 'en'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          inquiry_type: type,
          number_of_learners: formData.number_of_learners ? parseInt(formData.number_of_learners) : null
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          company_name: '',
          number_of_learners: '',
          message: '',
          preferred_language: 'en'
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {type === 'business' ? 'Get a Demo' : 'Contact Us'}
        </h3>
        <p className="text-sm text-gray-600">
          {type === 'business' 
            ? 'Schedule a demo to see how BhashaBoli can help your team learn languages.'
            : 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            required
            value={formData.full_name}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Company Name (for business) */}
        {type === 'business' && (
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <Input
              id="company_name"
              name="company_name"
              type="text"
              required
              value={formData.company_name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        )}

        {/* Number of Learners (for business) */}
        {type === 'business' && (
          <div>
            <label htmlFor="number_of_learners" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Learners
            </label>
            <Input
              id="number_of_learners"
              name="number_of_learners"
              type="number"
              min="1"
              value={formData.number_of_learners}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        )}

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full"
            placeholder={type === 'business' 
              ? 'Tell us about your language learning goals and how we can help...'
              : 'How can we help you?'
            }
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          {isSubmitting ? 'Sending...' : (type === 'business' ? 'Request Demo' : 'Send Message')}
        </Button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="text-green-600 text-sm text-center">
            Thank you! We'll get back to you soon.
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="text-red-600 text-sm text-center">
            Something went wrong. Please try again.
          </div>
        )}
      </form>
    </div>
  )
}

