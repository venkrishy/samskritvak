import { useAuth } from '@/context/AuthContext'

export default function LoginModal({ open, onClose, redirectPath = '/dashboard' }) {
  if (!open) return null;
  const { signInWithGoogle } = (() => { try { return useAuth() } catch { return {} } })()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Log in to BhashaBoli</h2>
          <p className="text-sm text-gray-600">Sign in with your Google account</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => signInWithGoogle(redirectPath)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.676 31.659 29.223 35 24 35 16.82 35 11 29.18 11 22S16.82 9 24 9c3.17 0 6.066 1.203 8.262 3.162l5.657-5.657C34.676 2.676 29.676 1 24 1 10.745 1 0 11.745 0 25s10.745 24 24 24 24-10.745 24-24c0-1.627-.174-3.214-.389-4.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.26 15.108 18.76 12 24 12c3.17 0 6.066 1.203 8.262 3.162l5.657-5.657C34.676 5.676 29.676 4 24 4 15.319 4 7.846 8.717 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 46c5.166 0 9.86-1.977 13.393-5.197l-6.19-5.238C29.145 37.488 26.7 38 24 38c-5.196 0-9.632-3.305-11.24-7.943l-6.51 5.02C8.737 41.74 15.86 46 24 46z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.091 3.159-3.48 5.651-6.503 7.014.001-.001 6.19 5.238 6.19 5.238C37.43 38.162 40 32.5 40 26c0-2.033-.222-3.984-.389-5.917z"/>
            </svg>
            Continue with Google
          </button>
        </div>
        <div className="mt-4 flex justify-center">
          <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-700">Close</button>
        </div>
      </div>
    </div>
  )
}


