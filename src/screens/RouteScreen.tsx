import { useState } from 'react';
import { Image, View } from 'react-native';
import { ArrowRight, Navigation2 } from 'lucide-react-native';
import {
  Button,
  Caps,
  Chips,
  Empty,
  Label,
  Page,
  Surface,
} from '../components/TravelUI';
import { RouteMap } from '../components/RouteMap';
import { getPlace } from '../data/travel';
import { useTravel } from '../state/TravelContext';
import type { Navigation } from '../navigation/types';
export function RouteScreen({ nav, day }: { nav: Navigation; day: number }) {
  const { state } = useTravel();
  const stops = state.stops.filter((s) => s.day === day);
  const [selected, setSelected] = useState(stops[1]?.id || stops[0]?.id);
  const stop = stops.find((s) => s.id === selected) || stops[0];
  const place = stop ? getPlace(stop.placeId) : null;
  return (
    <Page className="px-4">
      <View className="my-3">
        <Caps>{`DAY 0${day} · ROUTE PREVIEW`}</Caps>
        <Label className="text-2xl">
          {day === 2 ? '교토 자연과 전통의 미학' : '나만의 일본 여행 동선'}
        </Label>
        <Label className="mt-2 text-xs text-secondary">
          {stops.length}개 장소 · 내 일정 순서대로 표시
        </Label>
      </View>
      <Chips
        values={stops.map((s, i) => `${i + 1} ${getPlace(s.placeId).title}`)}
        value={stop ? `${stops.indexOf(stop) + 1} ${place?.title}` : ''}
        onChange={(value) => {
          const index = Number(value.split(' ')[0]) - 1;
          setSelected(stops[index].id);
        }}
      />
      <RouteMap stops={stops} selected={stop?.id} onSelect={setSelected} />
      {place && stop ? (
        <View className="mt-4 gap-4">
          <Surface>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Caps>{`SPOT ${String(stops.indexOf(stop) + 1).padStart(2, '0')}`}</Caps>
                <Label className="text-xl font-semibold">{place.title}</Label>
                <Label className="mt-1 text-[11px] text-secondary">
                  {place.japanese}
                </Label>
                <Label className="mt-2 text-xs text-muted">
                  {place.rating ? `★ ${place.rating} · ` : ''}
                  {stop.time}
                </Label>
              </View>
              <Image source={place.image} className="h-20 w-20 rounded-lg" />
            </View>
            <View className="mt-4 rounded-lg bg-stone p-3">
              <Label className="mb-2 text-sm font-semibold">방문 동선</Label>
              <Label className="text-[13px] leading-6 text-muted">
                {place.access}
              </Label>
              <Label className="mt-2 text-xs text-secondary">
                길찾기를 시작하면 현재 위치에서 이 장소까지 안내합니다.
              </Label>
            </View>
            <View className="mt-4 gap-2">
              <Button
                icon={Navigation2}
                onPress={() =>
                  nav.go({ name: 'navigation', placeId: place.id })
                }
              >
                길찾기 시작
              </Button>
              <Button
                secondary
                icon={ArrowRight}
                onPress={() => nav.go({ name: 'detail', placeId: place.id })}
              >
                장소 상세 보기
              </Button>
            </View>
          </Surface>
          <View className="rounded-xl bg-sand/40 p-4">
            <Caps>EDITOR’S QUIET TIP</Caps>
            <Label className="text-sm leading-6 text-muted">
              {stop.note ||
                '바쁜 일정 속에서도 잠시 멈추어 주변의 바람 소리와 계절의 색을 느껴보세요.'}
            </Label>
          </View>
          <Label className="text-[11px] leading-5 text-secondary">
            핀과 연결선은 원본 디자인을 재현한 동선 미리보기입니다. 실시간
            위치와 경로 안내는 길찾기 시작 화면에서 확인합니다.
          </Label>
        </View>
      ) : (
        <Empty
          text="이 날짜에는 등록된 장소가 없어요."
          onPress={() => nav.go({ name: 'main', tab: '탐색' })}
        />
      )}
    </Page>
  );
}
