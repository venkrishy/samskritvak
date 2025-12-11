// Image Configuration - Fallback to local images
// This file provides a simple way to manage image URLs without R2 upload

export const imageConfig = {
  // Hero Images
  hero: {
    homepage: '/images/hero-student-learning.jpg',
    teach: '/images/teach-hero.jpg',
    business: '/images/business-hero.jpg',
    'proven-progress': '/images/progress-dashboard.jpg'
  },

  // Tutor Avatars
  tutors: [
    '/images/tutor-placeholder-1.jpg',
    '/images/tutor-placeholder-2.jpg',
    '/images/tutor-placeholder-3.jpg'
  ],

  // Testimonial Avatars
  testimonials: [
    '/images/testimonial-avatar-1.jpg',
    '/images/testimonial-avatar-2.jpg'
  ],

  // Background Images
  backgrounds: {
    stats: '/images/stats-background.jpg'
  },

  // Illustrations
  illustrations: {
    'teach-benefits': '/images/teach-benefits.jpg',
    'business-case-study': '/images/business-case-study.jpg',
    'progress-stats': '/images/progress-stats.jpg'
  }
}

// Helper functions
export const getHeroImage = (page) => {
  return imageConfig.hero[page] || '/images/placeholder.jpg'
}

export const getTutorAvatar = (index = 0) => {
  return imageConfig.tutors[index] || imageConfig.tutors[0]
}

export const getTestimonialAvatar = (index = 0) => {
  return imageConfig.testimonials[index] || imageConfig.testimonials[0]
}

export const getBackgroundImage = (type) => {
  return imageConfig.backgrounds[type] || '/images/placeholder.jpg'
}

export const getIllustration = (name) => {
  return imageConfig.illustrations[name] || '/images/placeholder.jpg'
}

// Get all images for a specific page
export const getPageImages = (page) => {
  const images = {}
  
  // Add hero image
  images.hero = getHeroImage(page)
  
  // Add page-specific images
  switch (page) {
    case 'homepage':
      images.statsBackground = getBackgroundImage('stats')
      images.testimonialAvatars = imageConfig.testimonials
      break
    case 'tutors':
      images.tutorAvatars = imageConfig.tutors
      break
    case 'teach':
      images.illustrations = {
        benefits: getIllustration('teach-benefits')
      }
      break
    case 'business':
      images.illustrations = {
        caseStudy: getIllustration('business-case-study')
      }
      break
    case 'proven-progress':
      images.illustrations = {
        stats: getIllustration('progress-stats')
      }
      break
  }
  
  return images
}

export default imageConfig

