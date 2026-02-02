import Reveal from '@/components/Reveal'
import KakaoMap from '@/components/KakaoMap'
import { site } from '@/lib/site'

const KAKAO_MAPS_APP_KEY = 'ef4c54335f7dd8f28f18000e6fcdd0f4'

function ExternalAnchor({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

export default function HomePage() {
  return (
    <div className="grain">
      <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[color:var(--paper)]/75 backdrop-blur">
        <div className="frame flex items-center justify-between py-4">
          <a href="#top" className="inline-flex items-baseline gap-2">
            <span className="type-serif text-lg tracking-tight">{site.name}</span>
            <span className="text-xs text-[color:var(--muted)]">Korean Medicine Clinic</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[color:var(--muted)]">
            <a href="#doctor" className="hover:text-[color:var(--ink)]">의료진</a>
            <a href="#specialties" className="hover:text-[color:var(--ink)]">전문영역</a>
            <a href="#links" className="hover:text-[color:var(--ink)]">소식</a>
            <a href="#visit" className="hover:text-[color:var(--ink)]">오시는 길</a>
            <a href="/notices" className="hover:text-[color:var(--ink)]">공지</a>
          </nav>
        </div>
      </header>

      <main id="top" className="mesh">
        <section className="min-h-[80svh] py-12 md:py-16">
          <div className="frame">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <Reveal>
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flat-chip">
                      <span className="h-2 w-2 rounded-full bg-[color:var(--jade)]" />
                      진료: 공진단 · 척추치료 · 총명탕
                    </span>
                    <span className="flat-chip">
                      <span className="h-2 w-2 rounded-full bg-[color:var(--tangerine)]" />
                      원장 {site.doctorName}
                    </span>
                  </div>

                  <h1 className="type-serif text-4xl leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                    세봉은
                    <br />
                    몸의 흐름을
                    <br />
                    다시 정렬합니다.
                  </h1>

                  <p className="max-w-2xl text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
                    {site.tagline} 과장된 약속 대신, 진단과 기록, 그리고 생활 리듬까지.
                    한 번의 처치가 아니라 “회복의 과정”을 설계합니다.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a href="#visit" className="cta">오시는 길</a>
                    <a href={`tel:${site.phone}`} className="cta-ghost">전화 {site.phone}</a>
                  </div>

                  <p className="text-xs text-[color:var(--muted)]">
                    스크롤로 이어지는 한 장의 안내서.
                  </p>
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div className="flat-card p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">SEBONG</div>
                      <div className="mt-3 type-serif text-2xl">진료 포인트</div>
                    </div>
                    <div className="text-right text-xs text-[color:var(--muted)]">
                      <div>flat · modern</div>
                      <div>scrollytelling</div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {[
                      { k: '진단', v: '증상만 보지 않고, 패턴을 봅니다.' },
                      { k: '처방', v: '단기 완화와 장기 유지의 균형.' },
                      { k: '관리', v: '리듬을 망치는 습관부터 정리.' },
                    ].map((row) => (
                      <div key={row.k} className="flex items-center justify-between gap-6 rounded-xl bg-[color:var(--paper-2)] px-4 py-4">
                        <div className="text-sm font-semibold">{row.k}</div>
                        <div className="text-sm text-[color:var(--muted)]">{row.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 border-t border-[color:var(--line)] pt-5 text-sm text-[color:var(--muted)]">
                    예약 및 문의: <a className="flat-link text-[color:var(--ink)]" href={`tel:${site.phone}`}>{site.phone}</a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="doctor" className="scroll-mt-24 py-12 md:py-16">
          <div className="frame">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <div className="space-y-6">
                  <div className="flat-chip">의료진 소개</div>
                  <h2 className="type-serif text-3xl tracking-tight sm:text-4xl">{site.doctorName} 원장</h2>
                  <p className="text-[color:var(--muted)] leading-relaxed">
                    빠른 결론보다 충분한 관찰을 우선합니다. 설명 가능한 진료, 기록으로 남는 치료,
                    환자가 이해하는 계획을 지향합니다.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { t: '상담', d: '증상/생활/패턴을 함께 정리' },
                      { t: '진단', d: '몸의 균형과 흐름을 체크' },
                      { t: '치료', d: '맞춤 처방으로 단계적 회복' },
                      { t: '관리', d: '재발을 줄이는 루틴 설계' },
                    ].map((c) => (
                      <div key={c.t} className="flat-card p-5">
                        <div className="text-sm font-semibold">{c.t}</div>
                        <div className="mt-2 text-sm text-[color:var(--muted)]">{c.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div className="flat-card p-7 sm:p-9">
                  <div className="flex items-center justify-between">
                    <div className="type-serif text-2xl">{site.name}</div>
                    <div className="text-xs text-[color:var(--muted)]">Doctor</div>
                  </div>
                  <div className="mt-8 grid gap-4">
                    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--paper-2)] p-6">
                      <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">NAME</div>
                      <div className="mt-2 text-2xl font-semibold">{site.doctorName}</div>
                      <div className="mt-2 text-sm text-[color:var(--muted)]">한의사</div>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--line)] bg-white p-6">
                      <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">FOCUS</div>
                      <div className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                        환자에게 필요한 만큼만 복잡하게. 핵심만 남겨
                        치료가 “내 이야기”로 이해되게 만듭니다.
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="specialties" className="scroll-mt-24 py-12 md:py-16">
          <div className="frame">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <Reveal>
                <div className="space-y-3">
                  <div className="flat-chip">전문영역</div>
                  <h2 className="type-serif text-3xl tracking-tight sm:text-4xl">세 가지 집중 진료</h2>
                  <p className="max-w-2xl text-[color:var(--muted)] leading-relaxed">
                    공진단 · 척추치료 · 총명탕. 자주 찾는 핵심 영역을 중심으로 상담과 치료를 설계합니다.
                  </p>
                </div>
              </Reveal>
              <Reveal delayMs={100}>
                <div className="text-sm text-[color:var(--muted)]">
                  참고 링크는 외부 사이트로 이동합니다.
                </div>
              </Reveal>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {site.specialties.map((s, idx) => (
                <Reveal key={s.title} delayMs={idx * 90}>
                  <ExternalAnchor href={s.href} className="group flat-card block p-7 transition-colors hover:bg-[color:var(--paper-2)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="type-serif text-2xl tracking-tight">{s.title}</div>
                        <div className="mt-2 text-sm text-[color:var(--muted)]">{s.subtitle}</div>
                      </div>
                      <div className="mt-1 text-sm text-[color:var(--muted)] group-hover:text-[color:var(--ink)]">↗</div>
                    </div>
                    <p className="mt-6 text-sm leading-relaxed text-[color:var(--muted)]">{s.description}</p>
                    <div className="mt-7 text-sm font-semibold text-[color:var(--jade)]">효능/정보 보기</div>
                  </ExternalAnchor>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="links" className="scroll-mt-24 py-12 md:py-16">
          <div className="frame">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <Reveal>
                <div className="space-y-4">
                  <div className="flat-chip">관련 뉴스 · 블로그 · 저서</div>
                  <h2 className="type-serif text-3xl tracking-tight sm:text-4xl">세봉을 더 알아보기</h2>
                  <p className="text-[color:var(--muted)] leading-relaxed">
                    언론/저서/후기 링크를 모았습니다.
                    처음 방문하시는 분이라면 분위기부터 확인해 보세요.
                  </p>
                  <a href="/notices" className="cta-ghost">공지사항 보기</a>
                </div>
              </Reveal>

              <div className="grid gap-4">
                {site.externalLinks.map((l, idx) => (
                  <Reveal key={l.href} delayMs={idx * 80}>
                    <ExternalAnchor href={l.href} className="flat-card block p-6 transition-colors hover:bg-[color:var(--paper-2)]">
                      <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">LINK</div>
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <div className="text-base font-semibold">{l.label}</div>
                        <div className="text-sm text-[color:var(--muted)]">↗</div>
                      </div>
                    </ExternalAnchor>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="visit" className="scroll-mt-24 py-12 md:py-16">
          <div className="frame">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <Reveal>
                <div className="space-y-6">
                  <div className="flat-chip">오시는 길 · 연락처 · 진료시간</div>
                  <h2 className="type-serif text-3xl tracking-tight sm:text-4xl">방문 안내</h2>

                  <div className="flat-card p-6">
                    <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">ADDRESS</div>
                    <div className="mt-2 text-base font-semibold">{site.address}</div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <a href={`tel:${site.phone}`} className="cta-ghost">전화 {site.phone}</a>
                      <ExternalAnchor href={site.kakaoMapLink} className="cta">카카오 지도 열기</ExternalAnchor>
                    </div>
                  </div>

                  <div className="flat-card p-6">
                    <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">HOURS</div>
                    <table className="mt-4 w-full text-sm">
                      <tbody>
                        {site.hours.map((h) => (
                          <tr key={h.label} className="border-b border-[color:var(--line)] last:border-b-0">
                            <td className="py-3 pr-4 text-[color:var(--muted)]">{h.label}</td>
                            <td className="py-3 font-semibold">{h.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-3 text-xs text-[color:var(--muted)]">상세 휴진/변동은 공지사항을 확인해 주세요.</div>
                  </div>
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div className="space-y-4">
                  <KakaoMap
                    appKey={KAKAO_MAPS_APP_KEY}
                    address={site.address}
                    className="h-[22rem] sm:h-[28rem]"
                  />
                  <div className="flat-card p-5 text-sm text-[color:var(--muted)]">
                    지도에서 위치가 다르게 표시되면 <ExternalAnchor href={site.kakaoMapLink} className="flat-link text-[color:var(--ink)]">카카오 지도 링크</ExternalAnchor>
                    를 기준으로 확인해 주세요.
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <footer className="border-t border-[color:var(--line)] bg-[color:var(--paper)]">
          <div className="frame flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[color:var(--muted)]">
              <span className="type-serif text-[color:var(--ink)]">{site.name}</span> · {site.address}
            </div>
            <div className="flex items-center gap-5 text-sm">
              <a href="/notices" className="flat-link">공지사항</a>
              <a href={`tel:${site.phone}`} className="flat-link">전화</a>
              <a href="#top" className="flat-link">맨 위로</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
