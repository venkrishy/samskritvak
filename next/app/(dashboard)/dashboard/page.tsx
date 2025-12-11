'use client'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your progress and continue your Sanskrit learning journey</p>
        </div>
      </div>
      
      <Dashboard />
    </div>
  )
}