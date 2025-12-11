import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { Play, Users, Clock, Star, ArrowRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(display_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading courses:', error)
        return
      }

      setCourses(data || [])
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true
    if (filter === 'published') return course.is_published && !course.is_waitlist
    if (filter === 'waitlist') return course.is_waitlist
    return true
  })

  const getCourseStatus = (course) => {
    if (course.is_waitlist) return { label: 'Coming Soon', color: 'bg-yellow-100 text-yellow-800' }
    if (course.is_published) return { label: 'Available', color: 'bg-green-100 text-green-800' }
    return { label: 'Draft', color: 'bg-gray-100 text-gray-800' }
  }

  const getCourseAction = (course) => {
    // Check if this is a Sanskrit-related course and redirect to /chapters/1
    const isSanskritCourse = course.language?.toLowerCase() === 'sanskrit' || 
                             course.title?.toLowerCase().includes('sanskrit') ||
                             course.slug?.toLowerCase() === 'sanskrit'
    const courseUrl = isSanskritCourse ? '/chapters/1' : `/courses/${course.slug}`
    
    if (course.is_waitlist) {
      return (
        <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
          <Link to={isSanskritCourse ? '/waitlist/sanskrit' : `/waitlist/${course.slug}`}>
            Join Waitlist
          </Link>
        </Button>
      )
    }
    
    if (course.is_published) {
      return (
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Link to={courseUrl}>
            View Course
          </Link>
        </Button>
      )
    }
    
    return (
      <Button disabled className="w-full bg-gray-400 text-white">
        Coming Soon
      </Button>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Master Ancient Wisdom
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover the essence of knowledge through expert-guided courses
            </p>
            
            {/* Filter Tabs */}
            <div className="flex justify-center space-x-4 mb-8">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="px-6 py-2"
              >
                All Courses
              </Button>
              <Button
                variant={filter === 'published' ? 'default' : 'outline'}
                onClick={() => setFilter('published')}
                className="px-6 py-2"
              >
                Available Now
              </Button>
              <Button
                variant={filter === 'waitlist' ? 'default' : 'outline'}
                onClick={() => setFilter('waitlist')}
                className="px-6 py-2"
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Check back soon for new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const status = getCourseStatus(course)
              
              return (
                <Card key={course.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-lg flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white" />
                      </div>
                    )}
                    
                    <Badge className={`absolute top-4 right-4 ${status.color}`}>
                      {status.label}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                        {course.language}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>4.9</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </CardTitle>
                    
                    {course.subtitle && (
                      <p className="text-gray-600 text-sm">
                        {course.subtitle}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Course Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{course.total_lessons} lessons</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.total_chapters} chapters</span>
                        </div>
                      </div>
                      
                      {/* Instructor */}
                      {course.profiles && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Instructor:</span> {course.profiles.display_name || course.profiles.email}
                        </div>
                      )}
                      
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                          {course.price_usd === 0 ? 'Free' : `$${course.price_usd}`}
                        </div>
                        {course.preview_video_url && (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      {getCourseAction(course)}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students mastering ancient wisdom through modern learning
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Link to="/courses/sanskrit">
                Start Learning Sanskrit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
