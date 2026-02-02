export default function DoctorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            의료진 소개
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            전문적인 의료진이 환자분의 건강을 함께합니다.<br />
            풍부한 임상 경험과 학술적 전문성을 갖추었습니다.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl shadow-lg">
              👨‍⚕️
            </div>
            <h2 className="text-3xl font-bold mb-2">김형규</h2>
            <p className="text-primary-100 text-xl font-medium">원장 / 한의학박사</p>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-primary-50 text-center">
                <div className="text-3xl mb-3">🎓</div>
                <p className="text-sm text-text-500 mb-1">전문 분야</p>
                <p className="font-bold text-primary-800">형상의학 (形象醫學)</p>
              </div>
              <div className="p-6 rounded-xl bg-secondary-50 text-center">
                <div className="text-3xl mb-3">📚</div>
                <p className="text-sm text-text-500 mb-1">학회 활동</p>
                <p className="font-bold text-secondary-800">대한전통한의학회 회원</p>
              </div>
              <div className="p-6 rounded-xl bg-accent-100 text-center">
                <div className="text-3xl mb-3">✍️</div>
                <p className="text-sm text-text-500 mb-1">주요 논문</p>
                <p className="font-bold text-primary-800 text-sm">내상병에 대한 형상의학적 치료</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                한의학박사
              </span>
              <span className="px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                형상의학 전문
              </span>
              <span className="px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                대한전통한의학회
              </span>
              <span className="px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                임상 경력 10년+
              </span>
            </div>
          </div>
        </div>

        <div className="card p-8 mb-16 bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl text-white shadow-medium">
              📖
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-800">형상의학이란?</h2>
              <p className="text-text-500">About Morphological Medicine</p>
            </div>
          </div>
          <p className="text-text-700 leading-relaxed mb-8 text-lg">
            형상의학(形象醫學)은 인간의 외적 형상(이목구비, 체형, 피부 등)을 통해 내장의 질병을 진단·치료하는 한의학 이론입니다. 
            <span className="font-semibold text-primary-700">&ldquo;흠(缺)&rdquo;</span>의 이론체계를 바탕으로, 외관상의 흠이 내장 질병과 연관되어 있음을 파악합니다.
          </p>

          <h3 className="text-xl font-bold text-primary-800 mb-4">형상의학의 핵심 개념</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-xl bg-white shadow-soft">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-primary-800 mb-1">개인별 흠</p>
                  <p className="text-sm text-text-600">모든 사람은 외관상 고유한 흠을 가집니다.</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white shadow-soft">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔍</span>
                <div>
                  <p className="font-semibold text-primary-800 mb-1">진단</p>
                  <p className="text-sm text-text-600">외적 형상으로 내장 상태를 파악합니다.</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white shadow-soft">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-semibold text-primary-800 mb-1">예방</p>
                  <p className="text-sm text-text-600">맞춤 진단으로 예방 치료가 가능합니다.</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-primary-800 mb-4">형상과 질병의 연관성</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white shadow-soft text-center">
              <p className="font-bold text-primary-800 mb-2">폐병</p>
              <p className="text-text-600 text-sm">코가 벌름거리는 증상</p>
            </div>
            <div className="p-5 rounded-xl bg-white shadow-soft text-center">
              <p className="font-bold text-primary-800 mb-2">간병</p>
              <p className="text-text-600 text-sm">눈초리가 푸르게 됨</p>
            </div>
            <div className="p-5 rounded-xl bg-white shadow-soft text-center">
              <p className="font-bold text-primary-800 mb-2">비장병</p>
              <p className="text-text-600 text-sm">입주위가 누레짐</p>
            </div>
            <div className="p-5 rounded-xl bg-white shadow-soft text-center">
              <p className="font-bold text-primary-800 mb-2">신장병</p>
              <p className="text-text-600 text-sm">귀가 검고 마름</p>
            </div>
          </div>
        </div>

        <div className="card p-8 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
              💬
            </div>
            <h2 className="text-2xl font-bold">원장 인사말</h2>
            <p className="text-primary-200 mt-2">Director&apos;s Message</p>
          </div>
          <div className="space-y-6 text-primary-50 leading-loose text-lg">
            <p className="relative pl-6">
              <span className="absolute left-0 top-0 text-4xl text-secondary-400">&ldquo;</span>
              안녕하세요. 세봉한의원 원장 김형규입니다.
            </p>
            <p>
              우리 몸은 복잡하고 정교한 시스템으로 이루어져 있습니다. 
              형상의학은 이 몸의 외적 형상을 통해 내부의 건강 상태를 읽어내는 
              전통 한의학의 지혜입니다.
            </p>
            <p>
              수년간의 임상 경험과 학술 연구를 통해 형상의학의 깊이를 연구해왔습니다. 
              대한전통한의학회(형상학회)에서 <span className="font-semibold text-secondary-300">&ldquo;내상병에 대한 형상의학적 치료&rdquo;</span>를 발표하며 
              형상의학의 실제 임상 적용을 공유했습니다.
            </p>
            <p>
              세봉한의원에서는 환자 한 분 한 분의 형상을 세심히 관찰하여 
              개인별 맞춤 진단과 치료를 제공합니다. 
              질병 치료뿐만 아니라 건강한 삶을 유지할 수 있는 
              예방 의학의 관점에서 진료에 임하고 있습니다.
            </p>
            <p className="text-xl font-semibold text-secondary-300">
              여러분의 건강한 삶을 위해 세봉한의원이 함께하겠습니다.
            </p>
            <p className="relative pl-6">
              <span className="absolute left-0 -top-4 text-4xl text-secondary-400">&ldquo;</span>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="tel:051-623-7227"
            className="btn-primary text-lg px-10 py-4"
          >
            진료 예약하기
          </a>
        </div>
      </div>
    </div>
  );
}
