'use client'

import { useState, useEffect } from 'react'
import { site } from '@/lib/site'
import type { Notice } from '@/types/cloudflare'
import { sanitizeNoticeHtml } from '@/lib/sanitize'

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch('/api/notices')
        const data = await res.json() as { notices: Notice[] }
        setNotices(data.notices || [])
      } catch (error) {
        console.error('Failed to fetch notices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])
  return (
    <div className="min-h-screen">
      <header className="border-b border-[color:var(--line)] bg-[color:var(--paper)]">
        <div className="frame py-14">
          <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">NOTICE</div>
          <h1 className="mt-3 type-serif text-4xl tracking-tight">공지사항</h1>
          <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
            진료 일정/휴진/이벤트 안내를 게시합니다.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/" className="cta-ghost">메인으로</a>
            <a href={`tel:${site.phone}`} className="cta">전화 {site.phone}</a>
          </div>
        </div>
      </header>

      <main className="frame py-12">
        {loading ? (
          <div className="text-center text-[color:var(--muted)]">로딩 중...</div>
        ) : notices.length === 0 ? (
          <div className="flat-card p-7 text-center text-[color:var(--muted)]">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          <div className="grid gap-4">
            {notices.map((notice) => (
              <article key={notice.id} className="flat-card p-7">
                <div className="flex items-center justify-between gap-6">
                  <div className="text-base font-semibold">{notice.title}</div>
                  <div className="text-sm text-[color:var(--muted)]">
                    {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <div
                  className="mt-4 text-sm leading-relaxed text-[color:var(--muted)] prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeNoticeHtml(notice.content) }}
                />
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 flat-card p-7 text-sm text-[color:var(--muted)]">
          방문 안내는 메인 페이지의 <a className="flat-link text-[color:var(--ink)]" href="/#visit">오시는 길</a> 섹션에서 확인할 수 있습니다.
        </div>
      </main>
    </div>
  )
}
