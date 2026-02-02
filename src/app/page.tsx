import Link from 'next/link'

const heroHighlights = [
  '형상의학 전문 클리닉',
  '한의학박사 김형규 원장 진료',
  '침 · 뜸 · 부항 · 추나 · 한약 통합 케어',
]

const serviceCards = [
  { title: '침 치료', desc: '신경·근육 통증 완화, 기혈 순환 개선' },
  { title: '뜸 치료', desc: '체온 상승, 면역 강화, 냉증 개선' },
  { title: '부항 치료', desc: '혈액 순환 촉진, 노폐물 배출' },
  { title: '추나 요법', desc: '척추·관절 정렬, 자세 교정' },
  { title: '한약 처방', desc: '체질 맞춤 한약으로 근본 개선' },
  { title: '예방 케어', desc: '형상의학 기반 조기 예측 및 예방' },
]

const approachSteps = [
  { title: '형상의학 진단', detail: '얼굴·체형·피부 신호를 정밀 분석해 장기의 균형과 징후를 읽습니다.' },
  { title: '통합 처방', detail: '침·뜸·부항·추나·한약을 개인별로 조합해 회복 경로를 설계합니다.' },
  { title: '예방 관리', detail: '생활 코칭과 예방 중심 관리로 재발을 줄이고 체질을 관리합니다.' },
]

const doctor = {
  name: '김형규',
  role: '원장 / 한의학박사',
  bio: '대한전통한의학회 형상학회 정회원. 형상의학 기반 맞춤 진단·처방으로 체계적 케어를 제공합니다.',
}

const links = [
  { label: '부산일보 기사', href: 'https://www.busan.com/view/busan/view.php?code=20050308000083' },
  { label: '저서/저자 소개', href: 'https://www.aladin.co.kr/author/wauthor_overview.aspx?authorsearch=@106533&srsltid=afmboopoqe6ghm1g3qt4xdp0qzl38s60mzi3wmkqi3r1mrvjv9vrmimb' },
  { label: '네이버 블로그 후기', href: 'https://blog.naver.com/zxchhi/223858411549' },
]

const notices = [
  { id: 1, title: '추석 연휴 진료 안내', date: '2024.09.10', snippet: '9/16~18 휴진, 19일부터 정상 진료' },
  { id: 2, title: '형상의학 건강강좌', date: '2024.08.15', snippet: '자가 진단법 무료 강좌 진행' },
  { id: 3, title: '가을철 건강수칙', date: '2024.08.01', snippet: '수분 섭취와 스트레칭으로 기혈 순환 유지' },
]

export default function HomePage() {
  return (
    <div className="bg-white text-text-900">
      <main>
        {/* Hero */}
        <section
          id="hero"
          className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50/60 to-white text-primary-900 py-18 lg:py-24"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-28 -left-24 w-80 h-80 bg-primary-100/60 blur-3xl" />
            <div className="absolute top-12 right-0 w-72 h-72 bg-secondary-50/50 blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold">
                형상의학 전문 한의원 · 부산 수영구
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-primary-900">
                세봉한의원
                <span className="block text-text-600 text-lg mt-3 font-normal">
                  몸의 형상에서 건강을 읽고, 맞춤 치료로 회복을 설계합니다.
                </span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/#services" className="btn-primary text-center">
                  진료 과목 보기
                </Link>
                <a href="tel:051-623-7227" className="btn-secondary text-center border border-primary-200 text-primary-800 bg-white">
                  전화 예약
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-primary-800">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-accent-200 bg-white px-4 py-3 shadow-soft"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-strong p-8 border border-accent-200 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-800 flex items-center justify-center text-3xl shadow-soft">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary-900">{doctor.name}</h3>
                  <p className="text-text-600">{doctor.role}</p>
                </div>
              </div>
              <p className="text-text-600 leading-relaxed">{doctor.bio}</p>
              <div className="grid grid-cols-2 gap-3 text-sm text-primary-800">
                <div className="rounded-xl bg-primary-50 p-3">형상의학 진단</div>
                <div className="rounded-xl bg-primary-50 p-3">체질 맞춤 처방</div>
                <div className="rounded-xl bg-primary-50 p-3">예방 중심 케어</div>
                <div className="rounded-xl bg-primary-50 p-3">생활 코칭</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-18 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <div>
                <p className="text-sm font-semibold text-primary-600">SERVICES</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">주요 진료 과목</h2>
                <p className="text-text-600 mt-3 max-w-2xl">통증 완화, 체질 개선, 예방을 잇는 통합 한방 치료.</p>
              </div>
              <Link href="/treatment" className="text-primary-600 font-semibold hover:text-primary-700">
                전체 보기 →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {serviceCards.map((item) => (
                <article key={item.title} className="card p-7 bg-white hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-primary-800 mb-2">{item.title}</h3>
                  <p className="text-text-600 leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Approach */}
        <section id="approach" className="py-18 lg:py-20 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <p className="text-sm font-semibold text-primary-600">APPROACH</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">세봉한의원 치료 프로세스</h2>
              <p className="text-text-600 max-w-3xl mx-auto">정밀 진단 → 맞춤 치료 → 회복 관리로 이어지는 완성형 루틴.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {approachSteps.map((step, idx) => (
                <article key={step.title} className="card p-7 bg-white shadow-card">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center font-bold mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-primary-800 mb-2">{step.title}</h3>
                  <p className="text-text-600 leading-relaxed">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Links / Media */}
        <section className="py-18 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-sm font-semibold text-primary-600">MEDIA & LINKS</p>
              <h2 className="text-3xl font-bold text-primary-900">세봉한의원 관련 소식</h2>
              <p className="text-text-600">언론·저서·블로그 후기를 통해 세봉한의원을 만나보세요.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="card p-5 bg-white hover:-translate-y-1 transition-transform duration-200 text-primary-800"
                >
                  <div className="text-sm text-text-500 mb-2">바로가기</div>
                  <div className="font-semibold">{link.label}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors */}
        <section id="doctors" className="py-18 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary-600">DOCTOR</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">의료진 소개</h2>
              <p className="text-text-600 leading-relaxed">형상의학 전문 한의학박사가 직접 진료하여 증상별·체질별 치료를 설계합니다.</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-primary-50 p-3">형상의학 진단</div>
                <div className="rounded-xl bg-primary-50 p-3">근골격 통증 관리</div>
                <div className="rounded-xl bg-primary-50 p-3">생활 코칭</div>
                <div className="rounded-xl bg-primary-50 p-3">예방 중심 케어</div>
              </div>
            </div>
            <div className="card p-8 bg-white border border-accent-200 shadow-strong">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl text-primary-800">👨‍⚕️</div>
                <div>
                  <h3 className="text-2xl font-bold text-primary-900">{doctor.name}</h3>
                  <p className="text-text-600">{doctor.role}</p>
                </div>
              </div>
              <p className="text-text-600 leading-relaxed mb-6">{doctor.bio}</p>
              <div className="grid grid-cols-2 gap-3 text-sm text-primary-800">
                <div className="rounded-xl bg-primary-50 p-3">형상학회 정회원</div>
                <div className="rounded-xl bg-primary-50 p-3">체질 맞춤 처방</div>
                <div className="rounded-xl bg-primary-50 p-3">침·뜸·부항 통합</div>
                <div className="rounded-xl bg-primary-50 p-3">사전 예방 중심</div>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section id="location" className="py-18 lg:py-20 bg-gradient-to-r from-primary-50 via-white to-secondary-50 text-primary-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary-600">LOCATION</p>
              <h2 className="text-3xl lg:text-4xl font-bold">오시는 길</h2>
              <p className="text-text-600 leading-relaxed">
                부산광역시 수영구 수영로 394, 4층 (남천동)
                <br />지하철 2호선 남천역 3번 출구 도보 5분
                <br />건물 내 주차 가능
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://naver.me/FvQYmg3r"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full justify-center bg-white text-primary-800 hover:bg-primary-50"
                >
                  네이버 지도
                </a>
                <a
                  href="tel:051-623-7227"
                  className="btn-secondary w-full justify-center border border-primary-200 text-primary-800 hover:bg-primary-50"
                >
                  전화 문의
                </a>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-strong border border-accent-200 w-full">
              <div className="w-full h-80 rounded-2xl bg-accent-50 flex items-center justify-center text-text-500 text-lg">
                지도 영역
              </div>
              <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm text-primary-800">
                <div className="rounded-xl bg-primary-50 p-3">남천역 3번 출구</div>
                <div className="rounded-xl bg-primary-50 p-3">버스 남천동 정류장</div>
                <div className="rounded-xl bg-primary-50 p-3">주차 지원</div>
              </div>
            </div>
          </div>
        </section>

        {/* Notices */}
        <section id="notices" className="py-18 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary-600">NOTICE</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">공지사항</h2>
                <p className="text-text-600 mt-2">진료 일정과 이벤트 소식을 확인하세요.</p>
              </div>
              <Link href="/notices" className="text-primary-600 font-semibold hover:text-primary-700">
                전체 보기 →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {notices.map((notice) => (
                <article key={notice.id} className="card p-6 bg-white border border-accent-200">
                  <div className="flex items-center justify-between text-sm text-text-500 mb-2">
                    <span>공지</span>
                    <span>{notice.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary-800 mb-2">{notice.title}</h3>
                  <p className="text-text-600 mb-4 leading-relaxed">{notice.snippet}</p>
                  <Link href={`/notices/${notice.id}`} className="text-primary-600 font-semibold hover:text-primary-700">
                    자세히 보기 →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
