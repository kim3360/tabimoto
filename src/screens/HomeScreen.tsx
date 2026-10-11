import { useRef, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  ArrowRight,
  ChevronRight,
  Leaf,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react-native';
import { Fade, IconButton, Label } from '../components/HomePrimitives';
import {
  categories,
  cities,
  destinations,
  type Destination,
} from '../data/home';
import type { Navigation } from '../navigation/types';
function Photo({ item, height = 350 }: { item: Destination; height?: number }) {
  return (
    <ImageBackground
      source={item.image}
      style={{ height }}
      className="overflow-hidden rounded-xl"
    >
      <Fade />
      <View className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1">
        <Label className="text-[11px] tracking-wider">{item.badge}</Label>
      </View>
      <View className="absolute bottom-3 left-3 right-3 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-1">
          <MapPin size={12} color="#fff" />
          <Label className="text-[11px] text-white">{item.location}</Label>
        </View>
        {!!item.rating && (
          <View className="flex-row items-center gap-1 rounded-full bg-black/40 px-2 py-1">
            <Star size={11} color="#f4dfc9" fill="#f4dfc9" />
            <Label className="text-[11px] text-white">{item.rating}</Label>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}
function Card({
  item,
  compact = false,
  setDetail,
}: {
  item: Destination;
  compact?: boolean;
  setDetail: (item: Destination) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title} 상세 보기`}
      onPress={() => setDetail(item)}
      className={compact ? 'mb-6' : 'w-[280px]'}
    >
      <Photo item={item} height={compact ? 220 : 350} />
      <Label numberOfLines={1} className="mb-1 mt-3 text-xl font-semibold">
        {item.title}
      </Label>
      <Label numberOfLines={2} className="text-[13px] leading-5 text-muted">
        {item.description}
      </Label>
      <View className="mt-2 flex-row flex-wrap gap-2">
        {item.tags.map((tag) => (
          <View key={tag} className="rounded bg-stone px-2 py-1">
            <Label className="text-[11px] text-secondary">{tag}</Label>
          </View>
        ))}
      </View>
    </Pressable>
  );
}
function Filters({
  category,
  city,
  setCategory,
  setCity,
}: {
  category: string;
  city: string;
  setCategory: (value: string) => void;
  setCity: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerClassName="gap-1.5"
      >
        {categories.map((value) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: category === value }}
            key={value}
            onPress={() => setCategory(value)}
            className={`rounded-full px-3 py-1.5 ${category === value ? 'bg-ink' : 'bg-stone'}`}
          >
            <Label
              className={`text-[11px] ${category === value ? 'text-white' : 'text-muted'}`}
            >
              {value}
            </Label>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-3"
        contentContainerClassName="items-center gap-3"
      >
        <Pressable onPress={() => setCity('')} accessibilityRole="button">
          <Label className="text-[11px] text-secondary">도시별 탐색</Label>
        </Pressable>
        {cities.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: city === value.split(' ')[0] }}
            onPress={() =>
              setCity((prev) =>
                prev === value.split(' ')[0] ? '' : value.split(' ')[0],
              )
            }
          >
            <Label
              className={`text-[11px] ${city === value.split(' ')[0] ? 'font-bold text-ink' : 'text-muted'}`}
            >
              · {value}
            </Label>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}
function SearchField({
  query,
  setQuery,
  openSearch,
}: {
  query: string;
  setQuery: (value: string) => void;
  openSearch: () => void;
}) {
  return (
    <View className="h-12 flex-row items-center gap-2 rounded-lg bg-stone px-3">
      <Search size={18} color="#7b766f" />
      <TextInput
        accessibilityLabel="여행지 검색"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={openSearch}
        returnKeyType="search"
        placeholder="어디로 떠나고 싶으신가요? (예: 교토 가이세키)"
        placeholderTextColor="#918b83"
        className="h-full flex-1 py-0 text-[13px] text-ink"
      />
      {query ? (
        <IconButton
          icon={X}
          label="검색어 지우기"
          onPress={() => setQuery('')}
        />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="여행지 필터 및 검색"
          onPress={openSearch}
        >
          <SlidersHorizontal size={18} color="#7b766f" />
        </Pressable>
      )}
    </View>
  );
}

export function HomeScreen({ nav }: { nav: Navigation }) {
  const { width } = useWindowDimensions();
  const scroll = useRef<ScrollView>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const [city, setCity] = useState('');
  const results = destinations.filter(
    (item) =>
      (category === '전체' ||
        item.category === category ||
        item.tags.includes(category)) &&
      (!city || item.city === city) &&
      `${item.title} ${item.location} ${item.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const setDetail = (item: Destination) =>
    nav.go({ name: 'detail', placeId: item.id });
  const openSearch = () =>
    nav.go({
      name: 'main',
      tab: '탐색',
      query,
      city,
      category:
        category === '예술 & 사찰'
          ? '명소·사찰'
          : category === '미식 오마카세'
            ? '미식·오마카세'
            : category === '고즈넉한 료칸'
              ? '료칸·숙소'
              : '전체',
    });
  const gourmet = destinations[2];
  return (
    <View className="flex-1">
      <ScrollView
        ref={scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={require('../../assets/images/kyoto-gion.jpg')}
          style={{ height: Math.min(width * 1.25, 460) }}
        >
          <Fade strong />
          <View className="absolute bottom-12 left-4 right-4">
            <View className="mb-3 flex-row items-center gap-2 self-start rounded-full bg-white/20 px-3 py-1.5">
              <View className="h-1.5 w-1.5 rounded-full bg-sand" />
              <Label className="text-[11px] font-semibold tracking-wider text-white">
                RYOKA EDITORIAL SELECTION
              </Label>
            </View>
            <Label className="font-editorial text-[38px] leading-[47px] text-sand">
              {'Curated Journey in\nJapan'}
            </Label>
            <Label className="mt-2 text-[28px] leading-[38px] text-white">
              {'고요 속에 머무는 시간,\n일본의 진정한 아름다움을 만나다'}
            </Label>
          </View>
        </ImageBackground>
        <View className="mx-4 -mt-8 mb-6 rounded-xl bg-white p-4 shadow-lg shadow-black/10">
          <SearchField
            query={query}
            setQuery={setQuery}
            openSearch={openSearch}
          />
          <Filters
            category={category}
            city={city}
            setCategory={setCategory}
            setCity={setCity}
          />
        </View>
        <View className="mb-6">
          <View className="mb-4 flex-row items-end justify-between px-4">
            <View>
              <Label className="text-[11px] font-semibold tracking-[1.3px] text-secondary">
                EDITOR’S CHOICE
              </Label>
              <Label className="text-2xl leading-8">
                추천하는 이번 달의 여정
              </Label>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={openSearch}
              className="flex-row items-center"
            >
              <Label className="text-[11px] text-secondary">전체보기</Label>
              <ChevronRight size={14} color="#6b5c4a" />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4 gap-4"
          >
            {(category === '전체' && !city && !query
              ? destinations.slice(0, 2)
              : results
            ).map((item) => (
              <Card setDetail={setDetail} key={item.id} item={item} />
            ))}
            {results.length === 0 && (
              <View className="w-80 rounded-xl bg-stone p-6">
                <Label className="text-muted">
                  조건에 맞는 여정이 없어요. 다른 도시나 카테고리를 선택해
                  보세요.
                </Label>
              </View>
            )}
          </ScrollView>
        </View>
        <View className="mb-6 px-4">
          <Label className="mb-1 text-[11px] font-semibold tracking-wider text-secondary">
            — GOURMET & RYOKAN STORY
          </Label>
          <Label className="mb-4 text-2xl leading-8">
            오감을 깨우는 미식과 온천의 미학
          </Label>
          <View className="overflow-hidden rounded-xl bg-white">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="가이세키 여정 상세 보기"
              onPress={() => setDetail(gourmet)}
            >
              <ImageBackground
                source={gourmet.image}
                style={{ height: (width - 32) * 0.625 }}
              >
                <Fade />
                <View className="absolute left-4 top-4 rounded-full bg-sand px-3 py-1.5">
                  <Label className="text-[11px] tracking-wider text-secondary">
                    {gourmet.badge}
                  </Label>
                </View>
                <View className="absolute bottom-4 left-4 right-4 flex-row justify-between">
                  <Label className="text-[11px] text-white">
                    {gourmet.location}
                  </Label>
                  <Label className="text-[11px] text-sand">
                    제철 코스 예약 가능
                  </Label>
                </View>
              </ImageBackground>
            </Pressable>
            <View className="p-4">
              <Label className="mb-1 text-[11px] font-semibold tracking-wider text-secondary">
                CULINARY ESSENCE
              </Label>
              <Label className="mb-2 text-xl font-semibold leading-7">
                {gourmet.title}
              </Label>
              <Label className="mb-4 text-[13px] leading-[21px] text-muted">
                {gourmet.description}
              </Label>
              <View className="flex-row items-center justify-between rounded-lg bg-stone p-3">
                <View>
                  <Label className="text-[11px] text-secondary">
                    1박 코스 포함가
                  </Label>
                  <Label className="text-xl font-semibold">
                    ¥68,000
                    <Label className="text-[11px] font-normal">
                      {' '}
                      / 2인 기준
                    </Label>
                  </Label>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setDetail(gourmet)}
                  className="flex-row items-center gap-2 rounded-lg bg-ink px-4 py-2"
                >
                  <Label className="text-[13px] text-white">
                    여정 살펴보기
                  </Label>
                  <ArrowRight size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View className="mx-4 mb-6 flex-row gap-3 rounded-xl bg-stone p-4">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-sand">
            <Leaf size={20} color="#6b5c4a" />
          </View>
          <View className="flex-1">
            <Label className="mb-1 text-[11px] tracking-wider text-secondary">
              RYOKA TIP
            </Label>
            <Label className="mb-1 text-[17px] font-semibold">
              프라이빗 노천탕 즐기기
            </Label>
            <Label className="text-[13px] leading-5 text-muted">
              새벽 이슬이 내려앉은 정원을 바라보며 즐기는 아침 입욕은 료칸
              여행의 가장 특별한 순간입니다.
            </Label>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
