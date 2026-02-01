export default function TreatmentPage() {
  const treatments = [
    {
      icon: '📍',
      title: '침 치료',
      description: '전통적인 한방 침술을 통해 통증을 완화하고 기혈의 순환을 개선합니다. 어깨 통증, 허리 통증, 관절 통증 등 다양한 증상에 효과적입니다.',
    },
    {
      icon: '🔥',
      title: '뜸 치료',
      description: '쑥의 열기를 이용한 치료법으로, 체온을 상승시키고 면역력을 강화합니다. 냉증 개선과 소화기 기능 향상에 도움을 줍니다.',
    },
    {
      icon: '🥛',
      title: '부항 치료',
      description: '유리컵으로 피부에 부착하여 혈액 순환을 개선하고 독소를 배출합니다. 근육 통증과 피로 회복에 효과적입니다.',
    },
    {
      icon: '🤲',
      title: '추나 요법',
      description: '한의사의 수기로 척추와 관절을 교정하는 치료법입니다. 거북목, 일자목, 퇴행성 관절염 등에 적용됩니다.',
    },
    {
      icon: '🌿',
      title: '한약 처방',
      description: '개인의 체질과 증상에 맞춘 한약 처방으로 근본적인 체질 개선과 질병 치료를 목표로 합니다.',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">진료 안내</h1>
          <p className="text-lg text-text/70">세봉한의원의 다양한 한방 진료</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {treatments.map((treatment, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg mb-4 flex items-center justify-center text-3xl">
                {treatment.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                {treatment.title}
              </h3>
              <p className="text-text/70 text-sm leading-relaxed">
                {treatment.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-accent/30 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">진료 시간</h2>
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr className="py-3">
                  <td className="py-3 font-medium text-text">평일</td>
                  <td className="py-3 text-text/80">09:00 - 18:00</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-text">토요일</td>
                  <td className="py-3 text-text/80">09:00 - 13:00</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-text/50">일요일/공휴일</td>
                  <td className="py-3 text-text/50">휴진</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-text/60 mt-4">
              점심시간: 12:00 - 13:00
            </p>
          </div>

          <div className="bg-accent/30 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">진료 비용 안내</h2>
            <div className="space-y-4 text-text/80">
              <p>
                <span className="font-medium">초진 진찰:</span> 건강보험 적용 시 본인부담금 발생
              </p>
              <p>
                <span className="font-medium">재진 진찰:</span> 건강보험 적용 시 본인부담금 발생
              </p>
              <p>
                <span className="font-medium">침/뜸/부항:</span> 건강보험 적용 가능
              </p>
              <p>
                <span className="font-medium">한약 처방:</span> 비급여 (처방 내용에 따라 상이)
              </p>
            </div>
            <p className="text-sm text-text/60 mt-4">
              실제 비용은 진료 내용에 따라 달라질 수 있습니다. 자세한 내용은 전화로 문의해 주세요.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-primary/5 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-primary mb-4">건강보험 안내</h2>
          <ul className="space-y-2 text-text/80">
            <li>건강보험 적용 가능한 진료 항목이 있습니다.</li>
            <li>일부 진료는 비급여 항목으로 적용됩니다.</li>
            <li>건강보험증을 지참해 주세요.</li>
            <li>자세한 사항은 방문 시 상담해 드립니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
