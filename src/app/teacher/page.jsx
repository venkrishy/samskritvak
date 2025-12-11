import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { 
  Plus, 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Edit, 
  Eye,
  BarChart3,
  Calendar,
  Star
} from 'lucide-react'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadTeacherData()
    }
  }, [user])

  const loadTeacherData = async () => {
    try {
      // Load teacher's courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments(count),
          course_payments(sum:amount_usd)
        `)
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false })

      if (coursesError) {
        console.error('Error loading courses:', coursesError)
        return
      }

      setCourses(coursesData || [])

      // Calculate stats
      const totalCourses = coursesData?.length || 0
      const totalStudents = coursesData?.reduce((sum, course) => 
        sum + (course.course_enrollments?.[0]?.count || 0), 0) || 0
      const totalRevenue = coursesData?.reduce((sum, course) => 
        sum + (course.course_payments?.[0]?.sum || 0), 0) || 0

      setStats({
        totalCourses,
        totalStudents,
        totalRevenue,
        averageRating: 4.8 // Placeholder - would need reviews table
      })
    } catch (error) {
      console.error('Error loading teacher data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCourseStatus = (course) => {
    if (course.is_waitlist) return { label: 'Waitlist', color: 'bg-yellow-100 text-yellow-800' }
    if (course.is_published) return { label: 'Published', color: 'bg-green-100 text-green-800' }
    return { label: 'Draft', color: 'bg-gray-100 text-gray-800' }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your courses and track your impact</p>
            </div>
            <Button 
              onClick={() => navigate('/teacher/courses/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Course
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Course Completion Rate</p>
                    <p className="text-sm text-gray-600">Average across all courses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">87%</p>
                    <p className="text-sm text-green-600">+5% this month</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Student Satisfaction</p>
                    <p className="text-sm text-gray-600">Based on course reviews</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">4.8/5</p>
                    <p className="text-sm text-blue-600">Excellent</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Monthly Revenue</p>
                    <p className="text-sm text-gray-600">Last 30 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue * 0.3)}</p>
                    <p className="text-sm text-purple-600">+12% from last month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Live Session</p>
                  <p className="text-xs text-blue-700">Sanskrit Fundamentals</p>
                  <p className="text-xs text-blue-600">Tomorrow, 2:00 PM</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Course Launch</p>
                  <p className="text-xs text-green-700">Advanced Grammar</p>
                  <p className="text-xs text-green-600">Next Friday</p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">Review Session</p>
                  <p className="text-xs text-yellow-700">Student Feedback</p>
                  <p className="text-xs text-yellow-600">This Sunday</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Your Courses
              </CardTitle>
              <Button 
                onClick={() => navigate('/teacher/courses/new')}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-6">Create your first course to start teaching.</p>
                <Button 
                  onClick={() => navigate('/teacher/courses/new')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Course
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => {
                  const status = getCourseStatus(course)
                  
                  return (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-white" />
                          </div>
                        )}
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.language} • {course.total_lessons} lessons</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge className={status.color}>
                              {status.label}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {course.course_enrollments?.[0]?.count || 0} students
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatCurrency(course.price_usd)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/courses/${course.slug}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/teacher/courses/${course.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
