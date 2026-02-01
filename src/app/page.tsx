import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/10 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            세봉한의원
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-2">
            형상의학 전문 한의원
          </p>
          <p className="text-lg text-text/80 mb-8">
            김형규 원장 (한의학박사)
          </p>
          <p className="text-base text-text/60 max-w-2xl mx-auto mb-8">
            몸의 형상으로 건강을 읽는 전통 한의학의 현대적 해석
          </p>
          <a
            href="tel:051-623-7227"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            진료 예약하기: 051-623-7227
          </a>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              몸의 형상으로 건강을 읽다
            </h2>
            <p className="text-lg text-text/80 max-w-3xl mx-auto">
              형상의학은 인간의 외적 형상(이목구비, 체형, 피부 등)을 통해 내장의 질병을 진단·치료하는 한의학 이론입니다. 
              개인별 맞춤 진단으로 건강을 지켜드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-accent/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">형상 진단</h3>
              <p className="text-text/70">얼굴과 체형으로 오장육부 상태 파악</p>
            </div>
            <div className="p-6 bg-accent/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">맞춤 치료</h3>
              <p className="text-text/70">개인별 체질에 맞는 한방 치료</p>
            </div>
            <div className="p-6 bg-accent/50 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">예방 의학</h3>
              <p className="text-text/70">질병 발생 전 예방과 건강 유지</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            주요 진료 과목
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">침 치료</h3>
              <p className="text-sm text-text/70">통증 완화와 기혈 순환 개선</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">뜸 치료</h3>
              <p className="text-sm text-text/70">쑥의 열기로 체온 상승과 면역력 강화</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">🥛</span>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">부항 치료</h3>
              <p className="text-sm text-text/70">혈액 순환 개선과 독소 배출</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">한약 처방</h3>
              <p className="text-sm text-text/70">개인별 맞춤 한약 처방</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/treatment"
              className="inline-block bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              진료 안내 자세히 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary mb-4">진료 시간</h3>
              <ul className="space-y-2 text-text/80">
                <li className="flex justify-between">
                  <span>평일</span>
                  <span>09:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>토요일</span>
                  <span>09:00 - 13:00</span>
                </li>
                <li className="flex justify-between text-text/50">
                  <span>일요일/공휴일</span>
                  <span>휴진</span>
                </li>
              </ul>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-primary mb-4">오시는 길</h3>
              <p className="text-text/80 mb-2">
                부산광역시 수영구 수영로 394, 4층 (남천동)
              </p>
              <p className="text-text/60 text-sm mb-4">
                지하철 2호선 남천역 도보 5분
              </p>
              <Link
                href="/location"
                className="text-primary hover:underline"
              >
                자세히 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">전화 예약</h2>
          <p className="text-lg mb-6">051-623-7227</p>
          <a
            href="tel:051-623-7227"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
          >
            전화 걸기
          </a>
        </div>
      </section>
    </div>
  );
}
