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
      title: '근골격계 질환',
      subtitle: 'Musculoskeletal Disorders',
      href: '#',
      description: '환부에 진단용 키트를 부착하여 파동을 증폭시킨 뒤, MFT 검사로 관련 경락을 진단하여 체질에 맞는 침 치료와 한약 처방을 시행합니다.',
      image: '/img/근골격계3.png',
    },
    {
      title: '면역 기능 저하 질환',
      subtitle: 'Immune Function Disorders',
      href: '#',
      description: '면역 기능을 정·기·신·혈로 세분화하여 이목구비를 통한 MFT 진단으로 부족한 요소를 정확히 파악하고 근본적인 면역 회복을 돕습니다.',
      image: '/img/면역2.png',
    },
    {
      title: '여성질환 · 불임',
      subtitle: 'Women\'s Health & Infertility',
      href: '#',
      description: '여성질환은 뇌신경계, 소화기계, 순환기계 등의 기능 이상이 자궁 질환, 생리 불순, 생리통, 불임으로 이어지는 경우가 많습니다. 특히 불임의 경우 다양한 원인 경락을 정밀하게 치료하여 임신 성공률 향상을 도모합니다.',
      image: '/img/여성질환2.png',
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
