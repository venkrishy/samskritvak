import { Link } from 'react-router-dom'

export default function PublicFooter() {
  const footerSections = [
    {
      title: 'About Us',
      links: [
        { name: 'Who we are', href: '/about' },
        { name: 'How it works', href: '/how-it-works' },
        { name: 'BhashaBoli reviews', href: '/reviews' },
        { name: 'BhashaBoli app', href: '/app' },
        { name: 'Proven progress platform', href: '/proven-progress' },
        { name: 'Community guidelines', href: '/guidelines' },
        { name: 'Work at BhashaBoli!', href: '/careers' },
        { name: 'Status', href: '/status' },
        { name: 'Research and Studies', href: '/research' },
        { name: 'Media kit', href: '/media' },
        { name: 'Affiliate program', href: '/affiliate' },
      ]
    },
    {
      title: 'For Students',
      links: [
        { name: 'BhashaBoli Blog', href: '/blog' },
        { name: 'Questions and Answers', href: '/faq' },
        { name: 'Student discount', href: '/discount' },
        { name: 'Refer a friend', href: '/refer' },
        { name: 'Test your language for free', href: '/test' },
        { name: 'Test your vocab', href: '/vocab-test' },
        { name: 'BhashaBoli discounts', href: '/discounts' },
      ]
    },
    {
      title: 'For Tutors',
      links: [
        { name: 'Become an online tutor', href: '/teach' },
        { name: 'Teach English online', href: '/teach/english' },
        { name: 'Teach French online', href: '/teach/french' },
        { name: 'Teach Spanish online', href: '/teach/spanish' },
        { name: 'Teach German online', href: '/teach/german' },
        { name: 'See all online tutoring jobs', href: '/jobs' },
      ]
    },
    {
      title: 'For Companies',
      links: [
        { name: 'Corporate language training', href: '/business' },
        { name: 'Corporate English training', href: '/business/english' },
        { name: 'Corporate Spanish training', href: '/business/spanish' },
        { name: 'Corporate training blog', href: '/business/blog' },
        { name: 'Resource center', href: '/business/resources' },
        { name: 'Language level test for companies', href: '/business/test' },
        { name: 'Language training for employee relocation', href: '/business/relocation' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Need any help?', href: '/contact' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'facebook' },
    { name: 'Instagram', href: '#', icon: 'instagram' },
    { name: 'YouTube', href: '#', icon: 'youtube' },
    { name: 'LinkedIn', href: '#', icon: 'linkedin' },
    { name: 'TikTok', href: '#', icon: 'tiktok' },
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Contacts</h4>
              <p className="text-sm text-gray-600">
                USA<br />
                1309 Beacon Street, Suite 300, Brookline, MA, 02446
              </p>
            </div>
            
            {/* Social links */}
            <div className="mt-4 md:mt-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">BhashaBoli social</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={social.name}
                  >
                    <span className="sr-only">{social.name}</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      {/* Simple social media icon placeholder */}
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>© 2012-2025 BhashaBoli Inc.</span>
              <a href="/legal" className="hover:text-gray-900">Legal Center</a>
              <a href="/privacy" className="hover:text-gray-900">Privacy Policy</a>
              <a href="/cookies" className="hover:text-gray-900">Cookie Policy</a>
              <a href="/notice" className="hover:text-gray-900">Legal Notice</a>
            </div>
            
            {/* Apps */}
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Apps</span>
                <div className="flex space-x-2">
                  <a href="#" className="hover:text-gray-900">iOS</a>
                  <a href="#" className="hover:text-gray-900">Android</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

