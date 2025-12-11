import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../../lib/supabase.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'
import { Button } from '../../../components/ui/button.jsx'
import { Input } from '../../../components/ui/input.jsx'
import { Label } from '../../../components/ui/label.jsx'
import { Badge } from '../../../components/ui/badge.jsx'
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Mail,
  User,
  Calendar,
  Award,
  Play
} from 'lucide-react'

export default function WaitlistPage() {
  const { courseSlug } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(0)

  useEffect(() => {
    if (courseSlug) {
      loadCourse()
      loadWaitlistCount()
    }
  }, [courseSlug])

  const loadCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(display_name, email)
        `)
        .eq('slug', courseSlug)
        .single()

      if (error) {
        console.error('Error loading course:', error)
        return
      }

      setCourse(data)
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadWaitlistCount = async () => {
    try {
      const { count } = await supabase
        .from('course_waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('course_slug', courseSlug)

      setWaitlistCount(count || 0)
    } catch (error) {
      console.error('Error loading waitlist count:', error)
    }
  }

  const handleJoinWaitlist = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('course_waitlist')
        .insert({
          email: email.trim(),
          name: name.trim() || null,
          course_slug: courseSlug
        })

      if (error) {
        console.error('Error joining waitlist:', error)
        return
      }

      setIsSubmitted(true)
      setWaitlistCount(prev => prev + 1)
    } catch (error) {
      console.error('Error joining waitlist:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="bg-yellow-100 text-yellow-800 mb-6">
              Coming Soon
            </Badge>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {course.title}
            </h1>
            
            {course.subtitle && (
              <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {course.subtitle}
              </p>
            )}
            
            <div className="flex items-center justify-center space-x-8 mb-12">
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>{waitlistCount} interested</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{course.total_lessons} lessons</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Star className="h-5 w-5 mr-2" />
                <span>Expert instructor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You'll Master
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive learning designed for modern students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Fundamental Concepts",
                description: "Master the essential building blocks of the language",
                icon: BookOpen
              },
              {
                title: "Practical Application",
                description: "Apply your knowledge in real-world scenarios",
                icon: Play
              },
              {
                title: "Cultural Context",
                description: "Understand the rich cultural heritage",
                icon: Award
              },
              {
                title: "Advanced Techniques",
                description: "Progress to sophisticated language skills",
                icon: Star
              },
              {
                title: "Interactive Learning",
                description: "Engage with multimedia content and exercises",
                icon: Users
              },
              {
                title: "Expert Guidance",
                description: "Learn from experienced instructors",
                icon: User
              }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <item.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Course Preview Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Course Preview
            </h2>
            <p className="text-xl text-gray-600">
              Get a glimpse of what awaits you
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Comprehensive Curriculum
              </h3>
              <div className="space-y-4">
                {[
                  "Introduction to the language and its significance",
                  "Basic alphabet and pronunciation guide",
                  "Essential vocabulary and common phrases",
                  "Grammar fundamentals and sentence structure",
                  "Reading and writing practice exercises",
                  "Cultural insights and historical context",
                  "Advanced topics and specialized vocabulary",
                  "Practical applications and real-world usage"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Course Structure
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-semibold">8-12 weeks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-semibold">{course.total_lessons}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chapters</span>
                  <span className="font-semibold">{course.total_chapters}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Level</span>
                  <span className="font-semibold">Beginner to Advanced</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Format</span>
                  <span className="font-semibold">Self-paced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Section */}
      {course.profiles && (
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meet Your Instructor
              </h2>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {course.profiles.display_name || course.profiles.email}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Expert instructor with over 15 years of teaching experience. 
                        Specialized in classical languages and modern pedagogical methods.
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>15+ years experience</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>2,000+ students taught</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          <span>4.9 average rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Form */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {isSubmitted ? (
            <div className="text-white">
              <CheckCircle className="h-16 w-16 mx-auto mb-6 text-green-300" />
              <h2 className="text-3xl font-bold mb-4">
                You're on the list!
              </h2>
              <p className="text-xl mb-8">
                We'll notify you as soon as the course becomes available.
              </p>
              <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-sm">
                  <strong>{waitlistCount}</strong> people are already interested in this course.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">
                Be the first to know
              </h2>
              <p className="text-xl mb-8">
                Join the waitlist and get early access when this course launches.
              </p>
              
              <form onSubmit={handleJoinWaitlist} className="max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white text-left block mb-2">
                      Name (Optional)
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-white text-left block mb-2">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!email.trim() || isSubmitting}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3"
                  >
                    {isSubmitting ? (
                      'Joining...'
                    ) : (
                      <>
                        <Mail className="h-5 w-5 mr-2" />
                        Join Waitlist
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-8 bg-white/10 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm">
                  <strong>{waitlistCount}</strong> people are already interested in this course.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">TattvaJnana</h3>
          <p className="text-gray-400 mb-6">
            Eternal values in an ever changing world
          </p>
          <p className="text-sm text-gray-500">
            © 2024 TattvaJnana. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
