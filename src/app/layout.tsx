import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'QR Code Collection',
  description: 'รวบรวม QR Code พร้อมชื่อของทุกคน',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 antialiased">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-200">
          QR Code Collection — อัพโหลดและจัดเก็บ QR Code ของทุกคน
        </footer>
      </body>
    </html>
  )
}
