import { site } from '@/lib/site'

const demoNotices = [
  {
    title: '공지사항 페이지 구조',
    date: '—',
    body: '향후 휴진/이벤트/진료 안내를 이곳에 게시합니다.',
  },
  {
    title: '진료 시간 변동',
    date: '—',
    body: '변동이 있을 경우 본 페이지에 업데이트됩니다.',
  },
] as const

export default function NoticesPage() {
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
        <div className="grid gap-4">
          {demoNotices.map((n) => (
            <article key={n.title} className="flat-card p-7">
              <div className="flex items-center justify-between gap-6">
                <div className="text-base font-semibold">{n.title}</div>
                <div className="text-sm text-[color:var(--muted)]">{n.date}</div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">{n.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flat-card p-7 text-sm text-[color:var(--muted)]">
          방문 안내는 메인 페이지의 <a className="flat-link text-[color:var(--ink)]" href="/#visit">오시는 길</a> 섹션에서 확인할 수 있습니다.
        </div>
      </main>
    </div>
  )
}
