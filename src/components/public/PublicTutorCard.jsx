import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Clock } from 'lucide-react'

export default function PublicTutorCard({ 
  tutor, 
  onViewProfile,
  className = "" 
}) {
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const formatPrice = (priceUsd) => {
    // Simple conversion - in real app, use actual exchange rates
    const rates = { USD: 1, EUR: 0.92, GBP: 0.79, BRL: 4.96, PLN: 3.96, UAH: 36.5 }
    const convertedPrice = priceUsd * (rates[currency] || 1)
    return `${currencySymbol}${Math.round(convertedPrice)}`
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow ${className}`}>
      {/* Header with avatar and online status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={tutor.profile_photo_url || '/images/tutor-placeholder-1.jpg'}
              alt={tutor.full_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tutor.full_name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              <span>Online</span>
            </div>
          </div>
        </div>
        
        {/* Rating */}
        <div className="text-right">
          <div className="flex items-center mb-1">
            {renderStars(tutor.rating)}
          </div>
          <div className="text-sm text-gray-500">
            {tutor.total_reviews} reviews
          </div>
        </div>
      </div>

      {/* Languages taught */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {tutor.languages_taught?.slice(0, 3).map((language) => (
            <span
              key={language}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {language}
            </span>
          ))}
          {tutor.languages_taught?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{tutor.languages_taught.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Bio */}
      {tutor.bio && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {tutor.bio}
        </p>
      )}

      {/* Experience and lessons */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{tutor.experience_years} years experience</span>
        <span>{tutor.total_lessons_taught} lessons taught</span>
      </div>

      {/* Price and CTA */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(tutor.hourly_rate_usd)}/hour
          </div>
          <div className="text-sm text-gray-500">per hour</div>
        </div>
        <Button
          onClick={() => onViewProfile?.(tutor)}
          className="bg-black text-white hover:bg-gray-800"
        >
          View Profile
        </Button>
      </div>
    </div>
  )
}

