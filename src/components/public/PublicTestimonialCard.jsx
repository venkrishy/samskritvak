export default function PublicTestimonialCard({ 
  quote, 
  author, 
  role, 
  avatar,
  rating = 5,
  className = "" 
}) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      {/* Quote */}
      <blockquote className="text-gray-700 mb-4 italic">
        "{quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                {author?.charAt(0) || 'A'}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="flex items-center mb-1">
            {renderStars(rating)}
          </div>
          <div className="font-medium text-gray-900">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  )
}

