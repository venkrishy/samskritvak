import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { supabase } from '../../../lib/supabase.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.jsx'
import { Button } from '../../../components/ui/button.jsx'
import { Badge } from '../../../components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs.jsx'
import CheckoutButton from '../../../components/checkout/CheckoutButton.jsx'
import { 
  Play, 
  Users, 
  Clock, 
  Star, 
  BookOpen, 
  CheckCircle, 
  Lock, 
  ArrowRight,
  User,
  Calendar,
  Award
} from 'lucide-react'

export default function CourseDetailPage() {
  const { courseSlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [curriculum, setCurriculum] = useState([])
  const [instructor, setInstructor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (courseSlug) {
      loadCourse()
    }
  }, [courseSlug])

  const loadCourse = async () => {
    try {
      // Load course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(*)
        `)
        .eq('slug', courseSlug)
        .single()

      if (courseError) {
        console.error('Error loading course:', courseError)
        return
      }

      setCourse(courseData)
      setInstructor(courseData.profiles)

      // Load curriculum
      const { data: curriculumData, error: curriculumError } = await supabase
        .rpc('get_course_curriculum', { course_uuid: courseData.id })

      if (curriculumError) {
        console.error('Error loading curriculum:', curriculumError)
      } else {
        setCurriculum(curriculumData || [])
      }

      // Check enrollment status
      if (user) {
        const { data: enrollmentData } = await supabase
          .from('course_enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', courseData.id)
          .single()

        setIsEnrolled(!!enrollmentData)
      }
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = () => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (course.price_usd === 0) {
      // Free course - enroll directly
      enrollInCourse()
    } else {
      // Paid course - redirect to checkout
      navigate(`/courses/${courseSlug}/checkout`)
    }
  }

  const enrollInCourse = async () => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id
        })

      if (error) {
        console.error('Error enrolling in course:', error)
        return
      }

      setIsEnrolled(true)
      navigate(`/courses/${courseSlug}/learn`)
    } catch (error) {
      console.error('Error enrolling in course:', error)
    }
  }

  const handleEnterCourse = () => {
    navigate(`/courses/${courseSlug}/learn`)
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
          <Button onClick={() => navigate('/courses')}>
            Browse All Courses
          </Button>
        </div>
      </div>
    )
  }

  const groupedCurriculum = curriculum.reduce((acc, item) => {
    if (!acc[item.chapter_id]) {
      acc[item.chapter_id] = {
        chapter_id: item.chapter_id,
        chapter_number: item.chapter_number,
        chapter_title: item.chapter_title,
        chapter_description: item.chapter_description,
        chapter_is_free: item.chapter_is_free,
        lessons: []
      }
    }
    if (item.lesson_id) {
      acc[item.chapter_id].lessons.push({
        lesson_id: item.lesson_id,
        lesson_number: item.lesson_number,
        lesson_title: item.lesson_title,
        lesson_content_type: item.lesson_content_type,
        lesson_is_free: item.lesson_is_free,
        lesson_order_index: item.lesson_order_index
      })
    }
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Info */}
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Badge className="bg-blue-100 text-blue-800">
                  {course.language}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>4.9 (127 reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              {course.subtitle && (
                <p className="text-xl text-gray-600 mb-6">
                  {course.subtitle}
                </p>
              )}
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.total_lessons} lessons</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.total_chapters} chapters</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>Beginner to Advanced</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                {course.description}
              </p>
            </div>
            
            {/* Course Card */}
            <div className="lg:sticky lg:top-8">
              <Card className="bg-white shadow-xl">
                <CardContent className="p-6">
                  {course.thumbnail_url && (
                    <div className="mb-4">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {course.price_usd === 0 ? 'Free' : `$${course.price_usd}`}
                    </div>
                    <p className="text-gray-600">One-time payment • Lifetime access</p>
                  </div>
                  
                  {isEnrolled ? (
                    <Button 
                      onClick={handleEnterCourse}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Enter Course
                    </Button>
                  ) : (
                    <CheckoutButton course={course} />
                  )}
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      30-day money-back guarantee
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Master Sanskrit fundamentals",
                    "Read and write Devanagari script",
                    "Understand classical grammar",
                    "Translate ancient texts",
                    "Speak with proper pronunciation",
                    "Apply knowledge to modern contexts"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Course Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• No prior Sanskrit knowledge required</li>
                  <li>• Basic English reading skills</li>
                  <li>• Dedication to practice daily</li>
                  <li>• Access to computer or mobile device</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.values(groupedCurriculum).map((chapter, index) => (
                    <div key={chapter.chapter_id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">
                          Chapter {chapter.chapter_number}: {chapter.chapter_title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {chapter.chapter_is_free && (
                            <Badge className="bg-green-100 text-green-800">Free</Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {chapter.lessons.length} lessons
                          </span>
                        </div>
                      </div>
                      
                      {chapter.chapter_description && (
                        <p className="text-gray-600 mb-3">{chapter.chapter_description}</p>
                      )}
                      
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.lesson_id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <div className="flex items-center">
                              {lesson.lesson_content_type === 'video' && <Play className="h-4 w-4 mr-2 text-blue-500" />}
                              {lesson.lesson_content_type === 'text' && <BookOpen className="h-4 w-4 mr-2 text-green-500" />}
                              {lesson.lesson_content_type === 'quiz' && <Award className="h-4 w-4 mr-2 text-purple-500" />}
                              <span className="text-sm">{lesson.lesson_title}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {lesson.lesson_is_free && (
                                <Badge variant="outline" className="text-xs">Free</Badge>
                              )}
                              {!lesson.lesson_is_free && !isEnrolled && (
                                <Lock className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="instructor" className="space-y-6">
            {instructor && (
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {instructor.display_name || instructor.email}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Expert Sanskrit scholar with over 15 years of teaching experience. 
                        Specialized in classical Sanskrit literature and modern pedagogical methods.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Joined 2020</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>1,247 students</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          <span>4.9 rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
