import { useState } from 'react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import PublicContactForm from '@/components/public/PublicContactForm'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (formData) => {
    console.log('Contact form submitted:', formData)
    setFormSubmitted(true)
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: 'Email',
      details: ['support@bhashaboli.com', 'business@bhashaboli.com'],
      description: 'We typically respond within 24 hours'
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', 'Mon-Fri 9AM-6PM EST'],
      description: 'Speak directly with our support team'
    },
    {
      icon: <MapPin className="w-6 h-6 text-red-600" />,
      title: 'Office',
      details: ['1309 Beacon Street, Suite 300', 'Brookline, MA 02446'],
      description: 'Visit us during business hours'
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: 'Business Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM'],
      description: 'Eastern Time Zone'
    }
  ]

  const faqs = [
    {
      question: 'How quickly do you respond to inquiries?',
      answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line.'
    },
    {
      question: 'Do you offer phone support?',
      answer: 'Yes! Our support team is available Monday through Friday, 9AM to 6PM EST. You can reach us at +1 (555) 123-4567.'
    },
    {
      question: 'Can I schedule a demo for my business?',
      answer: 'Absolutely! Use the contact form above and select "Business" as your inquiry type. We\'ll schedule a personalized demo for your team.'
    },
    {
      question: 'Do you have a mobile app?',
      answer: 'Yes! BhashaBoli is available on both iOS and Android. Download from the App Store or Google Play Store.'
    }
  ]

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Message Sent Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <Button
              onClick={() => setFormSubmitted(false)}
              variant="outline"
            >
              Send Another Message
            </Button>
          </div>
        </div>

        <PublicFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <PublicContactForm
              type="general"
              onSubmit={handleSubmit}
            />
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700 mb-1">
                          {detail}
                        </p>
                      ))}
                      <p className="text-sm text-gray-500 mt-2">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}

