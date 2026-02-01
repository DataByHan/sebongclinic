export default function DoctorsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">의료진 소개</h1>
          <p className="text-lg text-text/70">세봉한의원의 전문 의료진</p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary/10 p-8 flex justify-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center text-6xl">
                👨‍⚕️
              </div>
            </div>
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">김형규</h2>
                <p className="text-lg text-secondary">원장 / 한의학박사</p>
              </div>

              <div className="space-y-4 text-text/80">
                <div className="flex items-start">
                  <span className="font-medium text-primary w-24 shrink-0">전문 분야</span>
                  <span>형상의학 (形象醫學)</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-primary w-24 shrink-0">학회 활동</span>
                  <span>대한전통한의학회(형상학회) 회원</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-primary w-24 shrink-0">주요 논문</span>
                  <span>&ldquo;내상병에 대한 형상의학적 치료&rdquo;</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-accent/30 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">형상의학이란?</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-text/80 mb-6 leading-relaxed">
              형상의학(形象醫學)은 인간의 외적 형상(이목구비, 체형, 피부 등)을 통해 내장의 질병을 진단·치료하는 한의학 이론입니다. 
              &ldquo;흠(缺)&rdquo;의 이론체계를 바탕으로, 외관상의 흠이 내장 질병과 연관되어 있음을 파악합니다.
            </p>

            <h3 className="text-xl font-semibold text-primary mb-4">형상의학의 핵심 개념</h3>
            <ul className="space-y-3 text-text/80 mb-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>인간은 누구나 외관상 흠을 가지며, 이 흠은 내장 질병과 연관됩니다.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>얼굴, 체형 등 외적 형상으로 오장육부의 상태를 진단합니다.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>개인별 맞춤 진단 및 예방 치료가 가능합니다.</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-primary mb-4">형상과 질병의 연관성</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-primary mb-1">폐병</p>
                <p className="text-text/70 text-sm">코가 벌름거리는 증상</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-primary mb-1">간병</p>
                <p className="text-text/70 text-sm">눈초리가 푸르게 됨</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-primary mb-1">비장병</p>
                <p className="text-text/70 text-sm">입주위가 누레짐</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium text-primary mb-1">신장병</p>
                <p className="text-text/70 text-sm">귀가 검고 마름</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">원장 인사말</h2>
          <div className="max-w-3xl mx-auto text-text/80 leading-relaxed space-y-4">
            <p>
              안녕하세요. 세봉한의원 원장 김형규입니다.
            </p>
            <p>
              우리 몸은 복잡하고 정교한 시스템으로 이루어져 있습니다. 
              형상의학은 이 몸의 외적 형상을 통해 내부의 건강 상태를 읽어내는 
              전통 한의학의 지혜입니다.
            </p>
            <p>
              수년간의 임상 경험과 학술 연구를 통해 형상의학의 깊이를 연구해왔습니다. 
              대한전통한의학회(형상학회)에서 &ldquo;내상병에 대한 형상의학적 치료&rdquo;를 발표하며 
              형상의학의 실제 임상 적용을 공유했습니다.
            </p>
            <p>
              세봉한의원에서는 환자 한 분 한 분의 형상을 세심히 관찰하여 
              개인별 맞춤 진단과 치료를 제공합니다. 
              질병 치료뿐만 아니라 건강한 삶을 유지할 수 있는 예방 의학의 
              관점에서 진료에 임하고 있습니다.
            </p>
            <p className="text-primary font-medium">
              여러분의 건강한 삶을 위해 세봉한의원이 함께하겠습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
