import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: '👁️',
      title: '형상 진단',
      description: '얼굴과 체형으로 오장육부 상태를 정밀하게 분석하여 질병의 근본 원인을 파악합니다.',
      gradient: 'from-emerald-400 to-teal-500',
    },
    {
      icon: '🌿',
      title: '맞춤 치료',
      description: '개인별 체질과 증상에 맞춘 한방 치료로 자연스러운 회복을 유도합니다.',
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      icon: '🛡️',
      title: '예방 의학',
      description: '질병 발생 전에 미리 예방하여 건강한 삶을 유지할 수 있도록 돕습니다.',
      gradient: 'from-teal-400 to-cyan-500',
    },
  ];

  const treatments = [
    { icon: '📍', title: '침 치료', desc: '통증 완화와 기혈 순환 개선' },
    { icon: '🔥', title: '뜸 치료', desc: '체온 상승과 면역력 강화' },
    { icon: '🥛', title: '부항 치료', desc: '혈액 순환과 독소 배출' },
    { icon: '🌿', title: '한약 처방', desc: '개인별 맞춤 한방 처방' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <span>형상의학 전문 한의원</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-900 leading-tight mb-6">
                <span className="block">세봉한의원</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  몸의 형상으로
                </span>
                <span className="block text-primary-600">건강을 읽다</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-text-600 mb-8 leading-relaxed max-w-xl">
                김형규 원장 (한의학박사)이 직접 진단하고 치료합니다. 
                전통 한의학의 지혜를 현대적으로 해석하여 환자 한 분 한 분에게 
                맞춤 치료를 제공합니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/treatment"
                  className="btn-primary text-center"
                >
                  진료 안내 보기
                </Link>
                <a
                  href="tel:051-623-7227"
                  className="btn-secondary text-center"
                >
                  전화 예약하기
                </a>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-text-500">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>한의학박사</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>형상의학 전문</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up lg:block hidden">
              <div className="relative bg-white rounded-3xl shadow-floating p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
                    <span className="text-5xl">👨‍⚕️</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary-800">김형규</h3>
                  <p className="text-primary-600 font-medium">원장 / 한의학박사</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-xl">🎓</div>
                    <div>
                      <p className="text-sm text-text-500">전문 분야</p>
                      <p className="font-semibold text-primary-800">형상의학 (形象醫學)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary-50">
                    <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center text-xl">📚</div>
                    <div>
                      <p className="text-sm text-text-500">학회 활동</p>
                      <p className="font-semibold text-secondary-800">대한전통한의학회 회원</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              세봉한의원의 진료 철학
            </h2>
            <p className="text-lg text-text-600 max-w-2xl mx-auto">
              전통 한의학의 깊은 지혜를 현대적 방법으로 해석하여<br className="hidden lg:block" />
              환자분들에게 최상의 치료 결과를 드리겠습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card p-8 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-800 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-text-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-b from-accent-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-3">
                주요 진료 과목
              </h2>
              <p className="text-text-600">
                다양한 한방 치료법으로 환자분의 건강을 회복시켜 드립니다.
              </p>
            </div>
            <Link
              href="/treatment"
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
            >
              모든 진료 보기
              <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {treatments.map((treatment) => (
              <div
                key={treatment.title}
                className="card p-6 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-2xl mb-4">
                  {treatment.icon}
                </div>
                <h3 className="text-lg font-bold text-primary-800 mb-2">
                  {treatment.title}
                </h3>
                <p className="text-sm text-text-500">
                  {treatment.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl shadow-medium">
                  🕐
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-800">진료 시간</h3>
                  <p className="text-text-500 text-sm">Reservation hours</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-accent-100">
                  <span className="text-text-600">평일 (월 ~ 금)</span>
                  <span className="font-semibold text-primary-800">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-accent-100">
                  <span className="text-text-600">토요일</span>
                  <span className="font-semibold text-primary-800">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-text-500">일요일 / 공휴일</span>
                  <span className="text-text-400">휴진</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-text-500">
                점심시간: 12:00 - 13:00
              </p>
            </div>

            <div className="card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-2xl shadow-medium">
                  📍
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-800">오시는 길</h3>
                  <p className="text-text-500 text-sm">Location</p>
                </div>
              </div>
              <p className="text-text-700 mb-4 leading-relaxed">
                부산광역시 수영구 수영로 394, 4층<br />
                <span className="text-text-500">(남천동)</span>
              </p>
              <p className="text-text-600 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                지하철 2호선 남천역 도보 5분
              </p>
              <Link
                href="/location"
                className="btn-primary w-full justify-center"
              >
                자세히 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            건강한 내일을 위해 지금 시작하세요
          </h2>
          <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
            세봉한의원에서는 환자 한 분 한 분의 건강을 진심으로 생각합니다.<br />
            전문적인 한방 치료로 여러분의 건강한 삶을 응원합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:051-623-7227"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-700 font-bold text-lg shadow-strong hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              전화 예약하기
            </a>
            <Link
              href="/doctors"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              의료진 소개
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
