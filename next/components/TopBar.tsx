'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUserProgress } from '@/hooks/useUserProgress'
import { useAuth } from '@/context/AuthContext'

interface TopBarProps {
  onToggleToc?: () => void
  onTogglePractice?: () => void
}

export default function TopBar({ onToggleToc, onTogglePractice }: TopBarProps) {
  const [activeTab, setActiveTab] = useState('continue')
  const { lastLesson, loading: progressLoading, error: progressError } = useUserProgress()
  const { user, signInWithGoogle, signOut, loading: authLoading } = useAuth()

  const getContinueUrl = () => {
    if (lastLesson) {
      return `/chapters/${lastLesson.chapter}/topics/${lastLesson.topic}`
    }
    return '/chapters/1/topics/1.1' // Default to first lesson
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-gray-900">TattvaJnana</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href={getContinueUrl()}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'continue'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('continue')}
          >
{progressLoading ? 'Loading...' : progressError ? 'Continue Learning' : 'Continue where I left off'}
          </Link>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Student Dashboard
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'account'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'activity'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recent Activity
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Status */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Session active</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleToc}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Table of Contents"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={onTogglePractice}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Practice"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          </div>

              {/* User menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.displayName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium">{user?.user_metadata?.full_name || user?.email}</div>
                        <div className="text-gray-500">{user?.email}</div>
                      </div>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account preferences</a>
                      <button 
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  disabled={authLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {authLoading ? 'Loading...' : 'Sign In'}
                </button>
              )}
        </div>
      </div>
    </div>
  )
}
