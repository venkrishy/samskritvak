import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../../context/AuthContext.jsx'
import { supabase } from '../../../../../lib/supabase.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card.jsx'
import { Button } from '../../../../../components/ui/button.jsx'
import { Input } from '../../../../../components/ui/input.jsx'
import { Label } from '../../../../../components/ui/label.jsx'
import { Textarea } from '../../../../../components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../components/ui/tabs.jsx'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Trash2,
  Plus,
  Edit,
  BookOpen,
  Users,
  DollarSign,
  BarChart3
} from 'lucide-react'

export default function EditCoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [curriculum, setCurriculum] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (courseId && user) {
      loadCourse()
    }
  }, [courseId, user])

  const loadCourse = async () => {
    try {
      // Load course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('instructor_id', user.id)
        .single()

      if (courseError) {
        console.error('Error loading course:', courseError)
        navigate('/teacher')
        return
      }

      setCourse(courseData)

      // Load curriculum
      const { data: curriculumData, error: curriculumError } = await supabase
        .rpc('get_course_curriculum', { course_uuid: courseId })

      if (curriculumError) {
        console.error('Error loading curriculum:', curriculumError)
      } else {
        setCurriculum(curriculumData || [])
      }
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCourse = async () => {
    if (!course) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: course.title,
          subtitle: course.subtitle,
          description: course.description,
          language: course.language,
          price_usd: course.price_usd,
          thumbnail_url: course.thumbnail_url,
          preview_video_url: course.preview_video_url,
          is_published: course.is_published,
          is_waitlist: course.is_waitlist,
          waitlist_description: course.waitlist_description,
          updated_at: new Date().toISOString()
        })
        .eq('id', courseId)

      if (error) {
        console.error('Error updating course:', error)
        return
      }

      // Show success message or redirect
      navigate('/teacher')
    } catch (error) {
      console.error('Error saving course:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setCourse(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDeleteCourse = async () => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (error) {
        console.error('Error deleting course:', error)
        return
      }

      navigate('/teacher')
    } catch (error) {
      console.error('Error deleting course:', error)
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
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist or you don't have permission to edit it.</p>
          <Button onClick={() => navigate('/teacher')}>
            Back to Dashboard
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/teacher')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
                <p className="text-gray-600">{course.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/courses/${course.slug}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSaveCourse}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      value={course.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={course.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Course Description *</Label>
                    <Textarea
                      id="description"
                      value={course.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        value={course.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="sanskrit">Sanskrit</option>
                        <option value="hindi">Hindi</option>
                        <option value="telugu">Telugu</option>
                        <option value="tamil">Tamil</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="price">Price (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={course.price_usd}
                        onChange={(e) => handleInputChange('price_usd', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      value={course.thumbnail_url}
                      onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preview">Preview Video URL</Label>
                    <Input
                      id="preview"
                      value={course.preview_video_url}
                      onChange={(e) => handleInputChange('preview_video_url', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Course Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Total Students</p>
                        <p className="text-sm text-gray-600">Enrolled in this course</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">0</p>
                        <p className="text-sm text-blue-600">+0 this week</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Completion Rate</p>
                        <p className="text-sm text-gray-600">Students who finished</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">0%</p>
                        <p className="text-sm text-green-600">No data yet</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Average Rating</p>
                        <p className="text-sm text-gray-600">Student feedback</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-600">0.0</p>
                        <p className="text-sm text-yellow-600">No reviews yet</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.values(groupedCurriculum).map((chapter) => (
                    <div key={chapter.chapter_id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">
                          Chapter {chapter.chapter_number}: {chapter.chapter_title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {chapter.chapter_is_free && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Free
                            </span>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      {chapter.chapter_description && (
                        <p className="text-gray-600 mb-4">{chapter.chapter_description}</p>
                      )}
                      
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson) => (
                          <div key={lesson.lesson_id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">{lesson.lesson_number}.</span>
                              <span className="text-sm">{lesson.lesson_title}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {lesson.lesson_is_free && (
                                <span className="text-xs text-green-600">Free</span>
                              )}
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Course Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">
                    Detailed analytics and insights will be available once students start enrolling.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Course Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={course.is_published}
                      onChange={(e) => handleInputChange('is_published', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="is_published">Publish this course</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_waitlist"
                      checked={course.is_waitlist}
                      onChange={(e) => handleInputChange('is_waitlist', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="is_waitlist">This is a waitlist course</Label>
                  </div>
                  
                  {course.is_waitlist && (
                    <div>
                      <Label htmlFor="waitlist_description">Waitlist Description</Label>
                      <Textarea
                        id="waitlist_description"
                        value={course.waitlist_description}
                        onChange={(e) => handleInputChange('waitlist_description', e.target.value)}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delete Course</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Once you delete a course, there is no going back. Please be certain.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteCourse}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Course
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
