import { useState } from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  View,
} from 'react-native';
import {
  Bookmark,
  Clock,
  MapPin,
  Navigation2,
  Plus,
  Share2,
  Star,
  X,
} from 'lucide-react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {
  Button,
  Caps,
  Fade,
  IconButton,
  Label,
  Page,
  Surface,
} from '../components/TravelUI';
import { designAssets } from '../data/designAssets';
import { getPlace } from '../data/travel';
import { useTravel } from '../state/TravelContext';
import type { Navigation } from '../navigation/types';
export async function openDirections(placeId: string) {
  const p = getPlace(placeId);
  await Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.location + ' ' + p.title)}`,
  );
}
export function DetailScreen({
  placeId,
}: {
  nav: Navigation;
  placeId: string;
}) {
  const place = getPlace(placeId);
  const { state, toggleSaved, addStop } = useTravel();
  const [gallery, setGallery] = useState(false);
  const [message, setMessage] = useState('');
  const [day, setDay] = useState(2);
  const isGarden = placeId === 'garden';
  const images = isGarden
    ? [
        designAssets['detail-1'],
        designAssets['detail-2'],
        designAssets['detail-3'],
      ]
    : [place.image];
  const [photo, setPhoto] = useState(0);
  const added = state.stops.some((s) => s.placeId === placeId && s.day === day);
  const share = () =>
    Share.share({
      title: place.title,
      message: `${place.title}\n${place.location}\n${place.description}`,
    }).catch(() => setMessage('공유 창을 열지 못했습니다.'));
  return (
    <View className="flex-1">
      <Page>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="사진 갤러리 열기"
          onPress={() => setGallery(true)}
        >
          <ImageBackground source={images[0]} className="h-80">
            <Fade />
            <View className="absolute left-4 top-4 rounded-full bg-sand px-3 py-1">
              <Label className="text-[11px] text-secondary">
                RYOKA EXCLUSIVE
              </Label>
            </View>
            <View className="absolute bottom-4 left-4 right-4 flex-row justify-between">
              <Label className="rounded-full bg-black/40 px-3 py-1 text-[11px] text-white">
                1 / {images.length}
              </Label>
              <Label className="text-xs text-white">고화질 갤러리 ↗</Label>
            </View>
          </ImageBackground>
        </Pressable>
        <View className="px-4">
          <View className="mb-4 mt-5 flex-row justify-between">
            <Caps>{`${place.city} · ${place.category}`}</Caps>
            <Label className="text-[11px] text-secondary">{place.badge}</Label>
          </View>
          <Label className="text-[28px] font-semibold">{place.title}</Label>
          <Label className="mt-1 text-lg text-secondary">
            ({place.japanese})
          </Label>
          <Caps>{place.english}</Caps>
          {!!place.rating && (
            <View className="my-3 flex-row items-center gap-1">
              <Star size={14} color="#6b5c4a" fill="#6b5c4a" />
              <Label className="text-sm font-semibold">{place.rating}</Label>
              <Label className="text-xs text-secondary">
                (디자인 예시 리뷰 {place.reviews})
              </Label>
            </View>
          )}
          <View className="my-4 flex-row flex-wrap gap-3">
            {[
              { label: '운영시간', value: place.hours },
              { label: isGarden ? '입장료' : '이용 가격', value: place.price },
              { label: '교통편', value: place.access },
              {
                label: '권장 방문대',
                value: isGarden ? '오전 09:30 이전' : '여유로운 시간에 방문',
              },
            ].map((item) => (
              <View
                key={item.label}
                className="w-[48%] rounded-xl bg-stone p-3"
              >
                <Label className="mb-2 text-[11px] text-secondary">
                  {item.label}
                </Label>
                <Label className="text-sm font-semibold leading-5">
                  {item.value}
                </Label>
              </View>
            ))}
          </View>
          <View className="my-5">
            <Caps>EDITOR’S JOURNAL</Caps>
            <Label className="mb-4 font-editorial text-[25px] leading-9 text-secondary">
              {isGarden
                ? '“다다미에 앉아 흐르는 물소리와\n바람결을 마주하는 고요의 시간”'
                : '“계절의 향기와 함께 머무르는 시간”'}
            </Label>
            <Label className="text-[14px] leading-7 text-muted">
              {place.description}
            </Label>
            {isGarden && (
              <Label className="mt-3 text-[14px] leading-7 text-muted">
                목조 복도를 따라 걸으며 마주하는 마른 정원과 이끼 낀 지천회유식
                정원의 대비가 마음을 차분하게 정돈해 줍니다.
              </Label>
            )}
          </View>
          <Surface>
            <Label className="mb-3 text-sm font-semibold">
              방문자 가이드 & 머무름 팁
            </Label>
            <Label className="text-[13px] leading-6 text-muted">
              {isGarden
                ? '• 다다미 본당 관람: 지정된 동선에서 조용히 관람해 주세요.\n• 우천 시 운치: 처마 끝 빗소리와 젖은 단풍의 색감이 빼어납니다.\n• 계절 특별 관람: 방문 전 운영 정보를 확인해 주세요.'
                : '• 예약이 필요한 공간은 방문 전 이용 가능 여부를 확인해 주세요.\n• 계절과 날씨에 맞춰 여유롭게 이동 시간을 배정하세요.'}
            </Label>
          </Surface>
          {isGarden && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3 py-5"
            >
              {images.slice(1).map((source, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setPhoto(i + 1);
                    setGallery(true);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`정원 사진 ${i + 2}`}
                >
                  <Image source={source} className="h-28 w-40 rounded-lg" />
                </Pressable>
              ))}
            </ScrollView>
          )}
          <View className="my-5">
            <Caps>LOCATION & AROUND</Caps>
            <Label className="mb-3 text-xl">위치 및 주변 산책로</Label>
            <Surface>
              <MapPin size={20} color="#6b5c4a" />
              <Label className="my-3 text-[13px] leading-6">
                {place.location}
              </Label>
              <Button
                secondary
                icon={Navigation2}
                onPress={() => {
                  openDirections(placeId).catch(() =>
                    setMessage('지도 앱을 열지 못했습니다.'),
                  );
                }}
              >
                길찾기
              </Button>
            </Surface>
            {isGarden && (
              <View className="mt-3 gap-2 rounded-xl bg-stone p-4">
                <Label className="mb-1 text-sm font-semibold">
                  함께 거닐기 좋은 동선
                </Label>
                {[
                  '블루보틀 교토 1호점 · 도보 4분',
                  '에이칸도 젠린지 · 도보 9분',
                  '철학의 길 남단 산책로 · 도보 12분',
                ].map((text) => (
                  <Label key={text} className="text-xs leading-5 text-muted">
                    {text}
                  </Label>
                ))}
              </View>
            )}
          </View>
          <Label className="mb-4 text-[11px] leading-5 text-secondary">
            원본 디자인의 큐레이션 예시입니다. 가격·운영시간·예약 여부는 방문
            전에 확인해 주세요.
          </Label>
        </View>
      </Page>
      <View className="border-t border-stone bg-cream px-4 py-3">
        {!!message && (
          <Label
            accessibilityLiveRegion="polite"
            className="mb-2 text-xs text-secondary"
          >
            {message}
          </Label>
        )}
        <View className="mb-2 flex-row items-center justify-between">
          <Label className="text-xs text-secondary">추가할 날짜</Label>
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected: day === value }}
                onPress={() => setDay(value)}
                className={`mx-0.5 rounded-full px-2 py-1 ${day === value ? 'bg-sand' : 'bg-stone'}`}
              >
                <Label className="text-xs">D{value}</Label>
              </Pressable>
            ))}
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <IconButton icon={Share2} label="장소 공유" onPress={share} />
          <IconButton
            icon={Bookmark}
            label={state.saved.includes(placeId) ? '저장 취소' : '장소 저장'}
            onPress={() => {
              toggleSaved(placeId);
              setMessage(
                state.saved.includes(placeId)
                  ? '저장을 취소했습니다.'
                  : '위시 컬렉션에 저장했습니다.',
              );
            }}
          />
          <View className="flex-1">
            <Button
              icon={added ? Clock : Plus}
              disabled={added}
              onPress={() => {
                addStop(placeId, day);
                setMessage(`Day ${day}에 추가되었습니다.`);
              }}
            >
              {added ? '일정에 담은 장소' : `Day ${day} 일정에 담기`}
            </Button>
          </View>
        </View>
      </View>
      <Modal
        visible={gallery}
        animationType="fade"
        onRequestClose={() => setGallery(false)}
      >
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <SafeAreaView className="flex-1 bg-ink">
            <View className="flex-row items-center justify-between px-4">
              <Label className="text-white">
                {photo + 1} / {images.length}
              </Label>
              <IconButton
                icon={X}
                label="갤러리 닫기"
                dark
                onPress={() => setGallery(false)}
              />
            </View>
            <Image
              source={images[photo]}
              resizeMode="contain"
              className="flex-1"
            />
            <View className="flex-row justify-center gap-3 p-4">
              {images.map((source, i) => (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  accessibilityLabel={`사진 ${i + 1} 보기`}
                  onPress={() => setPhoto(i)}
                >
                  <Image source={source} className="h-16 w-16 rounded-lg" />
                </Pressable>
              ))}
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </View>
  );
}
