export default function PublicStatCard({ 
  icon, 
  number, 
  label, 
  description,
  className = "" 
}) {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
        {icon || (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )}
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">
        {number}
      </div>
      <div className="text-lg font-medium text-gray-700 mb-1">
        {label}
      </div>
      {description && (
        <div className="text-sm text-gray-500">
          {description}
        </div>
      )}
    </div>
  )
}

