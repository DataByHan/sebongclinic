export default function TreatmentPage() {
  const treatments = [
    {
      icon: '📍',
      title: '침 치료',
      description: '전통적인 한방 침술을 통해 통증을 완화하고 기혈의 순환을 개선합니다. 어깨 통증, 허리 통증, 관절 통증 등 다양한 증상에 효과적입니다.',
      features: ['통증 완화', '기혈 순환 개선', '근육 이완'],
    },
    {
      icon: '🔥',
      title: '뜸 치료',
      description: '쑥의 열기를 이용한 치료법으로, 체온을 상승시키고 면역력을 강화합니다. 냉증 개선과 소화기 기능 향상에 도움을 줍니다.',
      features: ['체온 상승', '면역력 강화', '소화기 개선'],
    },
    {
      icon: '🥛',
      title: '부항 치료',
      description: '유리컵으로 피부에 부착하여 혈액 순환을 개선하고 독소를 배출합니다. 근육 통증과 피로 회복에 효과적입니다.',
      features: ['혈액 순환 개선', '독소 배출', '근육 통증 완화'],
    },
    {
      icon: '🤲',
      title: '추나 요법',
      description: '한의사의 수기로 척추와 관절을 교정하는 치료법입니다. 거북목, 일자목, 퇴행성 관절염 등에 적용됩니다.',
      features: ['척추 교정', '관절 가동성 향상', '자세 개선'],
    },
    {
      icon: '🌿',
      title: '한약 처방',
      description: '개인의 체질과 증상에 맞춘 한약 처방으로 근본적인 체질 개선과 질병 치료를 목표로 합니다.',
      features: ['맞춤 처방', '체질 개선', '근본 치료'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            진료 안내
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            세봉한의원의 다양한 한방 진료 서비스를 소개합니다.<br />
            개인별 맞춤 치료로 빠른 회복을 도와드립니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {treatments.map((treatment, index) => (
            <div
              key={treatment.title}
              className="card p-8 group hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {treatment.icon}
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-3 group-hover:text-primary-600 transition-colors">
                {treatment.title}
              </h3>
              <p className="text-text-600 leading-relaxed mb-4">
                {treatment.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {treatment.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl text-white shadow-medium">
                🕐
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary-800">진료 시간</h2>
                <p className="text-text-500">Reservation hours</p>
              </div>
            </div>
            <table className="w-full">
              <tbody className="divide-y divide-accent-100">
                <tr>
                  <td className="py-4 font-medium text-text-700">평일 (월 ~ 금)</td>
                  <td className="py-4 text-right font-semibold text-primary-700">09:00 - 18:00</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-text-700">토요일</td>
                  <td className="py-4 text-right font-semibold text-primary-700">09:00 - 13:00</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-text-500">일요일 / 공휴일</td>
                  <td className="py-4 text-right text-text-400">휴진</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-4 rounded-xl bg-accent-50 text-text-600 text-sm">
              점심시간: 12:00 - 13:00
            </div>
          </div>

          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center text-2xl text-white shadow-medium">
                💰
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary-800">진료 비용 안내</h2>
                <p className="text-text-500">Medical fees</p>
              </div>
            </div>
            <div className="space-y-4 text-text-700">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-50">
                <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-primary-800 mb-1">초진 진찰</p>
                  <p className="text-sm text-text-600">건강보험 적용 시 본인부담금 발생</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-50">
                <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-primary-800 mb-1">재진 진찰</p>
                  <p className="text-sm text-text-600">건강보험 적용 시 본인부담금 발생</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-50">
                <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-primary-800 mb-1">침 / 뜸 / 부항</p>
                  <p className="text-sm text-text-600">건강보험 적용 가능</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-50">
                <span className="w-2 h-2 rounded-full bg-secondary-500 mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-secondary-700 mb-1">한약 처방</p>
                  <p className="text-sm text-text-600">비급여 (처방 내용에 따라 상이)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 card p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl shrink-0">
              ℹ️
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-800 mb-3">건강보험 안내</h3>
              <ul className="space-y-2 text-text-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  건강보험 적용 가능한 진료 항목이 있습니다.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  일부 진료는 비급여 항목으로 적용됩니다.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  건강보험증을 지참해 주세요.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  자세한 사항은 방문 시 상담해 드립니다.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="tel:051-623-7227"
            className="btn-primary text-lg px-10 py-4"
          >
            전화로 예약하기
          </a>
        </div>
      </div>
    </div>
  );
}
