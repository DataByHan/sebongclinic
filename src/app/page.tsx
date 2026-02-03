import Reveal from '@/components/Reveal'
import KakaoMap from '@/components/KakaoMap'
import { site } from '@/lib/site'

const KAKAO_MAPS_APP_KEY = 'cec618c22684394ca4fda5495d2afe36'

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
        <section className="scroll-mt-24 py-24 md:py-40">
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
                    세봉(世奉)은
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
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div className="flat-card bg-[color:var(--paper-2)] p-7 sm:p-9">
                  <div>
                    <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">SEBONG</div>
                    <div className="mt-3 type-serif text-2xl">진료 포인트</div>
                  </div>

                  <div className="mt-8 space-y-6">
                    {[
                      { 
                        label: '진단', 
                        desc: '증상만 보지 않고, 패턴을 봅니다.'
                      },
                      { 
                        label: '처방', 
                        desc: '단기 완화와 장기 유지의 균형.'
                      },
                      { 
                        label: '관리', 
                        desc: '리듬을 망치는 습관부터 정리.'
                      },
                    ].map((item, idx) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                        <div className="space-y-1.5">
                          <div className="type-serif text-base font-semibold text-[color:var(--ink)]">{item.label}</div>
                          <div className="text-[15px] leading-relaxed text-[color:var(--muted)]">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 border-t border-[color:var(--line)] pt-6 text-sm text-[color:var(--muted)]">
                    예약 및 문의: <a className="flat-link text-[color:var(--ink)]" href={`tel:${site.phone}`}>{site.phone}</a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="doctor" className="scroll-mt-24 py-24 md:py-40">
          <div className="frame">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <div className="space-y-6">
                  <div className="flat-chip">한의사 소개</div>
                  <h2 className="type-serif text-3xl tracking-tight sm:text-4xl flex flex-wrap items-center gap-3">
                    {site.doctorName} 원장
                    <span 
                      data-testid="doctor-credential-badge"
                      className="inline-flex items-center rounded-full border border-[color:var(--jade)] bg-[color:var(--jade)]/5 px-3 py-1 text-sm font-normal text-[color:var(--jade)]"
                    >
                      한의학박사
                    </span>
                  </h2>
                  <div className="space-y-5 text-[15px] text-[color:var(--muted)] leading-[1.8]">
                    <p>
                      빠른 결론보다 충분한 관찰을 우선합니다.<br />
                      증상만 보는 것이 아니라, 그 증상이 생긴 흐름을 함께 봅니다.
                    </p>
                    <p>
                      한의학은 몸 안의 리듬을 읽는 작업입니다.<br />
                      무너진 균형을 다시 세우고, 일상으로 돌아갈 힘을 회복시키는 것.<br />
                      그것이 세봉이 집중하는 방향입니다.
                    </p>
                    <p>
                      과장된 약속 대신, 환자가 스스로 이해할 수 있는 설명을 드립니다.<br />
                      기록으로 남는 치료, 재발을 줄이는 관리 계획까지.<br />
                      단순한 처방이 아니라, &ldquo;회복의 과정&rdquo;을 함께 설계합니다.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div 
                  data-testid="doctor-profile-card"
                  className="flat-card bg-[color:var(--paper-2)] p-7 sm:p-9"
                >
                  <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">Doctor&apos;s Profile</div>
                  
                  <div className="mt-6 space-y-6">
                    {/* 학력 및 경력 */}
                    <div className="space-y-3">
                      <div className="type-serif text-sm font-semibold text-[color:var(--ink)]">學歷 및 經歷</div>
                      <ul className="space-y-2 text-sm leading-relaxed text-[color:var(--muted)]">
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>진주 고등학교 졸업</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>경희대학교 한의학과 졸업</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>경희대학교 대학원 한의학 박사 취득</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>경희대학교 한의학과 외래교수</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>MFT학회 교수</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>형상의학회 교수</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>「학원사」숨어있는 명의50인에 선정</span>
                        </li>
                      </ul>
                    </div>

                    {/* 저서 */}
                    <div className="border-t border-[color:var(--line)] pt-6 space-y-3">
                      <div className="type-serif text-sm font-semibold text-[color:var(--ink)]">著書</div>
                      <ul className="space-y-2 text-sm leading-relaxed text-[color:var(--muted)]">
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>우주와 인체의 생성원리 공저</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>간장.심장 공역</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>비장.폐장.신장 공역</span>
                        </li>
                      </ul>
                    </div>

                    {/* 논문 */}
                    <div className="border-t border-[color:var(--line)] pt-6 space-y-3">
                      <div className="type-serif text-sm font-semibold text-[color:var(--ink)]">論文</div>
                      <ul className="space-y-2 text-sm leading-relaxed text-[color:var(--muted)]">
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>소사,백강잠,잠사 및 원잠아의 항당뇨작욕에 관한 연구 외 15편</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="specialties" className="scroll-mt-24 py-24 md:py-40">
          <div className="frame">
            <Reveal>
              <div className="space-y-3">
                <div className="flat-chip">전문영역</div>
                <h2 className="type-serif text-3xl tracking-tight sm:text-4xl">세 가지 집중 진료</h2>
                <p className="max-w-2xl text-[color:var(--muted)] leading-relaxed">
                  공진단 · 척추치료 · 총명탕. 자주 찾는 핵심 영역을 중심으로 상담과 치료를 설계합니다.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {site.specialties.map((s, idx) => (
                <Reveal key={s.title} delayMs={idx * 90}>
                  <div className="flat-card overflow-hidden p-0">
                    {s.image && (
                      <div className="relative aspect-[5/3] overflow-hidden bg-[color:var(--paper-2)]">
                        <img
                          src={s.image}
                          alt={s.title}
                          className="h-full w-full object-cover opacity-90"
                        />
                      </div>
                    )}
                    <div className="p-7">
                      <div>
                        <div className="type-serif text-2xl tracking-tight">{s.title}</div>
                        <div className="mt-2 text-sm text-[color:var(--muted)]">{s.subtitle}</div>
                      </div>
                      <p className="mt-6 text-sm leading-relaxed text-[color:var(--muted)]">{s.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="links" className="scroll-mt-24 py-24 md:py-40">
          <div className="frame">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <Reveal>
                <div className="space-y-4">
                  <div className="flat-chip">공지 · 블로그</div>
                  <h2 className="type-serif text-3xl tracking-tight sm:text-4xl">세봉을 더 알아보기</h2>
                  <p className="text-[color:var(--muted)] leading-relaxed">
                    처음 방문하시는 분이라면 이곳에서 정보를 확인해 보세요.
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-4">
                {site.externalLinks.map((l, idx) => {
                  const isExternal = l.href.startsWith('http')
                  const LinkComponent = isExternal ? ExternalAnchor : 'a'
                  return (
                    <Reveal key={l.href} delayMs={idx * 80}>
                      <LinkComponent href={l.href} className="flat-card block p-6 transition-colors hover:bg-[color:var(--paper-2)]">
                        <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">LINK</div>
                        <div className="mt-2 flex items-center justify-between gap-4">
                          <div className="text-base font-semibold">{l.label}</div>
                          <div className="text-sm text-[color:var(--muted)]">{isExternal ? '↗' : '→'}</div>
                        </div>
                      </LinkComponent>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="visit" className="scroll-mt-24 py-24 md:py-40">
          <div className="frame">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
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

              <Reveal delayMs={120} className="h-full min-h-[24rem]">
                <KakaoMap
                  appKey={KAKAO_MAPS_APP_KEY}
                  address={site.address}
                  className="h-full"
                />
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
