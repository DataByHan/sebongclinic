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
            <img src="/img/Icon_Noround.png" alt="" className="h-6 w-6" />
            <span className="type-serif text-lg tracking-tight">{site.name}</span>
            <span className="text-xs text-[color:var(--muted)]">Korean Medicine Clinic</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[color:var(--muted)]">
            <a href="#doctor" className="hover:text-[color:var(--ink)]">의료진</a>
            <a href="#specialties" className="hover:text-[color:var(--ink)]">전문영역</a>
            <a href="#treatments" className="hover:text-[color:var(--ink)]">대표처방</a>
            <a href="#visit" className="hover:text-[color:var(--ink)]">오시는 길</a>
            <a href="/notices" className="hover:text-[color:var(--ink)]">공지</a>
          </nav>
        </div>
      </header>

      <main id="top" className="mesh">
        <section className="scroll-mt-24 py-24 md:py-40">
          <div className="frame">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <Reveal>
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flat-chip">
                      <span className="h-2 w-2 rounded-full bg-[color:var(--jade)]" />
                      전문 진료 영역 : 근골격계 · 면역 기능 · 여성 질환 · 불임 등
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
                    근골격계·관절 질환, 경두개 질환, 심혈관계 질환 등 다양한 분야에서 40여 년의 임상 경험과 600여 처방 이상의 치료 사례를 바탕으로, MFT 진단 기반의 치료 효과를 지속적으로 축적·검증해 온 진료를 시행하고 있습니다.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <a href="#visit" className="cta">오시는 길</a>
                    <a href="/notices" className="cta-ghost">공지사항</a>
                    <a href={`tel:${site.phone}`} className="cta-ghost">전화 {site.phone}</a>
                  </div>
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div className="flat-card bg-[color:var(--paper-2)] p-7 sm:p-9">
                  <div>
                    <div className="mt-3 type-serif text-2xl">🩺세봉한의원 진료 과정</div>
                  </div>

                  <div className="mt-8 space-y-6">
                    {[
                      { 
                        label: '체질·면역 진단', 
                        desc: 'MFT 진단 시스템을 통해 사상체질 감별 및 정·기·신·혈로 구분되는 면역 기능을 측정합니다.'
                      },
                      { 
                        label: '전신 경락 에너지 분석', 
                        desc: '24전신 경락 에너지 흐름의 상태를 정밀하게 파악합니다.'
                      },
                      { 
                        label: '병변 경락 및 원인 경락 확인', 
                        desc: '경락 흐름의 이상이 감지되면 병변 경락과 이에 영향을 주는 이차성 원인 경락까지 함께 체크합니다.'
                      },
                      { 
                        label: '맞춤 치료 설명 및 시행', 
                        desc: '환자의 증상, 병력, 기존 검사 결과를 종합하여 MFT 치료의 특징과 차별점을 충분히 설명한 후 치료를 시작합니다.'
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                        <div className="space-y-1.5">
                          <div className="type-serif text-base font-semibold text-[color:var(--ink)]">{item.label}</div>
                          <div className="text-[15px] leading-relaxed text-[color:var(--muted)]">{item.desc}</div>
                        </div>
                      </div>
                    ))}
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
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src="/img/원장님.png" 
                      alt="김형규 원장" 
                      className="h-20 w-20 rounded-full border-2 border-[color:var(--line)] object-cover shrink-0"
                    />
                    <h2 className="type-serif text-3xl tracking-tight sm:text-4xl flex flex-wrap items-center gap-3">
                      {site.doctorName} 원장
                      <span 
                        data-testid="doctor-credential-badge"
                        className="inline-flex items-center rounded-full border border-[color:var(--jade)] bg-[color:var(--jade)]/5 px-3 py-1 text-sm font-normal text-[color:var(--jade)]"
                      >
                        한의학박사
                      </span>
                    </h2>
                  </div>
                  
                  <div className="space-y-5 text-[15px] text-[color:var(--muted)] leading-[1.8]">
                    <p>현대의 첨단 과학적 검사와 초정밀 기계로도 규명하기 어려운 질환의 원인에 대해 MFT(Meridian Finger Test) 진단기법을 활용하여 체질 감별, 면역 상태, 경락 에너지 흐름의 상호 소통 관계를 종합적으로 분석합니다.</p>
                    <p>겉으로 드러난 질환뿐 아니라, 보이지 않지만 상호 연관되어 인과적 영향을 미치는 기능적 이상과 난치성 질환에 대하여 보다 정확하고 근본적인 진료를 지향합니다.</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div 
                  data-testid="doctor-profile-card"
                  className="flat-card bg-[color:var(--paper-2)] p-7 sm:p-9"
                >
                  <div className="text-xs tracking-[0.18em] text-[color:var(--muted)]">Doctor&apos;s Profile</div>
                  
                  <div className="mt-6 space-y-4">
                    {/* 학력 및 경력 */}
                    <div className="space-y-2.5">
                      <div className="type-serif text-sm font-semibold text-[color:var(--ink)]">학력(學歷), 경력(經歷)</div>
                      <ul className="space-y-1.5 text-sm leading-relaxed text-[color:var(--muted)]">
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
                    <div className="border-t border-[color:var(--line)] pt-4 space-y-2.5">
                      <div className="type-serif text-sm font-semibold text-[color:var(--ink)]">저서(著書)</div>
                      <ul className="space-y-1.5 text-sm leading-relaxed text-[color:var(--muted)]">
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
                    <div className="border-t border-[color:var(--line)] pt-4 space-y-2.5">
                      <div className="type-serif text-sm font-semibold text-[color:var(--ink)]">논문(論文)</div>
                      <ul className="space-y-1.5 text-sm leading-relaxed text-[color:var(--muted)]">
                        <li className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                          <span>소사,백강잠,잠사 및 원잠아의 항당뇨작용에 관한 연구 외 15편</span>
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
                <h2 className="type-serif text-3xl tracking-tight sm:text-4xl">세봉한의원 임상 대표 사례</h2>
                <p className="mt-2 max-w-2xl text-[color:var(--muted)]">
                  근골격계 · 면역기능 · 여성질환 및 불임등 자주 찾는 핵심 영역을 중심으로 상담과 치료를 설계합니다.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {site.specialties.map((s, idx) => (
                <Reveal key={s.title} delayMs={idx * 90}>
                  <div className="flat-card overflow-hidden p-0 flex flex-col">
                    {s.image && (
                      <div className="relative aspect-[5/3] overflow-hidden bg-[color:var(--paper-2)]">
                        <img
                          src={s.image}
                          alt={s.title}
                          className="h-full w-full object-cover opacity-90"
                        />
                      </div>
                    )}
                    <div className="p-7 flex-1">
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

        <section id="treatments" className="scroll-mt-24 py-24 md:py-40">
          <div className="frame">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <Reveal>
                <div className="space-y-4">
                  <div className="flat-chip">대표 처방</div>
                  <h2 className="type-serif text-3xl tracking-tight sm:text-4xl">세봉한의원 대표 처방 방법</h2>
                  <p className="text-[color:var(--muted)] leading-relaxed">
                    수년간의 임상 경험을 바탕으로 정립한 세봉한의원만의 처방 방법입니다.
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-4">
                {[
                  {
                    title: '세봉단',
                    description: '수년간의 연구와 임상 경험을 바탕으로 5차 제조 공정을 거쳐 완성된 면역 증강 처방을 통해 기력을 회복하고 활력을 증진시킵니다.',
                    bullets: ['전 연령 · 전 체질 적용 가능', '수술 후 회복기, 노년기 면역 저하', '수험생, 스트레스가 많은 직장인'],
                    image: '/img/세봉단.png',
                  },
                  {
                    title: '세봉침 요법',
                    description: '세봉침 요법은 기존의 침 치료 방식을 새롭게 정립하고 MFT 경락 진단을 바탕으로 좌우 경락의 강약과 균형을 정밀하게 분석하는 침법입니다. 진단 결과에 따라 좌우를 동일하게 시술하지 않고',
                    bullets: ['좌측에는 오장육부의 허실 상태를 고려한 체질침을 적용하고', '우측에는 병변이 나타난 경락을 조절하는 경락 조정침을 시술합니다.'],
                    footer: '이처럼 인체의 흐름과 균형에 맞춘 맞춤 시술을 통해 시술 직후부터 몸의 변화와 호전 반응을 체감할 수 있는 것이 세봉침 요법의 가장 큰 특징입니다.',
                    image: '/img/세봉침.png',
                  },
                  {
                    title: '해독활력방',
                    description: '위·소장·대장·담·방광·자궁에 축적된 노폐물과 독소를 배출하여체내 기혈 순환을 정화하는 처방',
                    bullets: ['성인병 예방', '체중 감량 효과 우수'],
                    image: '/img/활력방.png',
                  },
                ].map((item, idx) => (
                  <Reveal key={item.title} delayMs={idx * 80}>
                    <div className="flat-card overflow-hidden p-0 flex flex-col">
                      {item.image && (
                        <div className="relative aspect-[5/3] overflow-hidden bg-[color:var(--paper-2)]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover opacity-90"
                          />
                        </div>
                      )}
                      <div className="p-7 flex-1">
                        <h3 className="type-serif text-xl font-semibold text-[color:var(--ink)]">{item.title}</h3>
                        <p className="mt-3 text-sm text-[color:var(--muted)] leading-relaxed">{item.description}</p>
                        {item.bullets && (
                          <ul className="mt-4 space-y-2">
                            {item.bullets.map((bullet, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-[color:var(--muted)]">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--jade)]" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {item.footer && (
                          <p className="mt-4 text-sm text-[color:var(--muted)] leading-relaxed">{item.footer}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
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
