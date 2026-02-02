import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const features = [
  {
    title: '형상의학 진단',
    description: '얼굴과 체형의 형상을 읽어 몸속 장기의 균형을 파악하고, 실질적 치료 포인트를 제시합니다.',
  },
  {
    title: '맞춤 치료',
    description: '개인 체질과 증상에 맞춰 침/뜸/부항/한약을 연결한 토털 티어진요법을 설계합니다.',
  },
  {
    title: '예방 의학',
    description: '형상의학 기반 신호를 분석해 위험 징후를 조기 발견하고, 질병을 막습니다.',
  },
]

const treatments = [
  { icon: '📍', title: '침 치료', detail: '통증 완화와 기혈 흐름 회복', duration: '30분~45분' },
  { icon: '🔥', title: '뜸 치료', detail: '체온 상승 및 면역 강화', duration: '20분' },
  { icon: '🥛', title: '부항 치료', detail: '혈액 순환과 독소 배출 촉진', duration: '15분~25분' },
  { icon: '🤝', title: '추나 요법', detail: '척추와 관절 정렬, 자세 교정', duration: '20분~40분' },
  { icon: '🌿', title: '한약 처방', detail: '체질 맞춤 한약으로 근본 체질 개선', duration: '처방마다 상이' },
]

const notices = [
  {
    id: 1,
    title: '2024년 추석 연휴 진료 안내',
    date: '2024.09.10',
    snippet: '추석 연휴 기간 16~18일 휴진, 19일부터 정상 진료합니다.',
  },
  {
    id: 2,
    title: '형상의학 건강강좌 개최',
    date: '2024.08.15',
    snippet: '세봉한의원에서 형상의학 자가 진단 강좌를 무료로 진행합니다.',
  },
  {
    id: 3,
    title: '가을철 건강관리 수칙',
    date: '2024.08.01',
    snippet: '건조한 가을, 충분한 수분과 스트레칭을 통해 기혈 순환을 유지하세요.',
  },
]

const doctors = [
  {
    name: '김형규',
    title: '원장 / 한의학박사',
    bio: '대한전통한의학회 형상학회 소속, 형상의학 구체적 진단법을 임상에 적용합니다.',
  },
]

export default function HomePage() {
  return (
    <div className="bg-white text-text-900 min-h-screen">
      <Header />

      <main>
        <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-28">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-0 -right-16 w-72 h-72 rounded-full bg-primary-200 blur-3xl" />
            <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-secondary-200 blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-600 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  부산 수영구 형상의학 전문
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold text-primary-900 leading-tight">
                  세봉한의원
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                    몸의 형상에서 건강을 읽다
                  </span>
                </h1>
                <p className="text-lg text-text-600 max-w-2xl leading-relaxed">
                  김형규 원장 (한의학박사)이 전통 지식을 현대적으로 재정의하여 환자 한 분에게 맞춘 진료를 제공합니다.
                  최신 형상의학 진단과 정밀한 한방 치료 계획으로 회복을 이끌어냅니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/#treatment" className="btn-primary text-center">
                    치료 안내 보기
                  </Link>
                  <a href="tel:051-623-7227" className="btn-secondary text-center">
                    전화 예약하기
                  </a>
                </div>
                <div className="flex flex-wrap gap-6 text-sm text-text-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary-600" />
                    한의학박사 직접 진료
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary-500" />
                    형상의학 기반 진단 기법
                  </div>
                </div>
              </div>
              <div className="rounded-[2.5rem] bg-white shadow-floating p-8 relative">
                <div className="bg-primary-900 text-white text-center rounded-3xl p-8">
                  <p className="uppercase tracking-[0.2em] text-xs font-semibold text-primary-100/80">대표 원장</p>
                  <p className="text-5xl my-3">👨‍⚕️</p>
                  <h2 className="text-2xl font-bold">김형규</h2>
                  <p className="text-sm text-primary-100">형상의학 전문 한의사</p>
                </div>
                <div className="mt-8 space-y-4 text-sm text-text-600">
                  <p>대한전통한의학회 형상학회 정회원</p>
                  <p>내상병에 대한 형상의학적 치료 임상 사례 다수</p>
                  <p>부산 지역 맞춤형 진료 시스템 운영</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="philosophy" className="py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm uppercase tracking-[0.5em] text-primary-500 font-semibold mb-4">세봉한의원 철학</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">형상의학 + 현대적 감각</h2>
            <p className="text-lg text-text-600 max-w-3xl mx-auto leading-relaxed">
              몸의 외형은 곧 내부 장기의 메시지입니다. 세봉한의원은 얼굴, 체형, 피부의 미세한 흐름을 분석하여
              통합적인 진단을 내리고, 통증을 넘어 체질 개선까지 이어지는 맞춤형 코스를 설계합니다.
            </p>
          </div>
        </section>

        <section id="treatment" className="py-20 lg:py-28 bg-gradient-to-b from-accent-50 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">주요 진료 과목</h2>
                <p className="text-text-600 max-w-2xl leading-relaxed">
                  세봉한의원은 침, 뜸, 부항, 추나, 한약을 통합하여 체형의 변화와 내부 기능을 동시에 개선합니다.
                </p>
              </div>
              <Link href="/treatment" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                모든 진료 보기 →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {treatments.map((item) => (
                <article key={item.title} className="card group hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-text-600 mb-4">{item.detail}</p>
                  <p className="text-sm text-accent-900 font-semibold">{item.duration}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="doctors" className="py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <article key={doctor.name} className="card p-8 border-0 bg-gradient-to-br from-primary-50 to-secondary-50">
                  <p className="text-sm text-primary-500 mb-2">전문 의료진</p>
                  <h3 className="text-2xl font-bold text-primary-800 mb-1">{doctor.name}</h3>
                  <p className="text-sm text-text-500 mb-4">{doctor.title}</p>
                  <p className="text-text-600 leading-relaxed">{doctor.bio}</p>
                </article>
              ))}
              <article className="card p-8 relative">
                <div className="mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">진료 철학</span>
                </div>
                <h4 className="text-lg font-bold text-primary-900 mb-3">형상의학적 접근</h4>
                <p className="text-text-600 leading-relaxed">
                  세봉한의원은 형상의학을 통해 오장의 상태를 면밀히 분석하고, 몸의 외형에 드러난 징후를 치료로 연결합니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="location" className="py-20 lg:py-28 bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.5em] text-primary-200">세봉한의원</p>
                <h2 className="text-3xl lg:text-4xl font-bold">오시는 길</h2>
                <p className="text-text-200 leading-relaxed">
                  부산광역시 수영구 수영로 394, 4층 (남천동). 지하철 2호선 남천역 3번 출구에서 도보 5분, 건물 내 주차장 운영.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://naver.me/FvQYmg3r" target="_blank" rel="noreferrer" className="btn-primary w-full justify-center">
                    지도 보기
                  </a>
                  <a href="tel:051-623-7227" className="btn-secondary w-full justify-center">
                    전화 문의
                  </a>
                </div>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-xl">
                <div className="w-full h-80 bg-white/20 rounded-3xl flex items-center justify-center text-2xl">
                  지도 영역 (추가 예정)
                </div>
                <div className="mt-6 space-y-3 text-sm">
                  <p>대중교통: 남천역 3번 출구 → 도보 5분</p>
                  <p>버스: 남천동 정류장 하차 후 3분 거리</p>
                  <p>주차: 건물 내 주차장, 진료 중 무료</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="notices" className="py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-start justify-between mb-10 gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.5em] text-primary-500 font-semibold">공지사항</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">
                  세봉한의원의 안내 사항
                </h2>
              </div>
              <Link href="/notices" className="text-primary-600 font-semibold hover:text-primary-700">
                공지사항 전체 보기 →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {notices.map((notice) => (
                <article key={notice.id} className="card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary-500">공지</span>
                    <span className="text-sm text-text-500">{notice.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary-800 mb-3">{notice.title}</h3>
                  <p className="text-text-600 mb-4 leading-relaxed">{notice.snippet}</p>
                  <Link href={`/notices/${notice.id}`} className="text-primary-600 font-semibold hover:text-secondary-600">
                    자세히 보기 →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
