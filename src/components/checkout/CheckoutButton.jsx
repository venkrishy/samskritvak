import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { createCheckoutURL, handlePaymentSuccess } from '../../lib/lemonsqueezy.js'
import { Button } from '../ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Clock
} from 'lucide-react'

export default function CheckoutButton({ course, className = '' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (course.price_usd === 0) {
      // Free course - enroll directly
      await enrollFreeCourse()
    } else {
      // Paid course - show checkout options
      setShowCheckout(true)
    }
  }

  const enrollFreeCourse = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id
        })

      if (error) {
        console.error('Error enrolling in free course:', error)
        return
      }

      navigate(`/courses/${course.slug}/learn`)
    } catch (error) {
      console.error('Error enrolling in free course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLemonSqueezyCheckout = async () => {
    setLoading(true)
    try {
      const checkoutURL = await createCheckoutURL(course, user)
      window.location.href = checkoutURL
    } catch (error) {
      console.error('Error creating checkout:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStripeCheckout = async () => {
    // Placeholder for Stripe integration
    console.log('Stripe checkout not implemented yet')
  }

  if (course.price_usd === 0) {
    return (
      <Button
        onClick={handleEnroll}
        disabled={loading}
        className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 ${className}`}
      >
        {loading ? (
          'Enrolling...'
        ) : (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            Enroll Free
            <ArrowRight className="h-5 w-5 ml-2" />
          </>
        )}
      </Button>
    )
  }

  if (showCheckout) {
    return (
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleLemonSqueezyCheckout}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Pay with Lemon Squeezy
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">Secure payment processing</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <Shield className="h-3 w-3 mr-1" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Lock className="h-3 w-3 mr-1" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 ${className}`}
    >
      {loading ? (
        'Processing...'
      ) : (
        <>
          <CreditCard className="h-5 w-5 mr-2" />
          Enroll Now - ${course.price_usd}
          <ArrowRight className="h-5 w-5 ml-2" />
        </>
      )}
    </Button>
  )
}
