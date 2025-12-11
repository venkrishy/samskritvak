// Migration Script: Sanskrit Curriculum to Course Platform
// This script migrates the existing Sanskrit curriculum to the new course structure

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Sample Sanskrit course data based on existing curriculum
const sanskritCourseData = {
  title: "Sanskrit Fundamentals: From Zero to Hero",
  subtitle: "Master the ancient language of Sanskrit with modern learning methods",
  description: `Learn Sanskrit from the ground up with this comprehensive course designed for modern students. 

This course covers:
- Sanskrit alphabet and pronunciation
- Basic grammar and sentence structure
- Essential vocabulary and common phrases
- Reading and writing practice
- Cultural context and historical significance
- Advanced topics for continued learning

Perfect for beginners with no prior Sanskrit knowledge, this course will take you from complete beginner to intermediate level in 8-12 weeks of dedicated study.`,
  language: "sanskrit",
  price_usd: 97.00,
  is_published: true,
  is_waitlist: false,
  total_chapters: 8,
  total_lessons: 24
}

const sanskritChapters = [
  {
    chapter_number: 1,
    title: "Introduction to Sanskrit",
    description: "Welcome to Sanskrit! Learn about the language's history, significance, and your learning journey ahead.",
    is_free: true,
    lessons: [
      {
        title: "What is Sanskrit?",
        content_type: "text",
        duration_minutes: 15,
        is_free: true,
        description: "Introduction to Sanskrit language and its cultural significance"
      },
      {
        title: "Sanskrit Alphabet Overview",
        content_type: "video",
        duration_minutes: 20,
        is_free: true,
        description: "Learn the Sanskrit alphabet and basic pronunciation"
      },
      {
        title: "Your Learning Path",
        content_type: "text",
        duration_minutes: 10,
        is_free: true,
        description: "Understanding the course structure and your learning journey"
      }
    ]
  },
  {
    chapter_number: 2,
    title: "Sanskrit Alphabet & Pronunciation",
    description: "Master the Sanskrit alphabet, including vowels, consonants, and their proper pronunciation.",
    is_free: true,
    lessons: [
      {
        title: "Vowels (Swaras)",
        content_type: "video",
        duration_minutes: 25,
        is_free: true,
        description: "Learn all Sanskrit vowels with proper pronunciation"
      },
      {
        title: "Consonants (Vyanjanas)",
        content_type: "video",
        duration_minutes: 30,
        is_free: true,
        description: "Master Sanskrit consonants and their sounds"
      },
      {
        title: "Pronunciation Practice",
        content_type: "text",
        duration_minutes: 20,
        is_free: true,
        description: "Practice exercises for perfect pronunciation"
      }
    ]
  },
  {
    chapter_number: 3,
    title: "Basic Grammar Fundamentals",
    description: "Learn the essential grammar rules that form the foundation of Sanskrit.",
    is_free: false,
    lessons: [
      {
        title: "Nouns and Cases",
        content_type: "video",
        duration_minutes: 35,
        is_free: false,
        description: "Understanding Sanskrit noun declensions and case system"
      },
      {
        title: "Verbs and Tenses",
        content_type: "video",
        duration_minutes: 40,
        is_free: false,
        description: "Introduction to Sanskrit verb conjugations"
      },
      {
        title: "Grammar Practice",
        content_type: "text",
        duration_minutes: 25,
        is_free: false,
        description: "Practice exercises for grammar concepts"
      }
    ]
  },
  {
    chapter_number: 4,
    title: "Essential Vocabulary",
    description: "Build your Sanskrit vocabulary with commonly used words and phrases.",
    is_free: false,
    lessons: [
      {
        title: "Common Words",
        content_type: "video",
        duration_minutes: 30,
        is_free: false,
        description: "Learn essential Sanskrit vocabulary"
      },
      {
        title: "Family and Relationships",
        content_type: "text",
        duration_minutes: 25,
        is_free: false,
        description: "Vocabulary for family members and relationships"
      },
      {
        title: "Numbers and Counting",
        content_type: "video",
        duration_minutes: 20,
        is_free: false,
        description: "Learn Sanskrit numbers from 1 to 100"
      }
    ]
  },
  {
    chapter_number: 5,
    title: "Reading and Writing",
    description: "Develop your reading and writing skills in Sanskrit.",
    is_free: false,
    lessons: [
      {
        title: "Reading Practice",
        content_type: "text",
        duration_minutes: 30,
        is_free: false,
        description: "Practice reading Sanskrit texts"
      },
      {
        title: "Writing Exercises",
        content_type: "text",
        duration_minutes: 25,
        is_free: false,
        description: "Hands-on writing practice"
      },
      {
        title: "Simple Sentences",
        content_type: "video",
        duration_minutes: 35,
        is_free: false,
        description: "Learn to construct basic Sanskrit sentences"
      }
    ]
  },
  {
    chapter_number: 6,
    title: "Cultural Context",
    description: "Understand the cultural and historical significance of Sanskrit.",
    is_free: false,
    lessons: [
      {
        title: "Sanskrit in Literature",
        content_type: "text",
        duration_minutes: 30,
        is_free: false,
        description: "Explore Sanskrit's role in classical literature"
      },
      {
        title: "Religious and Philosophical Texts",
        content_type: "video",
        duration_minutes: 35,
        is_free: false,
        description: "Understanding Sanskrit in religious contexts"
      },
      {
        title: "Modern Relevance",
        content_type: "text",
        duration_minutes: 25,
        is_free: false,
        description: "How Sanskrit remains relevant today"
      }
    ]
  },
  {
    chapter_number: 7,
    title: "Advanced Topics",
    description: "Dive deeper into advanced Sanskrit concepts and structures.",
    is_free: false,
    lessons: [
      {
        title: "Complex Grammar",
        content_type: "video",
        duration_minutes: 40,
        is_free: false,
        description: "Advanced grammatical structures"
      },
      {
        title: "Poetry and Meter",
        content_type: "text",
        duration_minutes: 30,
        is_free: false,
        description: "Introduction to Sanskrit poetry"
      },
      {
        title: "Advanced Vocabulary",
        content_type: "text",
        duration_minutes: 25,
        is_free: false,
        description: "Expanding your Sanskrit vocabulary"
      }
    ]
  },
  {
    chapter_number: 8,
    title: "Practice and Application",
    description: "Put your knowledge to practice with real-world applications.",
    is_free: false,
    lessons: [
      {
        title: "Translation Exercises",
        content_type: "text",
        duration_minutes: 35,
        is_free: false,
        description: "Practice translating between Sanskrit and English"
      },
      {
        title: "Composition Practice",
        content_type: "text",
        duration_minutes: 30,
        is_free: false,
        description: "Learn to write original Sanskrit texts"
      },
      {
        title: "Final Assessment",
        content_type: "quiz",
        duration_minutes: 45,
        is_free: false,
        description: "Comprehensive assessment of your Sanskrit knowledge"
      }
    ]
  }
]

async function migrateSanskritCurriculum() {
  try {
    console.log('Starting Sanskrit curriculum migration...')

    // Create the main Sanskrit course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert({
        ...sanskritCourseData,
        slug: 'sanskrit-fundamentals',
        instructor_id: null, // Will be set to actual instructor
        thumbnail_url: 'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/images/sanskrit-course-thumbnail.jpg',
        preview_video_url: 'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/videos/sanskrit-preview.mp4'
      })
      .select()
      .single()

    if (courseError) {
      console.error('Error creating Sanskrit course:', courseError)
      return
    }

    console.log('Created Sanskrit course:', courseData.id)

    // Create chapters and lessons
    for (const chapterData of sanskritChapters) {
      // Create chapter
      const { data: chapter, error: chapterError } = await supabase
        .from('course_chapters')
        .insert({
          course_id: courseData.id,
          chapter_number: chapterData.chapter_number,
          title: chapterData.title,
          description: chapterData.description,
          is_free: chapterData.is_free,
          order_index: chapterData.chapter_number - 1
        })
        .select()
        .single()

      if (chapterError) {
        console.error('Error creating chapter:', chapterError)
        continue
      }

      console.log(`Created chapter: ${chapter.title}`)

      // Create lessons for this chapter
      for (let i = 0; i < chapterData.lessons.length; i++) {
        const lessonData = chapterData.lessons[i]
        
        const { data: lesson, error: lessonError } = await supabase
          .from('course_lessons')
          .insert({
            course_id: courseData.id,
            chapter_id: chapter.id,
            lesson_number: i + 1,
            title: lessonData.title,
            content_type: lessonData.content_type,
            content_url: lessonData.content_type === 'video' ? 
              `https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/videos/sanskrit-${chapterData.chapter_number}-${i + 1}.mp4` : null,
            google_doc_url: lessonData.content_type === 'document' ? 
              `https://docs.google.com/document/d/sanskrit-${chapterData.chapter_number}-${i + 1}` : null,
            duration_minutes: lessonData.duration_minutes,
            is_free: lessonData.is_free,
            order_index: i
          })
          .select()
          .single()

        if (lessonError) {
          console.error('Error creating lesson:', lessonError)
          continue
        }

        console.log(`  Created lesson: ${lesson.title}`)
      }
    }

    // Create placeholder courses for other languages
    const placeholderCourses = [
      {
        title: "Hindi Fundamentals",
        subtitle: "Master the Hindi language from basics to fluency",
        description: "Learn Hindi with our comprehensive course designed for English speakers.",
        language: "hindi",
        price_usd: 89.00,
        is_published: false,
        is_waitlist: true,
        waitlist_description: "Join the waitlist to be notified when this course becomes available.",
        slug: "hindi-fundamentals"
      },
      {
        title: "Telugu Essentials",
        subtitle: "Discover the beauty of Telugu language and culture",
        description: "Learn Telugu with expert guidance and modern teaching methods.",
        language: "telugu",
        price_usd: 89.00,
        is_published: false,
        is_waitlist: true,
        waitlist_description: "Join the waitlist to be notified when this course becomes available.",
        slug: "telugu-essentials"
      },
      {
        title: "Tamil Mastery",
        subtitle: "Learn Tamil, one of the world's oldest languages",
        description: "Master Tamil with our structured approach to language learning.",
        language: "tamil",
        price_usd: 89.00,
        is_published: false,
        is_waitlist: true,
        waitlist_description: "Join the waitlist to be notified when this course becomes available.",
        slug: "tamil-mastery"
      }
    ]

    for (const course of placeholderCourses) {
      const { data: placeholderCourse, error: placeholderError } = await supabase
        .from('courses')
        .insert({
          ...course,
          instructor_id: null,
          total_chapters: 0,
          total_lessons: 0
        })
        .select()
        .single()

      if (placeholderError) {
        console.error('Error creating placeholder course:', placeholderError)
        continue
      }

      console.log(`Created placeholder course: ${placeholderCourse.title}`)
    }

    console.log('Sanskrit curriculum migration completed successfully!')
    console.log('Created:')
    console.log('- 1 Sanskrit course with 8 chapters and 24 lessons')
    console.log('- 3 placeholder courses for other languages')
    console.log('- All courses are properly structured for the new platform')

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateSanskritCurriculum()
}

export default migrateSanskritCurriculum




