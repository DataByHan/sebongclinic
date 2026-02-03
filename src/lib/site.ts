export type Specialty = {
  title: string
  subtitle: string
  href: string
  description: string
  image?: string
}

export type ExternalLink = {
  label: string
  href: string
}

export const site = {
  name: '세봉한의원',
  url: 'https://www.sebongclinic.co.kr',
  doctorName: '김형규',
  tagline: '조용히, 정확히. 몸의 흐름을 다시 세웁니다.',
  address: '부산광역시 수영구 수영로 394, 4층 (남천동)',
  phone: '051-623-7227',
  kakaoMapLink: 'https://kko.to/WLKRNS3gmy',
  specialties: [
    {
      title: '공진단',
      subtitle: '기력 · 회복 · 컨디션',
      href: 'https://seoulgongmyung.com/product02',
      description:
        '일상에서 흐트러진 리듬을 회복하고, 장기적인 체력 기반을 다지는 처방을 목표로 합니다.',
      image: '/img/dan.jpg',
    },
    {
      title: '척추치료',
      subtitle: '자세 · 통증 · 균형',
      href: 'https://jangdeuk.com/menu02/menu02_04_01.php',
      description:
        '척추와 주변 조직의 균형을 점검하고, 움직임을 방해하는 긴장을 단계적으로 풀어갑니다.',
      image: '/img/chim.jpg',
    },
    {
      title: '총명탕',
      subtitle: '집중 · 기억 · 학습 컨디션',
      href: 'https://www.xn--299at5mi2e3rootax68d.com/kr/index.php?pCode=MN1000108',
      description:
        '공부와 일의 집중력을 해치지 않도록 컨디션을 정돈하고, 흐릿한 피로감을 가볍게 합니다.',
      image: '/img/tang.jpg',
    },
  ] satisfies Specialty[],
  externalLinks: [
    {
      label: '공지사항',
      href: '/notices',
    },
    {
      label: '저서',
      href: 'https://www.aladin.co.kr/author/wauthor_product.aspx?AuthorSearch=@106533',
    },
    {
      label: '블로그 후기',
      href: 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EB%B6%80%EC%82%B0+%EC%84%B8%EB%B4%89%ED%95%9C%EC%9D%98%EC%9B%90&ackey=s7tzthdw',
    },
  ] satisfies ExternalLink[],
  hours: [
    { label: '평일', value: '09:00 - 18:00' },
    { label: '토요일', value: '09:00 - 13:00' },
    { label: '일요일', value: '휴진' },
  ],
} as const
