// Seed Script: Course Platform Initial Data
// This script populates the database with initial course platform data

import { createClient } from '@supabase/supabase-js'
import migrateSanskritCurriculum from './migrateSanskritCurriculum.js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function seedCoursePlatform() {
  try {
    console.log('🌱 Starting course platform seeding...')

    // 1. Create sample instructor profile
    console.log('Creating sample instructor...')
    const { data: instructor, error: instructorError } = await supabase
      .from('profiles')
      .insert({
        id: '00000000-0000-0000-0000-000000000001', // Sample UUID
        email: 'instructor@tattvajnana.com',
        display_name: 'Dr. Sanskrit Scholar',
        role: 'teacher',
        bio: 'Expert Sanskrit scholar with over 15 years of teaching experience. Specialized in classical Sanskrit literature and modern pedagogical methods.',
        avatar_url: 'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/instructor-avatar.jpg'
      })
      .select()
      .single()

    if (instructorError && instructorError.code !== '23505') { // Ignore duplicate key error
      console.error('Error creating instructor:', instructorError)
    } else {
      console.log('✅ Sample instructor created')
    }

    // 2. Migrate Sanskrit curriculum
    console.log('Migrating Sanskrit curriculum...')
    await migrateSanskritCurriculum()

    // 3. Create sample waitlist entries
    console.log('Creating sample waitlist entries...')
    const waitlistEntries = [
      {
        email: 'student1@example.com',
        name: 'John Doe',
        course_slug: 'hindi-fundamentals'
      },
      {
        email: 'student2@example.com',
        name: 'Jane Smith',
        course_slug: 'telugu-essentials'
      },
      {
        email: 'student3@example.com',
        name: 'Bob Johnson',
        course_slug: 'tamil-mastery'
      }
    ]

    for (const entry of waitlistEntries) {
      const { error: waitlistError } = await supabase
        .from('course_waitlist')
        .insert(entry)

      if (waitlistError && waitlistError.code !== '23505') {
        console.error('Error creating waitlist entry:', waitlistError)
      }
    }

    console.log('✅ Sample waitlist entries created')

    // 4. Create sample live sessions
    console.log('Creating sample live sessions...')
    const { data: sanskritCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'sanskrit-fundamentals')
      .single()

    if (sanskritCourse) {
      const liveSessions = [
        {
          course_id: sanskritCourse.id,
          instructor_id: '00000000-0000-0000-0000-000000000001',
          title: 'Sanskrit Pronunciation Workshop',
          scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
          duration_minutes: 60,
          status: 'scheduled'
        },
        {
          course_id: sanskritCourse.id,
          instructor_id: '00000000-0000-0000-0000-000000000001',
          title: 'Grammar Fundamentals Live Session',
          scheduled_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
          duration_minutes: 90,
          status: 'scheduled'
        }
      ]

      for (const session of liveSessions) {
        const { error: sessionError } = await supabase
          .from('live_sessions')
          .insert(session)

        if (sessionError) {
          console.error('Error creating live session:', sessionError)
        }
      }

      console.log('✅ Sample live sessions created')
    }

    // 5. Create sample course reviews (if reviews table exists)
    console.log('Creating sample course reviews...')
    const sampleReviews = [
      {
        course_id: sanskritCourse?.id,
        user_id: '00000000-0000-0000-0000-000000000002',
        rating: 5,
        review_text: 'Excellent course! The instructor explains complex concepts in a very clear way.',
        created_at: new Date().toISOString()
      },
      {
        course_id: sanskritCourse?.id,
        user_id: '00000000-0000-0000-0000-000000000003',
        rating: 5,
        review_text: 'Perfect for beginners. I learned so much in just a few weeks!',
        created_at: new Date().toISOString()
      }
    ]

    // Note: This assumes a reviews table exists. If not, skip this step.
    try {
      for (const review of sampleReviews) {
        const { error: reviewError } = await supabase
          .from('course_reviews')
          .insert(review)

        if (reviewError) {
          console.log('Reviews table may not exist, skipping...')
        }
      }
      console.log('✅ Sample reviews created')
    } catch (error) {
      console.log('Skipping reviews creation (table may not exist)')
    }

    console.log('🎉 Course platform seeding completed successfully!')
    console.log('')
    console.log('Created:')
    console.log('- Sample instructor profile')
    console.log('- Sanskrit course with full curriculum')
    console.log('- Placeholder courses for other languages')
    console.log('- Sample waitlist entries')
    console.log('- Sample live sessions')
    console.log('- Sample course reviews (if applicable)')
    console.log('')
    console.log('Your course platform is ready to use! 🚀')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCoursePlatform()
}

export default seedCoursePlatform




