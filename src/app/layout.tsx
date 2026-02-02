import type { Metadata, Viewport } from 'next'
import { Nanum_Myeongjo, Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { site } from '@/lib/site'

const sans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const serif = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: site.name,
  description: '세봉(世奉)한의원 · 김형규 원장 · 공진단/척추치료/총명탕',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={[sans.variable, serif.variable].join(' ')}>
      <body className="min-h-screen antialiased type-sans">
        {children}
      </body>
    </html>
  )
}
