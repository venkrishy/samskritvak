import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext.jsx'
import { supabase } from '../../../../lib/supabase.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card.jsx'
import { Button } from '../../../../components/ui/button.jsx'
import { Progress } from '../../../../components/ui/progress.jsx'
import GoogleDocsViewer from '../../../../components/lessons/GoogleDocsViewer.jsx'
import { 
  Play, 
  CheckCircle, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  BookOpen,
  Clock,
  User,
  FileText,
  Video,
  Award
} from 'lucide-react'

export default function CoursePlayerPage() {
  const { courseSlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [curriculum, setCurriculum] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    if (courseSlug && user) {
      loadCourse()
    }
  }, [courseSlug, user])

  const loadCourse = async () => {
    try {
      // Load course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', courseSlug)
        .single()

      if (courseError) {
        console.error('Error loading course:', courseError)
        return
      }

      setCourse(courseData)

      // Check enrollment
      const { data: enrollmentData } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseData.id)
        .single()

      if (!enrollmentData) {
        // Not enrolled - redirect to course page
        navigate(`/courses/${courseSlug}`)
        return
      }

      setIsEnrolled(true)
      setProgress(enrollmentData.progress_percentage || 0)

      // Load curriculum
      const { data: curriculumData, error: curriculumError } = await supabase
        .rpc('get_course_curriculum', { course_uuid: courseData.id })

      if (curriculumError) {
        console.error('Error loading curriculum:', curriculumError)
      } else {
        setCurriculum(curriculumData || [])
        
        // Set first lesson as current if no specific lesson
        if (curriculumData && curriculumData.length > 0) {
          const firstLesson = curriculumData.find(item => item.lesson_id)
          if (firstLesson) {
            setCurrentLesson(firstLesson)
          }
        }
      }
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson)
    // Update last accessed
    updateLastAccessed(lesson)
  }

  const updateLastAccessed = async (lesson) => {
    if (!user || !course) return

    try {
      await supabase
        .from('course_enrollments')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('course_id', course.id)
    } catch (error) {
      console.error('Error updating last accessed:', error)
    }
  }

  const handleNextLesson = () => {
    if (!currentLesson) return

    const currentIndex = curriculum.findIndex(item => 
      item.lesson_id === currentLesson.lesson_id
    )
    
    if (currentIndex < curriculum.length - 1) {
      const nextLesson = curriculum[currentIndex + 1]
      if (nextLesson.lesson_id) {
        setCurrentLesson(nextLesson)
        updateLastAccessed(nextLesson)
      }
    }
  }

  const handlePrevLesson = () => {
    if (!currentLesson) return

    const currentIndex = curriculum.findIndex(item => 
      item.lesson_id === currentLesson.lesson_id
    )
    
    if (currentIndex > 0) {
      const prevLesson = curriculum[currentIndex - 1]
      if (prevLesson.lesson_id) {
        setCurrentLesson(prevLesson)
        updateLastAccessed(prevLesson)
      }
    }
  }

  const isLessonAccessible = (lesson) => {
    if (lesson.lesson_is_free) return true
    return isEnrolled
  }

  const groupedCurriculum = curriculum.reduce((acc, item) => {
    if (!acc[item.chapter_id]) {
      acc[item.chapter_id] = {
        chapter_id: item.chapter_id,
        chapter_number: item.chapter_number,
        chapter_title: item.chapter_title,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course || !isEnrolled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need to enroll in this course to access the content.</p>
          <Button onClick={() => navigate(`/courses/${courseSlug}`)}>
            View Course
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/courses/${courseSlug}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-500">Learning in progress</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {Math.round(progress)}% Complete
                </div>
                <Progress value={progress} className="w-32 h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Curriculum */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {Object.values(groupedCurriculum).map((chapter) => (
                    <div key={chapter.chapter_id} className="border-b last:border-b-0">
                      <div className="p-4 bg-gray-50">
                        <h3 className="font-semibold text-sm">
                          Chapter {chapter.chapter_number}: {chapter.chapter_title}
                        </h3>
                        {chapter.chapter_is_free && (
                          <span className="text-xs text-green-600 font-medium">Free</span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {chapter.lessons.map((lesson) => {
                          const isAccessible = isLessonAccessible(lesson)
                          const isCurrent = currentLesson?.lesson_id === lesson.lesson_id
                          
                          return (
                            <button
                              key={lesson.lesson_id}
                              onClick={() => isAccessible && handleLessonClick(lesson)}
                              disabled={!isAccessible}
                              className={`w-full text-left p-3 text-sm hover:bg-gray-50 transition-colors ${
                                isCurrent ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                              } ${!isAccessible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {lesson.lesson_content_type === 'video' && <Play className="h-4 w-4 text-blue-500" />}
                                  {lesson.lesson_content_type === 'text' && <BookOpen className="h-4 w-4 text-green-500" />}
                                  <span className="truncate">{lesson.lesson_title}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {lesson.lesson_is_free && (
                                    <span className="text-xs text-green-600">Free</span>
                                  )}
                                  {!isAccessible && <Lock className="h-3 w-3 text-gray-400" />}
                                  {isAccessible && <CheckCircle className="h-3 w-3 text-green-500" />}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentLesson ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{currentLesson.lesson_title}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>15 min</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>Beginner</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {currentLesson.lesson_is_free && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {/* Content Display */}
                    {currentLesson.content_type === 'video' && (
                      <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                        <div className="text-center text-white">
                          <Video className="h-16 w-16 mx-auto mb-4 opacity-75" />
                          <p className="text-lg">Video content will be displayed here</p>
                          <p className="text-sm opacity-75">Lesson: {currentLesson.lesson_title}</p>
                        </div>
                      </div>
                    )}
                    
                    {currentLesson.content_type === 'document' && currentLesson.google_doc_url && (
                      <GoogleDocsViewer 
                        googleDocUrl={currentLesson.google_doc_url}
                        title={currentLesson.lesson_title}
                      />
                    )}
                    
                    {currentLesson.content_type === 'text' && (
                      <div className="bg-white border rounded-lg p-6">
                        <div className="prose max-w-none">
                          <h3 className="text-2xl font-bold mb-4">{currentLesson.lesson_title}</h3>
                          <div className="text-gray-700 leading-relaxed">
                            <p>This is a text-based lesson. The content will be displayed here.</p>
                            <p>In a real implementation, this would contain the actual lesson content from the database.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentLesson.content_type === 'quiz' && (
                      <div className="bg-white border rounded-lg p-6">
                        <div className="text-center">
                          <Award className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold mb-4">Quiz: {currentLesson.lesson_title}</h3>
                          <p className="text-gray-600 mb-6">Quiz functionality will be implemented here.</p>
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            Start Quiz
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Lesson Content */}
                    <div className="prose max-w-none">
                      <h3>Lesson Overview</h3>
                      <p>
                        This lesson covers the fundamental concepts of Sanskrit grammar and vocabulary. 
                        You'll learn essential building blocks that will help you progress through the course.
                      </p>
                      
                      <h4>What You'll Learn:</h4>
                      <ul>
                        <li>Basic Sanskrit alphabet and pronunciation</li>
                        <li>Essential vocabulary for beginners</li>
                        <li>Simple sentence construction</li>
                        <li>Cultural context and significance</li>
                      </ul>
                      
                      <h4>Practice Exercises</h4>
                      <p>
                        Complete the exercises below to reinforce your learning and test your understanding.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Lesson</h3>
                  <p className="text-gray-600">Choose a lesson from the sidebar to begin learning.</p>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            {currentLesson && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevLesson}
                  disabled={!curriculum.find(item => item.lesson_id === currentLesson.lesson_id)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNextLesson}
                  disabled={!curriculum.find(item => item.lesson_id === currentLesson.lesson_id)}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
