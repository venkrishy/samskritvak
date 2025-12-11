import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
]

export default function PublicCurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('bhashaboli-currency')
    if (saved && currencies.find(c => c.code === saved)) {
      setSelectedCurrency(saved)
    }
  }, [])

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency.code)
    localStorage.setItem('bhashaboli-currency', currency.code)
    setIsOpen(false)
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency: currency.code, symbol: currency.symbol } 
    }))
  }

  const currentCurrency = currencies.find(c => c.code === selectedCurrency)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <span>{currentCurrency?.symbol} {currentCurrency?.code}</span>
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
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <div className="py-1">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    selectedCurrency === currency.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span>{currency.symbol} {currency.name}</span>
                  {selectedCurrency === currency.code && (
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

