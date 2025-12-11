// Waitlist API
// This file handles waitlist signup and management

import { supabase } from '../../../lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, name, courseSlug } = req.body

    // Validate required fields
    if (!email || !courseSlug) {
      return res.status(400).json({ error: 'Email and course slug are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Check if course exists
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('id, title, is_waitlist')
      .eq('slug', courseSlug)
      .single()

    if (courseError || !courseData) {
      return res.status(404).json({ error: 'Course not found' })
    }

    if (!courseData.is_waitlist) {
      return res.status(400).json({ error: 'Course is not accepting waitlist signups' })
    }

    // Check if email is already on waitlist
    const { data: existingWaitlist, error: waitlistCheckError } = await supabase
      .from('course_waitlist')
      .select('id')
      .eq('email', email)
      .eq('course_slug', courseSlug)
      .single()

    if (waitlistCheckError && waitlistCheckError.code !== 'PGRST116') {
      console.error('Error checking existing waitlist:', waitlistCheckError)
      return res.status(500).json({ error: 'Internal server error' })
    }

    if (existingWaitlist) {
      return res.status(409).json({ error: 'Email already on waitlist for this course' })
    }

    // Add to waitlist
    const { data: waitlistData, error: waitlistError } = await supabase
      .from('course_waitlist')
      .insert({
        email: email.trim(),
        name: name?.trim() || null,
        course_slug: courseSlug
      })
      .select()
      .single()

    if (waitlistError) {
      console.error('Error adding to waitlist:', waitlistError)
      return res.status(500).json({ error: 'Failed to join waitlist' })
    }

    // Send confirmation email (placeholder)
    await sendWaitlistConfirmationEmail(email, name, courseData.title)

    // Get waitlist count for response
    const { count: waitlistCount } = await supabase
      .from('course_waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('course_slug', courseSlug)

    res.status(200).json({
      success: true,
      message: 'Successfully joined waitlist',
      waitlistCount: waitlistCount || 0,
      courseTitle: courseData.title
    })
  } catch (error) {
    console.error('Waitlist API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

async function sendWaitlistConfirmationEmail(email, name, courseTitle) {
  try {
    // This is a placeholder for email sending
    // In a real implementation, you would use a service like SendGrid, Resend, or AWS SES
    console.log(`Sending waitlist confirmation email to ${email} for course: ${courseTitle}`)
    
    // Example email content:
    const emailContent = {
      to: email,
      subject: `You're on the waitlist for ${courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to the waitlist!</h1>
          <p>Hi ${name || 'there'},</p>
          <p>Thank you for joining the waitlist for <strong>${courseTitle}</strong>.</p>
          <p>We'll notify you as soon as the course becomes available. In the meantime, you can:</p>
          <ul>
            <li>Follow us on social media for updates</li>
            <li>Check out our other available courses</li>
            <li>Join our community discussions</li>
          </ul>
          <p>Best regards,<br>The TattvaJnana Team</p>
        </div>
      `
    }
    
    // Here you would actually send the email using your preferred service
    // await emailService.send(emailContent)
    
  } catch (error) {
    console.error('Error sending waitlist confirmation email:', error)
    // Don't throw error here as it shouldn't break the waitlist signup
  }
}
