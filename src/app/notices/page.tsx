import Link from 'next/link';

const notices = [
  {
    id: 1,
    title: '2024년 추석 연휴 진료 안내',
    date: '2024-09-10',
    preview: '추석 연휴 기간 중 진료 일정 변경 안내드립니다.',
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
    preview: '형상의학을 통한 자가 건강진단법 강좌를 개최합니다.',
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
    preview: '계절 변화에 따른 건강관리 방법을 안내드립니다.',
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
    preview: '7월부터 진료 시간이 변경됩니다.',
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

export default function NoticesPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">공지사항</h1>
          <p className="text-lg text-text/70">세봉한의원의 소식과 안내</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {notices.map((notice) => (
              <Link
                key={notice.id}
                href={`/notices/${notice.id}`}
                className="block p-6 hover:bg-accent/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {notice.title}
                    </h3>
                    <p className="text-text/70 text-sm">{notice.preview}</p>
                  </div>
                  <div className="mt-2 md:mt-0 md:ml-6">
                    <span className="text-sm text-text/50">{notice.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-primary text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 bg-gray-100 text-text/70 rounded-lg hover:bg-gray-200 transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-gray-100 text-text/70 rounded-lg hover:bg-gray-200 transition-colors">
              다음 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
