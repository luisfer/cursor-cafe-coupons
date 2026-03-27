import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cafe Coupons · Cursor Community',
  description: 'Generate printable coffee coupons for Cursor community events — web editor and CLI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
