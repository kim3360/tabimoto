import type { ImageSourcePropType } from 'react-native';
import { designAssets } from './designAssets';

export type Place = {
  id: string;
  title: string;
  japanese: string;
  english: string;
  city: string;
  category: string;
  image: ImageSourcePropType;
  description: string;
  location: string;
  badge: string;
  rating: string;
  reviews: string;
  tags: string[];
  price: string;
  access: string;
  coordinate: { latitude: number; longitude: number };
  hours: string;
};
export const placeCategories = [
  '전체',
  '명소·사찰',
  '미식·오마카세',
  '전통 찻집·카페',
  '료칸·숙소',
  '산책·전망',
];
export const places: Place[] = [
  {
    id: 'garden',
    title: '난젠지 텐주안',
    japanese: '南禅寺 天授庵',
    english: 'ZEN TEMPLE & GARDEN',
    city: '교토',
    category: '명소·사찰',
    image: designAssets['explore-1'],
    description:
      '다다미 방 바닥에 앉아 프레임 너머로 조망하는 고요한 이끼 정원과 붉은 단풍의 파노라마. 빛의 각도에 따라 변하는 정원의 적막한 정취를 만끽할 수 있습니다.',
    location: '교토부 사쿄구 난젠지 후쿠치초 86-8',
    badge: '에디터 픽',
    rating: '4.96',
    reviews: '820',
    tags: ['고즈넉한', '정원뷰', '단풍명소'],
    price: '¥600',
    access: '교토역에서 버스 25분 · 사쿄구 난젠지 에리어',
    coordinate: { latitude: 35.0103, longitude: 135.7924 },
    hours: '09:00 – 17:00',
  },
  {
    id: 'matsuda',
    title: '기온 마츠다',
    japanese: '祇園 まつだ',
    english: 'KAISEKI OMAKASE',
    city: '교토',
    category: '미식·오마카세',
    image: designAssets['explore-2'],
    description:
      '4대째 이어오는 가이세키의 깊은 맛. 매일 아침 직송되는 교토 청정 채소와 엄선한 제철 해산물로 예술 요리를 선보이는 프라이빗 다이닝.',
    location: '교토부 히가시야마구 기온마치',
    badge: '전통 쿄요리',
    rating: '4.98',
    reviews: '412',
    tags: ['프라이빗룸', '예약필수', '사케페어링'],
    price: '¥18,000~',
    access: '기온 시조역 도보 6분 · 하나미코지 골목',
    coordinate: { latitude: 35.003, longitude: 135.775 },
    hours: '예약 시간에 방문',
  },
  {
    id: 'bamboo',
    title: '사가노 대나무 숲길',
    japanese: '嵯峨野 竹林',
    english: 'NATURE & HERITAGE',
    city: '교토',
    category: '산책·전망',
    image: designAssets['explore-3'],
    description:
      '하늘 높이 뻗은 울창한 대나무 사이로 스며드는 햇살과 바람 소리. 노노미야 신사에서 텐류지 북문까지 이어지는 교토 최고의 힐링 루트입니다.',
    location: '교토부 우쿄구 사가오구라야마',
    badge: '산책 코스',
    rating: '4.91',
    reviews: '1,940',
    tags: ['인생사진', '피톤치드', '우쿄구'],
    price: '무료',
    access: '이른 아침 방문 시 가장 호젓한 산책로',
    coordinate: { latitude: 35.0174, longitude: 135.6716 },
    hours: '상시 개방',
  },
  {
    id: 'skyline',
    title: '시부야 스카이 전망대',
    japanese: '渋谷スカイ',
    english: 'TOKYO SUNSET',
    city: '도쿄',
    category: '산책·전망',
    image: require('../../assets/images/tokyo-skyline.jpg'),
    description:
      '지상 229미터에서 바라보는 황홀한 도쿄 노을과 후지산의 윤곽. 유리 난간 너머로 파노라마 시티뷰가 펼쳐집니다.',
    location: '도쿄도 시부야구 시부야 스크램블 스퀘어',
    badge: '도심 전망',
    rating: '4.92',
    reviews: '1,280',
    tags: ['루프탑', '일몰 시간대 추천', '사전 예약'],
    price: '사전 확인',
    access: '시부야역 연결 · 스크램블 스퀘어',
    coordinate: { latitude: 35.6585, longitude: 139.7022 },
    hours: '방문 전 확인',
  },
  {
    id: 'kaiseki',
    title: '히가시야마 프라이빗 료칸',
    japanese: '東山の宿',
    english: 'GOURMET & RYOKAN',
    city: '교토',
    category: '료칸·숙소',
    image: require('../../assets/images/kaiseki-dining.jpg'),
    description:
      '지역 장인들이 빚어낸 도자기 위에 피어나는 사계절의 맛. 은은한 편백나무 향이 흐르는 단독 다실에서 정통 가이세키의 깊은 맛을 음미해 보세요.',
    location: '교토 히가시야마',
    badge: '미식과 온천',
    rating: '',
    reviews: '',
    tags: ['제철 코스', '프라이빗 다실'],
    price: '¥68,000 / 2인',
    access: '교토 히가시야마 에리어',
    coordinate: { latitude: 34.9984, longitude: 135.7808 },
    hours: '체크인 15:00',
  },
  {
    id: 'tea',
    title: '카모가와 강변 감성 찻집',
    japanese: '茶房 鴨川畔',
    english: 'TEA & QUIET MOMENTS',
    city: '교토',
    category: '전통 찻집·카페',
    image: designAssets['itinerary-4'],
    description:
      '강변 테라스에서 오후 노을을 바라보며 마시는 교토 우지 말차. 수제 말차 파르페와 센차로 여정의 오후를 마무리하세요.',
    location: '교토부 나카교구 카모가와',
    badge: '카페 & 다도',
    rating: '',
    reviews: '',
    tags: ['다도체험', '강변 테라스'],
    price: '메뉴별 상이',
    access: '시조 다리에서 도보 8분',
    coordinate: { latitude: 35.0069, longitude: 135.7717 },
    hours: '방문 전 확인',
  },
];
export const getPlace = (id: string) =>
  places.find((p) => p.id === id) ?? places[0];
export type Stop = {
  id: string;
  placeId: string;
  day: number;
  time: string;
  note: string;
};
export const sampleStops: Stop[] = [
  {
    id: 'sample-bamboo',
    placeId: 'bamboo',
    day: 2,
    time: '09:00 – 10:30',
    note: '이른 아침 대나무 사이로 부는 바람을 느껴보세요.',
  },
  {
    id: 'sample-garden',
    placeId: 'garden',
    day: 2,
    time: '11:00 – 12:30',
    note: '남쪽 서원 고산수식 정원 관람 · 다실 차담',
  },
  {
    id: 'sample-matsuda',
    placeId: 'matsuda',
    day: 2,
    time: '13:00 – 14:30',
    note: '제철 쿄야사이와 사케 페어링 코스',
  },
  {
    id: 'sample-tea',
    placeId: 'tea',
    day: 2,
    time: '15:30 – 17:00',
    note: '강변 테라스에서 오후 노을과 함께 즐기는 우지 말차',
  },
];
export const tripTitle = '교토·오사카 고즈넉한 힐링 여정';
export const demoLink = 'https://ryoka.app/trip/demo-kyo-8921';
