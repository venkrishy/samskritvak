import { useState, useEffect } from 'react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import PublicTutorCard from '@/components/public/PublicTutorCard'
import PublicTutorFilter from '@/components/public/PublicTutorFilter'
import { Button } from '@/components/ui/button'
import { Search, MapPin } from 'lucide-react'
import { getSampleTutors } from '@/config/siteConfig'
export default function TutorsPage() {
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const tutorsPerPage = 6

  // Use R2 URLs for tutor avatars
  const tutorAvatars = [
    'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/sanskrit/images/tutor-placeholder-1.jpg',
    'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/sanskrit/images/tutor-placeholder-2.jpg',
    'https://pub-2d36cb8692e14028b7ad2e33e6fc99d0.r2.dev/sanskrit/images/tutor-placeholder-3.jpg'
  ]

  // Load tutors with hardcoded R2 images
  useEffect(() => {
    const mockTutors = getSampleTutors()
    
    // Map R2 avatars to tutors
    const tutorsWithImages = mockTutors.map((tutor, index) => {
      return {
        ...tutor,
        profile_photo_url: tutorAvatars[index % tutorAvatars.length]
      }
    })
    
    setTutors(tutorsWithImages)
    setLoading(false)
  }, [])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
    // In real app, apply filters to API call
  }

  const handleViewProfile = (tutor) => {
    console.log('View profile for:', tutor.full_name)
    // Navigate to tutor profile page
  }

  // Filter tutors based on search and filters
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tutor.languages_taught.some(lang => lang.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          tutor.bio.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Basic filter logic (can be expanded)
    const matchesSubject = !filters.subject || tutor.languages_taught.includes(filters.subject)
    const matchesPrice = !filters.priceRange || (tutor.hourly_rate_usd >= filters.priceRange[0] && tutor.hourly_rate_usd <= filters.priceRange[1])

    return matchesSearch && matchesSubject && matchesPrice
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage)
  const startIndex = (currentPage - 1) * tutorsPerPage
  const endIndex = startIndex + tutorsPerPage
  const currentTutors = filteredTutors.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Subject Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="What do you want to learn?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location Search */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Where are you located?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Search Button */}
              <Button className="bg-black text-white hover:bg-gray-800">
                Find Tutors
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PublicTutorFilter onFilterChange={handleFilterChange} />
          </div>

          {/* Tutors Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading tutors...' : `${filteredTutors.length} tutors found`}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Experience</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="ml-3">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentTutors.map((tutor) => (
                  <PublicTutorCard
                    key={tutor.id}
                    tutor={tutor}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            )}

            {/* Dynamic Pagination - Only show if there are multiple pages */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  
                  {/* Generate page numbers dynamically */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant="outline"
                      className={currentPage === page ? "bg-black text-white" : ""}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
