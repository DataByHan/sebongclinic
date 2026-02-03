import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: `공지사항 | ${site.name}`,
  description: `${site.name}의 공지사항과 휴진 안내를 확인하세요.`,
  alternates: {
    canonical: `${site.url}/notices`,
  },
  openGraph: {
    title: `공지사항 | ${site.name}`,
    description: `${site.name}의 공지사항과 휴진 안내를 확인하세요.`,
    url: `${site.url}/notices`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function NoticesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
