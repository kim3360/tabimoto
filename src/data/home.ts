export const categories = [
  '전체',
  '고즈넉한 료칸',
  '미식 오마카세',
  '예술 & 사찰',
  '히든 스팟',
];
export const cities = [
  '도쿄 Tokyo',
  '교토 Kyoto',
  '오사카 Osaka',
  '후쿠오카 Fukuoka',
  '삿포로 Sapporo',
];
export const destinations = [
  {
    id: 'garden',
    image: require('../../assets/images/kyoto-garden.jpg'),
    badge: '힐링 & 정적',
    city: '교토',
    location: '교토 아라시야마',
    rating: '4.95',
    category: '예술 & 사찰',
    title: '천년의 시간을 품은 교토의 정원',
    description:
      '단풍과 다다미 방 너머로 펼쳐지는 고요한 선종 사찰의 풍경. 일상을 벗어난 진정한 쉼을 만끽하세요.',
    tags: ['다도 체험', '개인 정원 투어'],
  },
  {
    id: 'skyline',
    image: require('../../assets/images/tokyo-skyline.jpg'),
    badge: '도심 전망',
    city: '도쿄',
    location: '도쿄 시부야',
    rating: '4.92',
    category: '히든 스팟',
    title: '도쿄의 황혼과 후지산의 실루엣',
    description:
      '시부야 스카이에서 내려다보는 황금빛 도시 전경. 노을빛 사이로 웅장하게 서 있는 후지산의 파노라마.',
    tags: ['선셋 라운지', '야경 명소'],
  },
  {
    id: 'kaiseki',
    image: require('../../assets/images/kaiseki-dining.jpg'),
    badge: 'MICHELIN 2-STAR SELECTION',
    city: '교토',
    location: '교토 히가시야마 전통 료칸',
    rating: '',
    category: '미식 오마카세',
    title: '오감을 깨우는 제철 가이세키의 미학',
    description:
      '지역 장인들이 빚어낸 도자기 위에 피어나는 사계절의 맛. 은은한 편백나무 향이 흐르는 단독 다실에서 일본 정통 가이세키의 깊은 맛을 음미해 보세요.',
    tags: ['제철 코스', '프라이빗 다실', '고즈넉한 료칸'],
  },
];
export type Destination = (typeof destinations)[number];
