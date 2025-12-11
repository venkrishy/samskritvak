import { Button } from '@/components/ui/button'

export default function PublicFeatureCard({ 
  icon, 
  number,
  title, 
  description, 
  cta,
  className = "" 
}) {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      {/* Icon/Number */}
      <div className="flex items-center mb-4">
        {number && (
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            {number}
          </div>
        )}
        {icon && (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">
        {description}
      </p>

      {/* CTA */}
      {cta && (
        <Button
          onClick={cta.onClick}
          variant="outline"
          className="w-full"
        >
          {cta.text}
        </Button>
      )}
    </div>
  )
}

