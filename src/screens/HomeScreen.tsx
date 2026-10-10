import { useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {
  ArrowRight,
  Bell,
  Bookmark,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  Compass,
  House,
  Leaf,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  UserRound,
  X,
} from 'lucide-react-native';
import { Fade, IconButton, Label } from '../components/HomePrimitives';
import {
  categories,
  cities,
  destinations,
  type Destination,
} from '../data/home';

type Panel = '탐색' | '일정' | '저장' | '마이' | '알림' | null;
const tabs = [
  { name: '홈', icon: House },
  { name: '탐색', icon: Compass },
  { name: '일정', icon: CalendarDays },
  { name: '저장', icon: Bookmark },
  { name: '마이', icon: CircleUserRound },
] as const;

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

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const scroll = useRef<ScrollView>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const [city, setCity] = useState('');
  const [panel, setPanel] = useState<Panel>(null);
  const [detail, setDetail] = useState<Destination | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [planned, setPlanned] = useState<string[]>([]);
  const results = destinations.filter(
    (item) =>
      (category === '전체' ||
        item.category === category ||
        item.tags.includes(category)) &&
      (!city || item.city === city) &&
      `${item.title} ${item.location} ${item.description} ${item.tags.join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const toggleSaved = (id: string) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  const openSearch = () => setPanel('탐색');
  const gourmet = destinations[2];

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-16 flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-2">
          <Image
            source={require('../../assets/images/ryoka-crest.jpg')}
            className="h-8 w-8"
          />
          <Label className="text-xl font-semibold tracking-[2px]">RYOKA</Label>
          <Label className="text-[11px] text-secondary">旅香</Label>
        </View>
        <View className="flex-row items-center">
          <IconButton icon={Search} label="검색 열기" onPress={openSearch} />
          <IconButton
            icon={Bell}
            label="알림"
            onPress={() => setPanel('알림')}
          />
          <IconButton
            icon={UserRound}
            label="마이 페이지"
            dark
            onPress={() => setPanel('마이')}
          />
        </View>
      </View>
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
      <View className="h-16 flex-row border-t border-stone bg-cream">
        {tabs.map(({ name, icon: Icon }) => (
          <Pressable
            key={name}
            accessibilityRole="tab"
            accessibilityLabel={name}
            accessibilityState={{
              selected: panel === name || (!panel && name === '홈'),
            }}
            onPress={() => {
              if (name === '홈') {
                setPanel(null);
                scroll.current?.scrollTo({ y: 0, animated: true });
              } else {
                setPanel(name);
              }
            }}
            className="flex-1 items-center justify-center gap-1"
          >
            <Icon
              size={22}
              strokeWidth={1.5}
              color={name === '홈' ? '#1b1c1a' : '#7b766f'}
            />
            <Label
              className={`text-[11px] ${name === '홈' ? 'text-ink' : 'text-secondary'}`}
            >
              {name}
            </Label>
          </Pressable>
        ))}
      </View>
      <Modal
        visible={panel !== null || detail !== null}
        animationType="slide"
        onRequestClose={() => {
          if (detail) {
            setDetail(null);
          } else {
            setPanel(null);
          }
        }}
      >
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <SafeAreaView className="flex-1 bg-cream">
            <View className="h-16 flex-row items-center justify-between px-4">
              <Label className="text-xl font-semibold">
                {detail ? '여정 상세' : panel}
              </Label>
              <IconButton
                icon={X}
                label="닫기"
                onPress={() => {
                  if (detail) {
                    setDetail(null);
                  } else {
                    setPanel(null);
                  }
                }}
              />
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              className="flex-1"
              contentContainerClassName="p-4"
            >
              {detail ? (
                <>
                  <Photo item={detail} height={300} />
                  <Label className="mb-3 mt-5 text-2xl font-semibold leading-8">
                    {detail.title}
                  </Label>
                  <Label className="mb-6 text-base leading-7 text-muted">
                    {detail.description}
                  </Label>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: saved.includes(detail.id) }}
                    onPress={() => toggleSaved(detail.id)}
                    className="mb-3 flex-row items-center justify-center gap-2 rounded-xl bg-sand p-4"
                  >
                    <Bookmark
                      size={20}
                      color="#6b5c4a"
                      fill={saved.includes(detail.id) ? '#6b5c4a' : 'none'}
                    />
                    <Label>
                      {saved.includes(detail.id)
                        ? '저장됨 · 저장 취소'
                        : '이 장소 저장하기'}
                    </Label>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      setPlanned((prev) =>
                        prev.includes(detail.id)
                          ? prev.filter((id) => id !== detail.id)
                          : [...prev, detail.id],
                      )
                    }
                    className="rounded-xl bg-ink p-4"
                  >
                    <Label className="text-center text-white">
                      {planned.includes(detail.id)
                        ? '내 일정에 추가됨 · 취소'
                        : '내 일정에 추가하기'}
                    </Label>
                  </Pressable>
                  <Label className="mt-4 text-xs leading-5 text-secondary">
                    홈 화면의 큐레이션 정보입니다. 일정 추가는 예약을 진행하지
                    않습니다.
                  </Label>
                </>
              ) : panel === '탐색' ? (
                <>
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
                  <Label className="mb-4 mt-6 text-sm text-secondary">
                    {results.length}개의 여정{city ? ` · ${city}` : ''}
                  </Label>
                  {results.map((item) => (
                    <Card
                      setDetail={setDetail}
                      key={item.id}
                      item={item}
                      compact
                    />
                  ))}
                  {results.length === 0 && (
                    <Label className="py-12 text-center text-muted">
                      검색 결과가 없어요. 다른 검색어로 찾아보세요.
                    </Label>
                  )}
                </>
              ) : panel === '저장' || panel === '일정' ? (
                <>
                  {destinations
                    .filter((item) =>
                      (panel === '저장' ? saved : planned).includes(item.id),
                    )
                    .map((item) => (
                      <Card
                        setDetail={setDetail}
                        key={item.id}
                        item={item}
                        compact
                      />
                    ))}
                  {(panel === '저장' ? saved : planned).length === 0 && (
                    <View className="items-center gap-4 py-16">
                      <Bookmark size={32} color="#6b5c4a" />
                      <Label className="text-center text-muted">
                        {panel === '저장'
                          ? '마음에 드는 장소를 저장해 보세요.'
                          : '여정 상세에서 내 일정을 추가해 보세요.'}
                      </Label>
                      <Pressable
                        accessibilityRole="button"
                        onPress={openSearch}
                        className="rounded-lg bg-ink px-6 py-3"
                      >
                        <Label className="text-white">여정 둘러보기</Label>
                      </Pressable>
                    </View>
                  )}
                </>
              ) : panel === '마이' ? (
                <View className="rounded-xl bg-white p-6">
                  <CircleUserRound size={40} color="#6b5c4a" />
                  <Label className="mb-4 mt-4 text-2xl">나의 여행 컬렉션</Label>
                  <Label className="leading-8 text-muted">
                    저장한 장소 {saved.length}개{'\n'}일정에 담은 여정{' '}
                    {planned.length}개
                  </Label>
                  <Label className="mt-4 text-xs text-secondary">
                    현재 앱을 사용하는 동안 컬렉션이 유지됩니다.
                  </Label>
                </View>
              ) : (
                <Label className="py-16 text-center text-muted">
                  새로운 알림이 없어요.
                </Label>
              )}
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </SafeAreaView>
  );
}
