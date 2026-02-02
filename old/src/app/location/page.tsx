import Link from 'next/link';

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            오시는 길
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            세봉한의원의 위치를 확인하고 편리하게 방문하세요.<br />
            다양한 교통수단으로 쉽게 찾아오실 수 있습니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl text-white shadow-medium">
                📍
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary-800">주소 및 연락처</h2>
                <p className="text-text-500">Location & Contact</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-accent-50">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl shrink-0">
                  🏥
                </div>
                <div>
                  <p className="font-semibold text-primary-800 mb-1">주소</p>
                  <p className="text-text-700 leading-relaxed">
                    부산광역시 수영구 수영로 394, 4층<br />
                    <span className="text-text-500">(남천동)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-accent-50">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center text-2xl shrink-0">
                  📞
                </div>
                <div>
                  <p className="font-semibold text-primary-800 mb-1">전화번호</p>
                  <a 
                    href="tel:051-623-7227" 
                    className="text-lg text-primary-600 hover:text-primary-700 font-bold transition-colors"
                  >
                    051-623-7227
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-accent-50">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl shrink-0">
                  🚇
                </div>
                <div>
                  <p className="font-semibold text-primary-800 mb-1">지하철</p>
                  <p className="text-text-700">2호선 남천역 (도보 5분)</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="https://naver.me/FvQYmg3r"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                네이버 지도
              </a>
              <a
                href="tel:051-623-7227"
                className="btn-secondary flex-1 justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                전화하기
              </a>
            </div>
          </div>

          <div className="card overflow-hidden bg-gradient-to-br from-accent-100 to-accent-200">
            <div className="h-80 lg:h-full flex items-center justify-center bg-white">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center text-5xl shadow-glow">
                  🗺️
                </div>
                <h3 className="text-xl font-bold text-primary-800 mb-3">지도 영역</h3>
                <p className="text-text-600 mb-6">
                  네이버 지도 서비스와 연동됩니다.<br />
                  정확한 위치를 확인하세요.
                </p>
                <a
                  href="https://naver.me/FvQYmg3r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all duration-300 shadow-medium hover:shadow-strong"
                >
                  지도 크게 보기
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-medium">
                🚇
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-800">대중교통 이용 안내</h3>
                <p className="text-text-500">Public Transportation</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🚇</span> 지하철
                </h4>
                <ul className="space-y-2 text-text-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>2호선 <strong>남천역</strong> 3번 출구</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>도보 약 5분 거리</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>수영로를 따라 수영역 방향으로 직진</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-green-50 border border-green-100">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🚌</span> 버스
                </h4>
                <ul className="space-y-2 text-text-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>남천동 정류장</strong> 하차</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>도보 3분 거리</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>수영로 394번지 4층</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl text-white shadow-medium">
                🅿️
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-800">주차 안내</h3>
                <p className="text-text-500">Parking Information</p>
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-amber-50 mb-6">
              <p className="text-text-700 leading-relaxed mb-4">
                건물 내 주차장 이용 가능합니다. 진료 시간 내 주차가 가능하오니 편하게 이용하시기 바랍니다.
              </p>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-4 rounded-xl bg-accent-50">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">✓</span>
                <span className="text-text-700">진료 시간 내 무료 주차</span>
              </li>
              <li className="flex items-center gap-3 p-4 rounded-xl bg-accent-50">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">!</span>
                <span className="text-text-700">주차 공간이 협소합니다</span>
              </li>
              <li className="flex items-center gap-3 p-4 rounded-xl bg-accent-50">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">📞</span>
                <span className="text-text-700">주차 문의: 051-623-7227</span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-primary-50 border border-primary-100">
              <p className="text-sm text-primary-700 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                대중교통 이용을 권장합니다
              </p>
            </div>
          </div>
        </div>

        <div className="card p-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                🕐
              </div>
              <div>
                <h3 className="text-2xl font-bold">진료 시간 안내</h3>
                <p className="text-primary-100">Reservation Hours</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <table className="text-left">
                <tbody>
                  <tr className="border-b border-white/20">
                    <td className="py-2 pr-6 text-primary-100">평일</td>
                    <td className="py-2 font-semibold">09:00 - 18:00</td>
                  </tr>
                  <tr className="border-b border-white/20">
                    <td className="py-2 pr-6 text-primary-100">토요일</td>
                    <td className="py-2 font-semibold">09:00 - 13:00</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6 text-primary-300">일요일</td>
                    <td className="py-2 text-primary-300">휴진</td>
                  </tr>
                </tbody>
              </table>
              <a
                href="tel:051-623-7227"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-white text-primary-700 font-bold text-lg shadow-strong hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>전화 예약</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
