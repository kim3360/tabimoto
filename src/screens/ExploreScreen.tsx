import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Map, Search, SlidersHorizontal } from 'lucide-react-native';
import {
  Button,
  Caps,
  Chips,
  Empty,
  IconButton,
  Input,
  Label,
  Page,
  PlaceCard,
} from '../components/TravelUI';
import { placeCategories, places } from '../data/travel';
import type { Navigation } from '../navigation/types';
export function ExploreScreen({
  nav,
  initialQuery = '',
  initialCity = '',
  initialCategory = '전체',
}: {
  nav: Navigation;
  initialQuery?: string;
  initialCity?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity || '전체');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<'추천순' | '평점순'>('추천순');
  const [filter, setFilter] = useState(false);
  const results = places.filter(
    (p) =>
      (city === '전체' || p.city === city) &&
      (category === '전체' || p.category === category) &&
      `${p.title} ${p.japanese} ${p.description} ${p.city} ${p.tags.join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  if (sort === '평점순')
    results.sort((a, b) => Number(b.rating) - Number(a.rating));
  return (
    <View className="flex-1">
      <Page className="px-4">
        <View className="flex-row items-center gap-2">
          <Search size={18} color="#6b5c4a" />
          <View className="flex-1">
            <Input
              accessibilityLabel="여행지 검색"
              placeholder="고요한 정원, 가이세키..."
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
          </View>
          <IconButton
            icon={SlidersHorizontal}
            label="필터"
            onPress={() => setFilter(!filter)}
          />
        </View>
        <Chips
          values={['전체', '도쿄', '교토', '오사카', '후쿠오카', '홋카이도']}
          value={city}
          onChange={setCity}
        />
        <Chips
          values={placeCategories}
          value={category}
          onChange={setCategory}
        />
        {filter && (
          <View className="my-2 rounded-xl bg-sand p-4">
            <Caps>MY CURATION</Caps>
            <Label className="mb-3 text-sm">
              도시와 카테고리를 조합해 취향에 맞는 여정을 찾아보세요.
            </Label>
            <Button
              secondary
              onPress={() => {
                setCity('전체');
                setCategory('전체');
                setQuery('');
              }}
            >
              필터 초기화
            </Button>
          </View>
        )}
        <View className="my-4 flex-row items-center justify-between">
          <Label className="text-xs text-secondary">
            총 {results.length}곳의 선별된 여정
          </Label>
          <Pressable
            accessibilityRole="button"
            onPress={() => nav.go({ name: 'route', day: 2 })}
            className="flex-row items-center gap-1 rounded-full bg-sand px-3 py-2"
          >
            <Map size={14} color="#6b5c4a" />
            <Label className="text-xs">지도 보기</Label>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setSort(sort === '추천순' ? '평점순' : '추천순')}
          >
            <Label className="text-xs">{sort}⌄</Label>
          </Pressable>
        </View>
        {results.map((place) => (
          <PlaceCard key={place.id} place={place} nav={nav} />
        ))}
        {results.length === 0 && (
          <Empty text="선별된 여정이 없어요. 다른 검색어나 도시를 선택해 보세요." />
        )}
        <Label className="text-[11px] text-secondary">
          원본 디자인의 샘플 큐레이션입니다. 운영·가격 정보는 방문 전 확인해
          주세요.
        </Label>
      </Page>
      <View className="px-4 pb-3">
        <Button icon={Map} onPress={() => nav.go({ name: 'route', day: 2 })}>
          지도에서 동선 확인하기
        </Button>
      </View>
    </View>
  );
}
