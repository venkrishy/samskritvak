import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TopBar from '@/components/TopBar'
import TableOfContents from '@/components/TableOfContents'
import { useAuth } from '@/context/AuthContext'
import { useLocation } from 'react-router-dom'

// Table of contents is now loaded dynamically from Supabase
// Use CurriculumService.getChapters() to get chapter data
// Use CurriculumService.getAllCurriculum() to get full curriculum data

export default function RootLayout({ children }) {
  const [tocOpen, setTocOpen] = useState(true) // TOC open by default
  const location = useLocation()
  
  // Check if user is authenticated
  let user, loading
  try {
    const ctx = useAuth()
    user = ctx.user
    loading = ctx.loading
  } catch {
    user = null
    loading = false
  }

  // Check if current route is a public page
  const publicRoutes = ['/tutors', '/teach', '/business', '/proven-progress', '/contact']
  const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route))
  const isHomePage = location.pathname === '/'
  
  // Show public layout for public routes and homepage (when not logged in)
  const showPublicLayout = isPublicRoute || (isHomePage && !user)

  if (showPublicLayout) {
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    )
  }

  // Show authenticated layout for dashboard and other authenticated routes
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        onToggleToc={() => setTocOpen(!tocOpen)}
        onTogglePractice={() => console.log('Practice mode toggled')}
      />
      
      <div className="flex">
        {/* TOC Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          tocOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Table of Contents</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTocOpen(false)}
              className="flex items-center justify-center"
              title="Close Table of Contents"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="h-full">
              <TableOfContents />
            </div>
          </ScrollArea>
        </div>

        {/* Overlay for TOC */}
        {tocOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setTocOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <div className="min-h-screen">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}