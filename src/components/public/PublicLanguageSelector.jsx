import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'pl', name: 'Polski' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ar', name: 'العربية' },
  { code: 'th', name: 'ภาษาไทย' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
]

export default function PublicLanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('bhashaboli-language')
    if (saved && languages.find(l => l.code === saved)) {
      setSelectedLanguage(saved)
    }
  }, [])

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.code)
    localStorage.setItem('bhashaboli-language', language.code)
    setIsOpen(false)
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: language.code, name: language.name } 
    }))
  }

  const currentLanguage = languages.find(l => l.code === selectedLanguage)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <span>{currentLanguage?.name}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    selectedLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span>{language.name}</span>
                  {selectedLanguage === language.code && (
                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

