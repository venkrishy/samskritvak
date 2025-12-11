import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '../ui/button.jsx'
import PublicCurrencySelector from '../public/PublicCurrencySelector.jsx'
import PublicLanguageSelector from '../public/PublicLanguageSelector.jsx'

export default function PublicHeader({ onLoginClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)

  const navigation = [
    { name: 'Find Tutors', href: '/tutors' },
    { name: 'For Business', href: '/business' },
    { name: 'Become a Tutor', href: '/teach' },
    { name: 'Proven Progress', href: '/proven-progress' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar with language/currency selectors */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-sm">
            <div className="flex items-center space-x-4">
              <PublicLanguageSelector />
              <PublicCurrencySelector />
            </div>
            <div className="flex items-center space-x-4">
              <a href="/contact" className="text-gray-600 hover:text-gray-900">
                Help
              </a>
              <button
                onClick={onLoginClick}
                className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TattvaJnana</span>
              <span className="text-sm text-gray-600 ml-2">(Essence of Knowledge)</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA - Removed duplicate login button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Login button removed - using top bar login instead */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Button
                onClick={onLoginClick}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

