import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export default function TopBar({ onToggleToc, onTogglePractice }) {
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

  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isActive = (pathStarts) => pathStarts.some((p) => location.pathname.startsWith(p))

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
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Samskritavak</span>
          </Link>

          {/* Center: Tabs - one line bar with active indicator */}
          {user && (
            <div className="relative bg-gray-50 rounded-lg px-2 py-1 shadow-sm border border-gray-100 hidden md:flex items-center gap-1">
              <Link to="/curriculum" className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(['/curriculum']) ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}>
                {isActive(['/curriculum']) && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-md"></span>}
                Continue where I left off
              </Link>
              <Link to="/dashboard" className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(['/dashboard']) ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}>
                {isActive(['/dashboard']) && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-md"></span>}
                Student Dashboard
              </Link>
              <Link to="/account" className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(['/account']) ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}>
                {isActive(['/account']) && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-md"></span>}
                Account
              </Link>
              <Link to="/activity" className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(['/activity']) ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}>
                {isActive(['/activity']) && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rounded-md"></span>}
                Recent Activity
              </Link>
            </div>
          )}

          {/* Right: Session, Avatar, Toggles */}
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 mr-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Session active</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={onToggleToc} className="flex items-center gap-1">
              <Menu className="w-4 h-4" />
              TOC
            </Button>
            <Button variant="outline" size="sm" onClick={onTogglePractice} className="flex items-center gap-1">
              <Menu className="w-4 h-4" />
              Practice
            </Button>
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setMenuOpen(v => !v)} className="focus:outline-none">
                  {(() => {
                    const meta = user?.user_metadata || {}
                    // Common locations for Google avatar
                    const candidateUrls = [
                      meta.avatar_url,
                      meta.picture,
                      meta.avatar,
                      meta.photoURL,
                      meta.image_url,
                      // Supabase identity payload sometimes stored in identities
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
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-xl z-50">
                    <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.user_metadata?.full_name || user?.user_metadata?.name || 'Account'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                    </div>
                    <div className="py-2">
                      <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Account preferences</Link>
                      <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Log out</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


