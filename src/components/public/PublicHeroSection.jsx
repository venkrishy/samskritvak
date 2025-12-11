import { Button } from '../ui/button.jsx'

export default function PublicHeroSection({ 
  headline, 
  subtitle, 
  primaryCta, 
  secondaryCta, 
  heroImage,
  gradient = false 
}) {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight ${
                gradient 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}>
                {headline}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                {subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryCta && (
                <Button
                  onClick={primaryCta.onClick}
                  className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg"
                >
                  {primaryCta.text}
                </Button>
              )}
              {secondaryCta && (
                <Button
                  onClick={secondaryCta.onClick}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg"
                >
                  {secondaryCta.text}
                </Button>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            {heroImage ? (
              <img
                src={heroImage}
                alt="Hero"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Hero Image Placeholder</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

