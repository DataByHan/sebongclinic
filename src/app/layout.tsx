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

const siteDescription = '세봉(世奉)한의원 · 김형규 원장 · 공진단/척추치료/총명탕'
const siteTitle = `${site.name} | 부산 남천동 한의원`
const siteImage = `${site.url}/img/dan.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    '세봉한의원',
    '부산 한의원',
    '남천동 한의원',
    '공진단',
    '척추치료',
    '총명탕',
    '한의원 추천',
  ],
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    type: 'website',
    url: site.url,
    title: siteTitle,
    description: siteDescription,
    siteName: site.name,
    locale: 'ko_KR',
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [siteImage],
  },
  robots: {
    index: true,
    follow: true,
  },
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
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: site.name,
    url: site.url,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressLocality: '부산광역시',
      addressRegion: '부산',
      addressCountry: 'KR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '13:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '00:00',
        closes: '00:00',
      },
    ],
  }

  return (
    <html lang="ko" className={[sans.variable, serif.variable].join(' ')}>
      <body className="min-h-screen antialiased type-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  )
}
