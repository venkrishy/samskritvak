import { useState } from 'react'
import { useAuth } from '../../../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../../lib/supabase.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card.jsx'
import { Button } from '../../../../components/ui/button.jsx'
import { Input } from '../../../../components/ui/input.jsx'
import { Label } from '../../../../components/ui/label.jsx'
import { Textarea } from '../../../../components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs.jsx'
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Eye, 
  Upload,
  Plus,
  Trash2,
  BookOpen,
  DollarSign,
  Settings
} from 'lucide-react'

export default function CreateCoursePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState({
    title: '',
    subtitle: '',
    description: '',
    language: 'sanskrit',
    price_usd: 0,
    thumbnail_url: '',
    preview_video_url: '',
    is_published: false,
    is_waitlist: false,
    waitlist_description: ''
  })
  const [chapters, setChapters] = useState([])
  const [lessons, setLessons] = useState([])

  const handleInputChange = (field, value) => {
    setCourse(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveCourse = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Create course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          ...course,
          instructor_id: user.id,
          slug: course.title.toLowerCase().replace(/\s+/g, '-'),
          total_chapters: chapters.length,
          total_lessons: lessons.length
        })
        .select()
        .single()

      if (courseError) {
        console.error('Error creating course:', courseError)
        return
      }

      // Create chapters
      if (chapters.length > 0) {
        const chapterData = chapters.map((chapter, index) => ({
          course_id: courseData.id,
          chapter_number: index + 1,
          title: chapter.title,
          description: chapter.description,
          is_free: chapter.is_free,
          order_index: index
        }))

        const { error: chaptersError } = await supabase
          .from('course_chapters')
          .insert(chapterData)

        if (chaptersError) {
          console.error('Error creating chapters:', chaptersError)
        }
      }

      // Create lessons
      if (lessons.length > 0) {
        const lessonData = lessons.map((lesson, index) => ({
          course_id: courseData.id,
          chapter_id: lesson.chapter_id,
          lesson_number: index + 1,
          title: lesson.title,
          content_type: lesson.content_type,
          content_url: lesson.content_url,
          google_doc_url: lesson.google_doc_url,
          duration_minutes: lesson.duration_minutes,
          is_free: lesson.is_free,
          order_index: index
        }))

        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(lessonData)

        if (lessonsError) {
          console.error('Error creating lessons:', lessonsError)
        }
      }

      navigate(`/teacher/courses/${courseData.id}/edit`)
    } catch (error) {
      console.error('Error saving course:', error)
    } finally {
      setLoading(false)
    }
  }

  const addChapter = () => {
    setChapters(prev => [...prev, {
      title: '',
      description: '',
      is_free: false
    }])
  }

  const updateChapter = (index, field, value) => {
    setChapters(prev => prev.map((chapter, i) => 
      i === index ? { ...chapter, [field]: value } : chapter
    ))
  }

  const deleteChapter = (index) => {
    setChapters(prev => prev.filter((_, i) => i !== index))
  }

  const addLesson = (chapterIndex) => {
    setLessons(prev => [...prev, {
      chapter_id: chapterIndex,
      title: '',
      content_type: 'text',
      content_url: '',
      google_doc_url: '',
      duration_minutes: 15,
      is_free: false
    }])
  }

  const updateLesson = (index, field, value) => {
    setLessons(prev => prev.map((lesson, i) => 
      i === index ? { ...lesson, [field]: value } : lesson
    ))
  }

  const deleteLesson = (index) => {
    setLessons(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1)
    }
  }

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
    }
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
                <p className="text-gray-600">Step {activeStep} of 4</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleSaveCourse}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={nextStep}
                disabled={activeStep === 4}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeStep.toString()} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="1">Basic Info</TabsTrigger>
            <TabsTrigger value="2">Pricing</TabsTrigger>
            <TabsTrigger value="3">Curriculum</TabsTrigger>
            <TabsTrigger value="4">Publish</TabsTrigger>
          </TabsList>

          {/* Step 1: Basic Information */}
          <TabsContent value="1" className="space-y-6">
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
                    placeholder="e.g., Sanskrit Fundamentals: From Zero to Hero"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={course.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="A brief description of what students will learn"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Course Description *</Label>
                  <Textarea
                    id="description"
                    value={course.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what students will learn, the course structure, and what makes it unique..."
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
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      value={course.thumbnail_url}
                      onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="preview">Preview Video URL</Label>
                  <Input
                    id="preview"
                    value={course.preview_video_url}
                    onChange={(e) => handleInputChange('preview_video_url', e.target.value)}
                    placeholder="https://example.com/preview.mp4"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Pricing */}
          <TabsContent value="2" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pricing & Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="price">Course Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={course.price_usd}
                    onChange={(e) => handleInputChange('price_usd', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set to 0 for a free course
                  </p>
                </div>

                <div className="space-y-4">
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
                        placeholder="Describe what students can expect when the course launches..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Curriculum */}
          <TabsContent value="3" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Chapters</h3>
                  <Button onClick={addChapter} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Chapter
                  </Button>
                </div>

                <div className="space-y-4">
                  {chapters.map((chapter, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Chapter {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteChapter(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Chapter Title</Label>
                          <Input
                            value={chapter.title}
                            onChange={(e) => updateChapter(index, 'title', e.target.value)}
                            placeholder="e.g., Introduction to Sanskrit"
                          />
                        </div>
                        
                        <div>
                          <Label>Chapter Description</Label>
                          <Textarea
                            value={chapter.description}
                            onChange={(e) => updateChapter(index, 'description', e.target.value)}
                            placeholder="Brief description of what this chapter covers..."
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`chapter-free-${index}`}
                            checked={chapter.is_free}
                            onChange={(e) => updateChapter(index, 'is_free', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`chapter-free-${index}`}>This chapter is free</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {chapters.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No chapters added yet. Click "Add Chapter" to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Publish */}
          <TabsContent value="4" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Publish Settings
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
                  
                  <p className="text-sm text-gray-600">
                    Publishing makes your course visible to students. You can always unpublish later.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Course Summary</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>Title:</strong> {course.title || 'Not set'}</p>
                    <p><strong>Language:</strong> {course.language}</p>
                    <p><strong>Price:</strong> ${course.price_usd}</p>
                    <p><strong>Chapters:</strong> {chapters.length}</p>
                    <p><strong>Status:</strong> {course.is_published ? 'Published' : 'Draft'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={activeStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleSaveCourse}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            
            {activeStep === 4 ? (
              <Button
                onClick={handleSaveCourse}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? 'Saving...' : 'Create Course'}
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
