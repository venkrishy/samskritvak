import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getProgress } from '@/lib/cookies'

export default function Navbar({ onLoginClick, showDashboardLink = true, activeTab, onTabChange }) {
  let user, signOut, loading
  try {
    const ctx = useAuth()
    user = ctx.user
    signOut = ctx.signOut
    loading = ctx.loading
  } catch {
    user = null
    loading = false
  }
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  // Get user progress for "Continue where I left off"
  const progress = user ? getProgress() : null

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <nav className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Top row - Logo and Auth */}
        <div className="flex items-center justify-between mb-3">
          <a href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            TattvaJnana
          </a>
          
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="inline-flex items-center px-4 py-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                Loading...
              </div>
            ) : !user ? (
              <button
                onClick={onLoginClick}
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Log in
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Session active</span>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setMenuOpen((v) => !v)} className="focus:outline-none">
                    {(() => {
                      const meta = user?.user_metadata || {}
                      const candidateUrls = [
                        meta.avatar_url,
                        meta.picture,
                        meta.avatar,
                        meta.photoURL,
                        meta.image_url,
                        user?.identities?.[0]?.identity_data?.avatar_url,
                        user?.identities?.[0]?.identity_data?.picture,
                      ].filter(Boolean)
                      const src = candidateUrls[0]
                      return src ? (
                        <img 
                          src={src} 
                          alt="avatar" 
                          className="h-8 w-8 rounded-full border-2 border-white shadow-md" 
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null
                    })()}
                    <div 
                      className={`h-8 w-8 rounded-full border-2 border-white shadow-md bg-blue-600 flex items-center justify-center ${user?.user_metadata?.avatar_url ? 'hidden' : 'flex'}`}
                      style={{ display: (user?.user_metadata?.avatar_url || user?.user_metadata?.picture || user?.identities?.[0]?.identity_data?.avatar_url) ? 'none' : 'flex' }}
                    >
                      <span className="text-white text-sm font-medium">
                        {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-4 top-16 w-64 rounded-xl border bg-white shadow-xl z-50">
                      <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.user_metadata?.full_name || user?.user_metadata?.name || 'Account'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                      </div>
                      <div className="py-2">
                        <a href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Account preferences
                        </a>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          Theme (TODO)
                        </button>
                        <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation tabs - only show when user is logged in */}
        {user && (
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => onTabChange?.('continue')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'continue' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Continue where I left off
              {progress && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {progress.lessonId}
                </span>
              )}
            </button>
            
            <button
              onClick={() => onTabChange?.('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Student Dashboard
            </button>
            
            <button
              onClick={() => onTabChange?.('account')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'account' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </button>
            
            <button
              onClick={() => onTabChange?.('activity')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'activity' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}


