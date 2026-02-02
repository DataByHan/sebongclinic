const notices = [
  {
    id: 1,
    title: '2024년 추석 연휴 진료 안내',
    date: '2024-09-10',
    content: `안녕하세요. 세봉한의원입니다.

2024년 추석 연휴 기간 중 진료 일정을 안내드립니다.

[휴진 일정]
• 9월 16일 (월) - 휴진
• 9월 17일 (화) - 휴진 (추석 당일)
• 9월 18일 (수) - 휴진

[정상 진료]
• 9월 19일 (목)부터 정상 진료합니다.

긴급한 문의사항은 전화로 연락 주시기 바랍니다.
감사합니다.`,
  },
  {
    id: 2,
    title: '형상의학 건강강좌 개최',
    date: '2024-08-15',
    content: `세봉한의원에서 "형상의학으로 보는 나의 건강" 주제로 건강강좌를 개최합니다.

[강좌 정보]
• 일시: 2024년 9월 첫째 주 토요일 오후 2시
• 장소: 세봉한의원 대기실
• 강사: 김형규 원장 (한의학박사)
• 내용: 형상의학을 통한 자가 건강진단법

[참가 신청]
• 전화: 051-623-7227
• 선착순 20명

많은 관심과 참여 부탁드립니다.`,
  },
  {
    id: 3,
    title: '가을철 건강관리 수칙',
    date: '2024-08-01',
    content: `가을철 건강관리 수칙

1. 충분한 수분 섭취
가을은 건조한 계절입니다. 하루 8잔 이상의 물을 마시세요.

2. 규칙적인 운동
가벼운 산책이나 스트레칭으로 혈액 순환을 도우세요.

3. 충분한 수면
계절 변화로 인한 피로를 극복하기 위해 충분한 수면이 필요합니다.

4. 한방 치료
가을철 면역력 강화를 위한 한방 치료를 받아보세요.

자세한 상담은 세봉한의원으로 문의해 주세요.`,
  },
  {
    id: 4,
    title: '진료 시간 변경 안내',
    date: '2024-07-01',
    content: `진료 시간 변경 안내

2024년 7월 1일부터 진료 시간이 다음과 같이 변경됩니다.

[변경 전]
• 평일: 09:00 - 19:00
• 토요일: 09:00 - 14:00

[변경 후]
• 평일: 09:00 - 18:00
• 토요일: 09:00 - 13:00

점심시간은 12:00 - 13:00로 동일합니다.

변경된 시간에 참고하시어 방문해 주시기 바랍니다.
감사합니다.`,
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
      <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-800 mb-4">공지사항을 찾을 수 없습니다</h1>
            <a href="/notices" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              공지사항 목록으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <a
            href="/notices"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            공지사항 목록
          </a>
        </div>

        <article className="card overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
                공지사항
              </span>
              <span className="text-primary-100">{notice.date}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {notice.title}
            </h1>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <div className="text-text-700 whitespace-pre-line leading-loose text-lg">
                {notice.content}
              </div>
            </div>
          </div>

          <div className="bg-accent-50 px-8 py-6 border-t border-accent-100">
            <a
              href="/notices"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              목록으로 돌아가기
            </a>
          </div>
        </article>

        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl shadow-medium">
                📞
              </div>
              <div>
                <p className="font-semibold text-primary-800">전화로 문의하기</p>
                <p className="text-text-600">진료 예약 및 궁금한 사항</p>
              </div>
            </div>
            <a
              href="tel:051-623-7227"
              className="btn-primary whitespace-nowrap"
            >
              051-623-7227
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
