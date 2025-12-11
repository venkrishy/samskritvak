import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RootLayout from './app/layout.jsx'
import HomePage from './app/page.jsx'
import DashboardPage from './app/dashboard/page.jsx'

// Import dynamic components
import DynamicChapterPage from './components/DynamicChapterPage.jsx'
import DynamicLessonPage from './components/DynamicLessonPage.jsx'
import SupabaseTest from './components/SupabaseTest.jsx'

// Import public pages
import TutorsPage from './app/public/tutors/page.jsx'
import TeachPage from './app/public/teach/page.jsx'
import TeachSignupPage from './app/public/teach/signup/page.jsx'
import BusinessPage from './app/public/business/page.jsx'
import ProvenProgressPage from './app/public/proven-progress/page.jsx'
import ContactPage from './app/public/contact/page.jsx'

// Import admin pages
import AdminPage from './app/admin/page.jsx'
import AdminDashboardPage from './app/admin/dashboard/page.jsx'

// Import course pages
import CoursesPage from './app/courses/page.jsx'
import CourseDetailPage from './app/courses/[slug]/page.jsx'
import CoursePlayerPage from './app/courses/[slug]/learn/page.jsx'
import WaitlistPage from './app/waitlist/[slug]/page.jsx'

// Import teacher pages
import TeacherDashboard from './app/teacher/page.jsx'
import CreateCoursePage from './app/teacher/courses/new/page.jsx'
import EditCoursePage from './app/teacher/courses/[courseId]/edit/page.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout><HomePage /></RootLayout>} />
          <Route path="/dashboard" element={<RootLayout><DashboardPage /></RootLayout>} />
          
          {/* Course pages */}
          <Route path="/courses" element={<RootLayout><CoursesPage /></RootLayout>} />
          <Route path="/courses/:courseSlug" element={<RootLayout><CourseDetailPage /></RootLayout>} />
          <Route path="/courses/:courseSlug/learn" element={<RootLayout><CoursePlayerPage /></RootLayout>} />
          <Route path="/waitlist/:courseSlug" element={<RootLayout><WaitlistPage /></RootLayout>} />
          
          {/* Teacher pages */}
          <Route path="/teacher" element={<RootLayout><TeacherDashboard /></RootLayout>} />
          <Route path="/teacher/courses/new" element={<RootLayout><CreateCoursePage /></RootLayout>} />
          <Route path="/teacher/courses/:courseId/edit" element={<RootLayout><EditCoursePage /></RootLayout>} />
          
          {/* Public pages */}
          <Route path="/tutors" element={<RootLayout><TutorsPage /></RootLayout>} />
          <Route path="/teach" element={<RootLayout><TeachPage /></RootLayout>} />
          <Route path="/teach/signup" element={<RootLayout><TeachSignupPage /></RootLayout>} />
          <Route path="/business" element={<RootLayout><BusinessPage /></RootLayout>} />
          <Route path="/proven-progress" element={<RootLayout><ProvenProgressPage /></RootLayout>} />
          <Route path="/contact" element={<RootLayout><ContactPage /></RootLayout>} />

          {/* Admin pages */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          
          {/* Supabase Test */}
          <Route path="/test-supabase" element={<RootLayout><SupabaseTest /></RootLayout>} />
          
          {/* Dynamic routes - all content loaded from Supabase */}
          <Route path="/chapters/:chapter" element={<RootLayout><DynamicChapterPage /></RootLayout>} />
          <Route path="/chapters/:chapter/topics/:topic" element={<RootLayout><DynamicLessonPage /></RootLayout>} />
          
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
