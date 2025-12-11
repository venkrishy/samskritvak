import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { getSupportedLanguages } from '@/config/siteConfig'

export default function PublicTutorFilter({ 
  onFilterChange,
  className = "" 
}) {
  const [filters, setFilters] = useState({
    subject: '',
    priceRange: [10, 50],
    availability: 'any',
    nativeSpeaker: false,
    experience: 'any'
  })

  const [currency, setCurrency] = useState('USD')
  const [currencySymbol, setCurrencySymbol] = useState('$')

  useEffect(() => {
    // Listen for currency changes
    const handleCurrencyChange = (event) => {
      setCurrency(event.detail.currency)
      setCurrencySymbol(event.detail.symbol)
    }

    window.addEventListener('currencyChanged', handleCurrencyChange)
    
    // Load initial currency
    const saved = localStorage.getItem('bhashaboli-currency')
    if (saved) {
      setCurrency(saved)
      const symbols = { USD: '$', EUR: '€', GBP: '£', BRL: 'R$', PLN: 'zł', UAH: '₴' }
      setCurrencySymbol(symbols[saved] || '$')
    }

    return () => window.removeEventListener('currencyChanged', handleCurrencyChange)
  }, [])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const subjects = getSupportedLanguages().map(lang => lang.name)

  const experienceLevels = [
    { value: 'any', label: 'Any experience' },
    { value: 'beginner', label: '1-2 years' },
    { value: 'intermediate', label: '3-5 years' },
    { value: 'advanced', label: '5+ years' }
  ]

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
      
      <div className="space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price ({currencySymbol})
          </label>
          <div className="px-3">
            <Slider
              value={[filters.priceRange[1]]}
              onValueChange={(value) => handleFilterChange('priceRange', [filters.priceRange[0], value[0]])}
              min={5}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{currencySymbol}5</span>
              <span>{currencySymbol}{filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="any">Any time</option>
            <option value="morning">Morning (6AM-12PM)</option>
            <option value="afternoon">Afternoon (12PM-6PM)</option>
            <option value="evening">Evening (6PM-12AM)</option>
            <option value="night">Night (12AM-6AM)</option>
          </select>
        </div>

        {/* Native Speaker */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.nativeSpeaker}
              onChange={(e) => handleFilterChange('nativeSpeaker', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Native speaker only</span>
          </label>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {experienceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <Button
          onClick={() => {
            const defaultFilters = {
              subject: '',
              priceRange: [10, 50],
              availability: 'any',
              nativeSpeaker: false,
              experience: 'any'
            }
            setFilters(defaultFilters)
            onFilterChange?.(defaultFilters)
          }}
          variant="outline"
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
