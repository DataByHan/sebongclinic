import Link from 'next/link';

const notices = [
  { id: 1, title: '추석 연휴 진료 안내', date: '2024.09.10', preview: '9/16~18 휴진, 19일부터 정상 진료' },
  { id: 2, title: '형상의학 건강강좌 개최', date: '2024.08.15', preview: '형상의학 자가 진단법 무료 강좌 진행' },
  { id: 3, title: '가을철 건강관리 수칙', date: '2024.08.01', preview: '수분 섭취와 스트레칭으로 기혈 순환 유지' },
  { id: 4, title: '진료 시간 변경 안내', date: '2024.07.01', preview: '평일 09:00-18:00 / 토요일 09:00-13:00' },
];

export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-white text-text-900">
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-sm font-semibold text-primary-100/90">NOTICE</p>
          <h1 className="text-4xl lg:text-5xl font-bold">공지사항</h1>
          <p className="text-primary-100/80 text-lg">진료 일정, 이벤트, 휴진 안내를 확인하세요.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {notices.map((notice, idx) => (
            <Link
              key={notice.id}
              href={`/notices/${notice.id}`}
              className="card p-6 hover:-translate-y-1 transition-transform duration-300 bg-gradient-to-br from-primary-50 to-secondary-50"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center justify-between text-sm text-text-500 mb-2">
                <span>공지</span>
                <span>{notice.date}</span>
              </div>
              <h2 className="text-lg font-bold text-primary-800 mb-2">{notice.title}</h2>
              <p className="text-text-600 leading-relaxed">{notice.preview}</p>
              <span className="inline-flex items-center text-primary-600 font-semibold mt-4">
                자세히 보기 →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
