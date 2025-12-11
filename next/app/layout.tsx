import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'SamskritVak',
  description: 'Dynamic lessons rendered from Supabase'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



