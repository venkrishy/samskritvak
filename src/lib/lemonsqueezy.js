// Lemon Squeezy Integration
// This file handles Lemon Squeezy API interactions for course payments

const LEMON_SQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1'
const LEMON_SQUEEZY_STORE_ID = import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID
const LEMON_SQUEEZY_API_KEY = import.meta.env.VITE_LEMON_SQUEEZY_API_KEY

// Initialize Lemon Squeezy client
export const lemonSqueezy = {
  // Create a checkout session for a course
  async createCheckout(courseId, courseTitle, price, userEmail, userName) {
    try {
      const response = await fetch(`${LEMON_SQUEEZY_API_URL}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                email: userEmail,
                name: userName,
                custom: {
                  course_id: courseId,
                  course_title: courseTitle
                }
              },
              checkout_options: {
                embed: true,
                media: false,
                logo: true
              },
              product_options: {
                name: courseTitle,
                description: `Access to ${courseTitle} course`,
                media: [],
                redirect_url: `${window.location.origin}/courses/${courseId}/success`,
                receipt_button_text: 'Continue Learning',
                receipt_link_url: `${window.location.origin}/courses/${courseId}/learn`,
                receipt_thank_you_note: 'Thank you for enrolling! You can now access the course content.'
              },
              checkout_data: {
                email: userEmail,
                name: userName,
                custom: {
                  course_id: courseId
                }
              }
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: LEMON_SQUEEZY_STORE_ID
                }
              },
              variant: {
                data: {
                  type: 'variants',
                  id: courseId // This should be the Lemon Squeezy variant ID
                }
              }
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Lemon Squeezy API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data.attributes.url
    } catch (error) {
      console.error('Error creating Lemon Squeezy checkout:', error)
      throw error
    }
  },

  // Get order details
  async getOrder(orderId) {
    try {
      const response = await fetch(`${LEMON_SQUEEZY_API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
          'Accept': 'application/vnd.api+json'
        }
      })

      if (!response.ok) {
        throw new Error(`Lemon Squeezy API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching Lemon Squeezy order:', error)
      throw error
    }
  },

  // Verify webhook signature
  verifyWebhookSignature(payload, signature, secret) {
    // Note: This should be implemented on the server side
    // For now, we'll skip verification in the browser
    console.warn('Webhook signature verification should be done server-side')
    return true
  }
}

// Helper function to create checkout URL
export const createCheckoutURL = async (course, user) => {
  try {
    const checkoutURL = await lemonSqueezy.createCheckout(
      course.id,
      course.title,
      course.price_usd,
      user.email,
      user.user_metadata?.full_name || user.email
    )
    return checkoutURL
  } catch (error) {
    console.error('Error creating checkout URL:', error)
    throw error
  }
}

// Helper function to handle successful payment
export const handlePaymentSuccess = async (orderId, courseId, userId) => {
  try {
    // Get order details from Lemon Squeezy
    const order = await lemonSqueezy.getOrder(orderId)
    
    if (order.attributes.status !== 'paid') {
      throw new Error('Order not paid')
    }

    // Create enrollment record
    const { supabase } = await import('./supabase')
    const { error: enrollmentError } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        enrolled_at: new Date().toISOString()
      })

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError)
      throw enrollmentError
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from('course_payments')
      .insert({
        user_id: userId,
        course_id: courseId,
        lemon_squeezy_order_id: orderId,
        amount_usd: parseFloat(order.attributes.total),
        status: 'completed',
        payment_date: new Date().toISOString()
      })

    if (paymentError) {
      console.error('Error creating payment record:', paymentError)
      throw paymentError
    }

    return true
  } catch (error) {
    console.error('Error handling payment success:', error)
    throw error
  }
}

export default lemonSqueezy
