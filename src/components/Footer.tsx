import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">세봉한의원</h3>
            <p className="text-accent mb-2">형상의학 전문 한의원</p>
            <p className="text-sm text-gray-300">
              몸의 형상으로 건강을 읽는<br />
              전통 한의학의 현대적 해석
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-accent mr-2">주소:</span>
                <span>부산광역시 수영구 수영로 394, 4층<br />(남천동)</span>
              </li>
              <li className="flex items-center">
                <span className="text-accent mr-2">전화:</span>
                <a href="tel:051-623-7227" className="hover:text-accent transition-colors">
                  051-623-7227
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/treatment" className="hover:text-accent transition-colors">
                  진료 안내
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-accent transition-colors">
                  의료진 소개
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-accent transition-colors">
                  오시는 길
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-accent transition-colors">
                  공지사항
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>© 2024 세봉한의원. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
