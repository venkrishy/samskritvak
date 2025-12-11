// Site Configuration - Admin Control Panel
// This file allows you to control all site content, tutor data, languages, etc.

export const siteConfig = {
  // Site Branding
  siteName: "TattvaJnana",
  siteTagline: "Eternal values in an ever changing world",
  siteDescription: "Master ancient wisdom through modern learning. Discover the essence of knowledge with expert-guided courses in Sanskrit and classical languages.",
  
  // Contact Information
  contact: {
    email: "support@tattvajnana.com",
    businessEmail: "business@tattvajnana.com",
    phone: "+1 (555) 123-4567",
    address: "1309 Beacon Street, Suite 300, Brookline, MA 02446",
    businessHours: {
      weekdays: "Monday - Friday: 9AM - 6PM",
      saturday: "Saturday: 10AM - 4PM",
      timezone: "Eastern Time Zone"
    }
  },

  // Supported Languages for Teaching
  supportedLanguages: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'sk', name: 'Sanskrit', flag: '🕉️' }
  ],

  // Interface Languages
  interfaceLanguages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'pl', name: 'Polski' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'ru', name: 'Русский' },
    { code: 'uk', name: 'Українська' },
    { code: 'ar', name: 'العربية' },
    { code: 'th', name: 'ภาษาไทย' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
  ],

  // Supported Currencies
  supportedCurrencies: [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.96 },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', rate: 3.96 },
    { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', rate: 36.5 }
  ],

  // Sample Tutors Data (Admin can modify these)
  sampleTutors: [
    {
      id: 1,
      full_name: 'Sarah Johnson',
      profile_photo_url: '/images/tutor-placeholder-1.jpg',
      languages_taught: ['English', 'Spanish'],
      native_languages: ['English'],
      hourly_rate_usd: 25,
      rating: 4.9,
      total_reviews: 127,
      total_lessons_taught: 450,
      experience_years: 5,
      bio: 'Native English speaker with 5 years of teaching experience. Specialized in business English and conversation practice.',
      is_online: true,
      certifications: ['TEFL Certified', 'Business English Specialist'],
      education: 'MA in Linguistics, University of Cambridge'
    },
    {
      id: 2,
      full_name: 'Carlos Rodriguez',
      profile_photo_url: '/images/tutor-placeholder-2.jpg',
      languages_taught: ['Spanish', 'Portuguese'],
      native_languages: ['Spanish'],
      hourly_rate_usd: 20,
      rating: 4.8,
      total_reviews: 89,
      total_lessons_taught: 320,
      experience_years: 3,
      bio: 'Passionate about helping students learn Spanish through immersive conversation and cultural context.',
      is_online: true,
      certifications: ['DELE Examiner', 'Spanish Literature Specialist'],
      education: 'BA in Spanish Literature, Universidad de Madrid'
    },
    {
      id: 3,
      full_name: 'Marie Dubois',
      profile_photo_url: '/images/tutor-placeholder-3.jpg',
      languages_taught: ['French', 'English'],
      native_languages: ['French'],
      hourly_rate_usd: 30,
      rating: 4.9,
      total_reviews: 156,
      total_lessons_taught: 520,
      experience_years: 7,
      bio: 'French native speaker with extensive experience in DELF preparation and conversational French.',
      is_online: false,
      certifications: ['DELF Examiner', 'French Culture Specialist'],
      education: 'MA in French Literature, Sorbonne University'
    },
    {
      id: 4,
      full_name: 'Priya Sharma',
      profile_photo_url: '/images/tutor-placeholder-1.jpg',
      languages_taught: ['Hindi', 'Sanskrit', 'English'],
      native_languages: ['Hindi'],
      hourly_rate_usd: 22,
      rating: 4.7,
      total_reviews: 95,
      total_lessons_taught: 280,
      experience_years: 4,
      bio: 'Expert in classical languages with deep knowledge of Sanskrit literature and modern Hindi.',
      is_online: true,
      certifications: ['Sanskrit Scholar', 'Hindi Language Expert'],
      education: 'PhD in Sanskrit, Banaras Hindu University'
    },
    {
      id: 5,
      full_name: 'Yuki Tanaka',
      profile_photo_url: '/images/tutor-placeholder-2.jpg',
      languages_taught: ['Japanese', 'English'],
      native_languages: ['Japanese'],
      hourly_rate_usd: 28,
      rating: 4.9,
      total_reviews: 134,
      total_lessons_taught: 380,
      experience_years: 6,
      bio: 'Native Japanese speaker specializing in JLPT preparation and business Japanese.',
      is_online: true,
      certifications: ['JLPT Examiner', 'Business Japanese Specialist'],
      education: 'MA in Japanese Language, Tokyo University'
    }
  ],

  // Site Statistics
  stats: [
    { number: '100,000+', label: 'Experienced tutors', description: 'From around the world' },
    { number: '300,000+', label: '5-star tutor reviews', description: 'From satisfied students' },
    { number: '120+', label: 'Subjects taught', description: 'Including languages and more' },
    { number: '180+', label: 'Tutor nationalities', description: 'Global diversity' }
  ],

  // Testimonials
  testimonials: [
    {
      quote: "BhashaBoli allowed me to make a living without leaving home!",
      author: "Krista A.",
      role: "English tutor",
      rating: 5,
      avatar: "/images/testimonial-avatar-1.jpg"
    },
    {
      quote: "The personalized approach helped me achieve fluency in just 6 months.",
      author: "Maria S.",
      role: "Spanish student",
      rating: 5,
      avatar: "/images/testimonial-avatar-2.jpg"
    },
    {
      quote: "Amazing platform with excellent tutors. Highly recommended!",
      author: "David K.",
      role: "French student",
      rating: 5,
      avatar: "/images/testimonial-avatar-1.jpg"
    }
  ],

  // Popular Subjects (for homepage) - Organized by Languages and Culture
  popularSubjects: {
    languages: [
      'Sanskrit', 'English', 'Hindi', 'Telugu', 'Tamil'
    ],
    culture: [
      'Yoga', 'Indian History', 'Ayurveda', 'Ramayana', 'Mahabharatha'
    ]
  },

  // How it Works Steps
  howItWorks: [
    {
      number: 1,
      title: 'Find your tutor',
      description: 'We\'ll connect you with a tutor who motivates, challenges, and supports you — from first lesson to fluency.',
      icon: '👥'
    },
    {
      number: 2,
      title: 'Start learning',
      description: 'Your tutor will tailor every lesson to your learning goals, so progress feels personal from the very beginning.',
      icon: '📚'
    },
    {
      number: 3,
      title: 'Make progress every week',
      description: 'Choose how many lessons you want to take and build lasting confidence, one conversation at a time.',
      icon: '📈'
    }
  ],

  // Tutor Benefits
  tutorBenefits: [
    {
      title: 'Set your own rate',
      description: 'Choose your hourly rate and change it anytime. On average, English tutors charge $15-25 per hour.',
      icon: '💵'
    },
    {
      title: 'Teach anytime, anywhere',
      description: 'Decide when and how many hours you want to teach. No minimum time commitment or fixed schedule. Be your own boss!',
      icon: '🌍'
    },
    {
      title: 'Grow professionally',
      description: 'Once you sign up and complete your application, you can be approved and start teaching in as little as three days.',
      icon: '📈'
    }
  ],

  // FAQ Data
  faqs: [
    {
      question: 'What kind of tutors does BhashaBoli look for?',
      answer: 'No specific certification or teaching experience is required! We welcome tutors who enjoy sharing knowledge and making a difference in students\' lives, have outstanding communication skills, and are willing to provide a personalized learning experience to international students.'
    },
    {
      question: 'What subject can I teach?',
      answer: 'We have over 100 subjects on BhashaBoli, including languages, school and university subjects, hobbies and art.'
    },
    {
      question: 'How do I become an online tutor at BhashaBoli?',
      answer: '1. Provide some basic information about yourself\n2. Upload your headshot photo\n3. Describe your strengths as a tutor\n4. Record a short video introduction (up to 2 mins long)\n5. Choose your availability'
    },
    {
      question: 'How much can I earn on BhashaBoli?',
      answer: 'Most popular tutors on BhashaBoli earn up to $550 a week. Your earnings depend on the hourly rate you set, the number of lessons you teach and how many students continue learning with you after the trial lesson.'
    },
    {
      question: 'Is it free to create a tutor profile on BhashaBoli?',
      answer: 'Yes. It is free to create a tutor profile, get exposure to students, and use BhashaBoli\'s tools and materials. We only charge a commission for the lessons that you have taught.'
    }
  ],

  // Business Case Studies
  businessCaseStudies: [
    {
      company: 'TechCorp International',
      industry: 'Technology',
      challenge: 'Expanding to Spanish-speaking markets',
      solution: 'Spanish business communication training for 50+ employees',
      result: '40% improvement in client satisfaction scores'
    },
    {
      company: 'Global Finance Ltd',
      industry: 'Finance',
      challenge: 'Preparing team for European operations',
      solution: 'French and German language training for finance team',
      result: 'Successful launch in 3 European markets'
    }
  ],

  // Business Stats
  businessStats: [
    { number: '500+', label: 'Companies trained', description: 'Globally' },
    { number: '10,000+', label: 'Employees trained', description: 'Worldwide' },
    { number: '95%', label: 'Satisfaction rate', description: 'Client feedback' }
  ]
}

// Helper functions for easy access
export const getSupportedLanguages = () => siteConfig.supportedLanguages
export const getInterfaceLanguages = () => siteConfig.interfaceLanguages
export const getSupportedCurrencies = () => siteConfig.supportedCurrencies
export const getSampleTutors = () => siteConfig.sampleTutors
export const getStats = () => siteConfig.stats
export const getTestimonials = () => siteConfig.testimonials
export const getPopularSubjects = () => siteConfig.popularSubjects
export const getHowItWorks = () => siteConfig.howItWorks
export const getTutorBenefits = () => siteConfig.tutorBenefits
export const getFaqs = () => siteConfig.faqs
export const getBusinessCaseStudies = () => siteConfig.businessCaseStudies
export const getBusinessStats = () => siteConfig.businessStats

