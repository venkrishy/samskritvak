import Link from 'next/link'

export default function HomePage() {
  // Authentication will be handled on the client side

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
              The educational Platform to learn spoken sanskrit.
            </h1>
            <p className="mt-4 text-gray-700">
              Join the 100+ students that use Samskritavak to improve their mastery over Spoken Sanskrit.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-5 py-3 text-white hover:bg-black transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.676 31.659 29.223 35 24 35 16.82 35 11 29.18 11 22S16.82 9 24 9c3.17 0 6.066 1.203 8.262 3.162l5.657-5.657C34.676 2.676 29.676 1 24 1 10.745 1 0 11.745 0 25s10.745 24 24 24 24-10.745 24-24c0-1.627-.174-3.214-.389-4.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.26 15.108 18.76 12 24 12c3.17 0 6.066 1.203 8.262 3.162l5.657-5.657C34.676 5.676 29.676 4 24 4 15.319 4 7.846 8.717 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 46c5.166 0 9.86-1.977 13.393-5.197l-6.19-5.238C29.145 37.488 26.7 38 24 38c-5.196 0-9.632-3.305-11.24-7.943l-6.51 5.02C8.737 41.74 15.86 46 24 46z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.091 3.159-3.48 5.651-6.503 7.014.001-.001 6.19 5.238 6.19 5.238C37.43 38.162 40 32.5 40 26c0-2.033-.222-3.984-.389-5.917z"/>
                </svg>
                Continue with Google
              </Link>
              <a
                href="/curriculum"
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View Curriculum
              </a>
            </div>
          </div>
          {/* Image placeholder card */}
          <div className="border rounded-xl bg-white aspect-[4/3] w-full flex items-center justify-center text-gray-400">
            Image placeholder
          </div>
        </div>
      </div>
    </div>
  )
}