import Link from 'next/link';

export default function LocationPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">오시는 길</h1>
          <p className="text-lg text-text/70">세봉한의원 찾아오시는 길</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-accent/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">주소 및 연락처</h2>
            
            <div className="space-y-4 text-text/80">
              <div className="flex items-start">
                <span className="text-2xl mr-4">📍</span>
                <div>
                  <p className="font-medium text-primary">주소</p>
                  <p>부산광역시 수영구 수영로 394, 4층</p>
                  <p className="text-text/60">(남천동)</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-2xl mr-4">📞</span>
                <div>
                  <p className="font-medium text-primary">전화번호</p>
                  <a 
                    href="tel:051-623-7227" 
                    className="text-lg hover:text-primary transition-colors"
                  >
                    051-623-7227
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-2xl mr-4">🚇</span>
                <div>
                  <p className="font-medium text-primary">지하철</p>
                  <p>2호선 남천역 (도보 5분)</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://naver.me/FvQYmg3r"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span className="mr-2">🗺️</span>
                네이버 지도에서 보기
              </a>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center text-text/50">
              <p className="text-6xl mb-4">🗺️</p>
              <p>네이버 지도 영역</p>
              <p className="text-sm mt-2">
                <a 
                  href="https://naver.me/FvQYmg3r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  지도 보기
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-4">대중교통 이용 안내</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-primary mb-2">🚇 지하철</h4>
                <p className="text-text/80 text-sm">
                  2호선 남천역 3번 출구에서 도보 약 5분<br />
                  수영로를 따라 수영역 방향으로 직진
                </p>
              </div>

              <div>
                <h4 className="font-medium text-primary mb-2">🚌 버스</h4>
                <p className="text-text/80 text-sm">
                  남천동 정류장 하차 후 도보 3분<br />
                  수영로 394번지 4층
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-primary mb-4">주차 안내</h3>
            
            <div className="space-y-4">
              <p className="text-text/80">
                건물 내 주차장 이용 가능합니다.
              </p>
              <ul className="text-sm text-text/70 space-y-2">
                <li>• 진료 시간 내 주차 가능</li>
                <li>• 주차 공간이 협소하니 대중교통 이용을 권장합니다</li>
                <li>• 주차 문의: 051-623-7227</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-8">
          <h3 className="text-xl font-bold text-primary mb-4">진료 시간</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">평일</td>
                    <td className="py-2">09:00 - 18:00</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">토요일</td>
                    <td className="py-2">09:00 - 13:00</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-text/50">일요일/공휴일</td>
                    <td className="py-2 text-text/50">휴진</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center">
              <a
                href="tel:051-623-7227"
                className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span className="mr-2">📞</span>
                전화 예약하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
