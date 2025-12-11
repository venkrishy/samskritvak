// Lemon Squeezy Webhook Handler
// This file handles webhook events from Lemon Squeezy for payment processing

import { supabase } from '../../lib/supabase.js'
import { lemonSqueezy } from '../../lib/lemonsqueezy.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data: event } = req.body
    const signature = req.headers['x-signature']
    const webhookSecret = import.meta.env.VITE_LEMON_SQUEEZY_WEBHOOK_SECRET

    // Verify webhook signature
    if (!lemonSqueezy.verifyWebhookSignature(JSON.stringify(req.body), signature, webhookSecret)) {
      console.error('Invalid webhook signature')
      return res.status(401).json({ error: 'Invalid signature' })
    }

    // Handle different event types
    switch (event.type) {
      case 'order_created':
        await handleOrderCreated(event.data)
        break
      case 'order_updated':
        await handleOrderUpdated(event.data)
        break
      case 'subscription_created':
        await handleSubscriptionCreated(event.data)
        break
      case 'subscription_updated':
        await handleSubscriptionUpdated(event.data)
        break
      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function handleOrderCreated(orderData) {
  try {
    const { id: orderId, attributes } = orderData
    const { total, status, customer_email, customer_name } = attributes

    // Get course ID from custom data
    const courseId = attributes.custom?.course_id
    if (!courseId) {
      console.error('No course ID found in order custom data')
      return
    }

    // Get user ID from email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', customer_email)
      .single()

    if (userError) {
      console.error('Error finding user:', userError)
      return
    }

    if (!userData) {
      console.error('User not found for email:', customer_email)
      return
    }

    // Create enrollment if order is paid
    if (status === 'paid') {
      const { error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: userData.id,
          course_id: courseId,
          enrolled_at: new Date().toISOString()
        })

      if (enrollmentError) {
        console.error('Error creating enrollment:', enrollmentError)
        return
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('course_payments')
        .insert({
          user_id: userData.id,
          course_id: courseId,
          lemon_squeezy_order_id: orderId,
          amount_usd: parseFloat(total),
          status: 'completed',
          payment_date: new Date().toISOString()
        })

      if (paymentError) {
        console.error('Error creating payment record:', paymentError)
        return
      }

      // Send confirmation email (placeholder)
      console.log(`Enrollment created for user ${userData.id} in course ${courseId}`)
    }
  } catch (error) {
    console.error('Error handling order created:', error)
  }
}

async function handleOrderUpdated(orderData) {
  try {
    const { id: orderId, attributes } = orderData
    const { status } = attributes

    // Update payment status
    const { error: paymentError } = await supabase
      .from('course_payments')
      .update({ status: status === 'paid' ? 'completed' : 'failed' })
      .eq('lemon_squeezy_order_id', orderId)

    if (paymentError) {
      console.error('Error updating payment status:', paymentError)
      return
    }

    // If order is now paid, create enrollment
    if (status === 'paid') {
      const { data: paymentData, error: paymentFetchError } = await supabase
        .from('course_payments')
        .select('user_id, course_id')
        .eq('lemon_squeezy_order_id', orderId)
        .single()

      if (paymentFetchError) {
        console.error('Error fetching payment data:', paymentFetchError)
        return
      }

      const { error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: paymentData.user_id,
          course_id: paymentData.course_id,
          enrolled_at: new Date().toISOString()
        })

      if (enrollmentError) {
        console.error('Error creating enrollment:', enrollmentError)
        return
      }
    }
  } catch (error) {
    console.error('Error handling order updated:', error)
  }
}

async function handleSubscriptionCreated(subscriptionData) {
  // Handle subscription creation if needed
  console.log('Subscription created:', subscriptionData)
}

async function handleSubscriptionUpdated(subscriptionData) {
  // Handle subscription updates if needed
  console.log('Subscription updated:', subscriptionData)
}
