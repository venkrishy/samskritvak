'use client'
import TopBar from '@/components/TopBar'
import TableOfContents from '@/components/TableOfContents'
import { AuthProvider } from '@/context/AuthContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:h-[calc(100vh-73px)]">
          {/* Left Sidebar - Table of Contents */}
          <TableOfContents />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-8">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <main className="min-h-screen">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}