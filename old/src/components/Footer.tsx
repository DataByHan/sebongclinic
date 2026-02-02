import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary-800 to-primary-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">세</span>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">세봉한의원</h3>
                <p className="text-primary-200 text-sm font-medium">형상의학 전문</p>
              </div>
            </div>
            <p className="text-primary-100/80 text-sm leading-relaxed mb-6">
              몸의 형상으로 건강을 읽는<br />
              전통 한의학의 현대적 해석
            </p>
            <a
              href="tel:051-623-7227"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-semibold">051-623-7227</span>
            </a>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-secondary-400 to-secondary-600 rounded-full mr-3" />
              진료 안내
            </h4>
            <ul className="space-y-3 text-primary-100/80">
              <li>
                <Link href="/treatment" className="flex items-center space-x-2 hover:text-white transition-all duration-300 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 group-hover:bg-secondary-400 transition-colors duration-300" />
                  <span>진료 과목</span>
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="flex items-center space-x-2 hover:text-white transition-all duration-300 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 group-hover:bg-secondary-400 transition-colors duration-300" />
                  <span>의료진 소개</span>
                </Link>
              </li>
              <li>
                <span className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  <span>진료 비용</span>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-secondary-400 to-secondary-600 rounded-full mr-3" />
              고객 서비스
            </h4>
            <ul className="space-y-3 text-primary-100/80">
              <li>
                <Link href="/location" className="flex items-center space-x-2 hover:text-white transition-all duration-300 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 group-hover:bg-secondary-400 transition-colors duration-300" />
                  <span>오시는 길</span>
                </Link>
              </li>
              <li>
                <Link href="/notices" className="flex items-center space-x-2 hover:text-white transition-all duration-300 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 group-hover:bg-secondary-400 transition-colors duration-300" />
                  <span>공지사항</span>
                </Link>
              </li>
              <li className="pt-2">
                <p className="text-primary-200/60 text-sm">
                  평일: 09:00 - 18:00<br />
                  토요일: 09:00 - 13:00
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-secondary-400 to-secondary-600 rounded-full mr-3" />
              위치 안내
            </h4>
            <div className="bg-white/5 rounded-2xl p-5 backdrop-blur-sm mb-4">
              <p className="text-primary-100/90 text-sm leading-relaxed">
                부산광역시 수영구<br />
                수영로 394, 4층<br />
                <span className="text-primary-300">(남천동)</span>
              </p>
            </div>
            <p className="text-primary-300/70 text-xs">
              지하철 2호선 남천역 도보 5분
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-200/60 text-sm">
              © {new Date().getFullYear()} 세봉한의원. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-primary-200/60">
              <Link href="#" className="hover:text-white transition-colors duration-300">
                이용약관
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
