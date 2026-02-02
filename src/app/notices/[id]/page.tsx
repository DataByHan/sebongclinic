const notices = [
  {
    id: 1,
    title: '추석 연휴 진료 안내',
    date: '2024.09.10',
    content: `안녕하세요. 세봉한의원입니다.

2024년 추석 연휴 기간 중 진료 일정을 안내드립니다.

[휴진 일정]
• 9월 16일 (월) - 휴진
• 9월 17일 (화) - 휴진 (추석 당일)
• 9월 18일 (수) - 휴진

[정상 진료]
• 9월 19일 (목)부터 정상 진료합니다.

긴급 문의는 전화로 연락 주세요. 감사합니다.`,
  },
  {
    id: 2,
    title: '형상의학 건강강좌 개최',
    date: '2024.08.15',
    content: `세봉한의원에서 "형상의학으로 보는 나의 건강" 강좌를 진행합니다.

[강좌 정보]
• 일시: 2024년 9월 첫째 주 토요일 오후 2시
• 장소: 세봉한의원 대기실
• 강사: 김형규 원장 (한의학박사)
• 내용: 형상의학 자가 건강진단법

[참가 신청]
• 전화: 051-623-7227
• 선착순 20명`,
  },
  {
    id: 3,
    title: '가을철 건강관리 수칙',
    date: '2024.08.01',
    content: `가을철 건강관리 수칙

1. 충분한 수분 섭취 (하루 8잔 이상)
2. 규칙적인 운동과 스트레칭으로 혈액 순환 유지
3. 충분한 수면으로 면역력 보호
4. 한방 치료로 면역 강화`,
  },
  {
    id: 4,
    title: '진료 시간 변경 안내',
    date: '2024.07.01',
    content: `진료 시간 변경 안내

[변경 후]
• 평일: 09:00 - 18:00
• 토요일: 09:00 - 13:00
• 점심: 12:00 - 13:00

방문 전 참고 부탁드립니다.`,
  },
];

export function generateStaticParams() {
  return notices.map((notice) => ({
    id: notice.id.toString(),
  }));
}

export default function NoticeDetailPage({ params }: { params: { id: string } }) {
  const notice = notices.find((n) => n.id === parseInt(params.id));

  if (!notice) {
    return (
      <div className="min-h-screen bg-white text-text-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center text-3xl">🔍</div>
            <h1 className="text-2xl font-bold text-primary-800 mb-3">공지사항을 찾을 수 없습니다</h1>
            <a href="/notices" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold">
              ← 목록으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-text-900">
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/notices" className="inline-flex items-center text-primary-100 hover:text-white font-semibold mb-4">
            ← 공지사항 목록
          </a>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{notice.title}</h1>
          <p className="text-primary-100/80">{notice.date}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="card p-8">
          <div className="text-text-700 whitespace-pre-line leading-loose text-lg">{notice.content}</div>
        </article>

        <div className="mt-10 p-8 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-xl text-primary-700">📞</div>
            <div>
              <p className="font-semibold text-primary-800">진료·예약 문의</p>
              <p className="text-text-600 text-sm">전화로 빠르게 상담받으세요.</p>
            </div>
          </div>
          <a href="tel:051-623-7227" className="btn-primary whitespace-nowrap">051-623-7227</a>
        </div>
      </div>
    </div>
  );
}
