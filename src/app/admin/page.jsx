import { useState } from 'react'
import AdminPanel from '@/components/admin/AdminPanel'
import LoginModal from '@/components/auth/LoginModal'

export default function AdminPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  const handleLoginClick = () => {
    console.log('Login button clicked!')
    setLoginOpen(true)
  }

  return (
    <>
      <AdminPanel onLoginClick={handleLoginClick} />
      <LoginModal 
        open={loginOpen} 
        onClose={() => setLoginOpen(false)} 
        redirectPath="/admin/dashboard" 
      />
    </>
  )
}
