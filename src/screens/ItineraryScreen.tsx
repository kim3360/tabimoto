import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Edit3,
  Map,
  Plus,
  Share2,
  Trash2,
} from 'lucide-react-native';
import {
  Button,
  Caps,
  Chips,
  Empty,
  IconButton,
  Input,
  Label,
  Page,
  Surface,
} from '../components/TravelUI';
import { RouteMap } from '../components/RouteMap';
import { getPlace, tripTitle, type Stop } from '../data/travel';
import { useTravel } from '../state/TravelContext';
import { moveStop } from '../state/travelState';
import type { Navigation } from '../navigation/types';
const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
export function ItineraryScreen({ nav }: { nav: Navigation }) {
  const { state, update, removeStop } = useTravel();
  const [day, setDay] = useState('Day 2');
  const [edit, setEdit] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const dayNumber = Number(day.slice(-1));
  const stops = state.stops.filter((s) => s.day === dayNumber);
  const move = (stop: Stop, direction: -1 | 1) =>
    update((prev) => moveStop(prev, stop.id, direction));
  return (
    <View className="flex-1">
      <Page className="px-4">
        <View className="mt-3 flex-row items-center justify-between">
          <Caps>CURRENT JOURNEY · 샘플 여정</Caps>
          <View className="flex-row">
            <IconButton
              icon={Edit3}
              label="일정 편집"
              onPress={() => setEdit(!edit)}
            />
            <IconButton
              icon={Share2}
              label="공유 및 동행자"
              onPress={() => nav.go({ name: 'shared' })}
            />
          </View>
        </View>
        <Label className="text-2xl leading-8">{tripTitle}</Label>
        <View className="mb-4 mt-2 flex-row items-center gap-1">
          <CalendarDays size={14} color="#6b5c4a" />
          <Label className="text-[11px] text-secondary">
            2025.10.14 — 10.18 · {state.stops.length}개 장소 · 동행{' '}
            {state.members.filter((m) => !m.pending).length}명
          </Label>
        </View>
        <Chips
          values={days}
          value={day}
          onChange={(value) => {
            setDay(value);
            setEditing(null);
          }}
        />
        <View className="my-4 rounded-xl bg-sand/50 p-4">
          <Caps>{`DAY 0${dayNumber} THEME`}</Caps>
          <Label className="mb-2 text-lg font-semibold">
            {dayNumber === 2
              ? '아라시야마 대나무 숲과 전통 정원 산책'
              : '나만의 고요한 일본 여정'}
          </Label>
          <Label className="text-[13px] leading-5 text-muted">
            새벽 이슬 머금은 대숲길에서 출발하여 고요한 다실과 미식으로 이어지는
            사색의 여정입니다.
          </Label>
        </View>
        {stops.map((stop, index) => {
          const place = getPlace(stop.placeId);
          return (
            <View key={stop.id} className="mb-4 flex-row gap-3">
              <View className="items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-ink">
                  <Label className="text-xs text-white">
                    {String(index + 1).padStart(2, '0')}
                  </Label>
                </View>
                <View className="mt-2 w-px flex-1 bg-sand" />
              </View>
              <View className="flex-1">
                <Surface>
                  <View className="mb-3 flex-row items-center justify-between">
                    <Label className="text-xs text-secondary">
                      {stop.time}
                    </Label>
                    <Label className="rounded bg-stone px-2 py-1 text-[10px] text-secondary">
                      {place.category}
                    </Label>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      nav.go({ name: 'detail', placeId: place.id })
                    }
                    className="flex-row gap-3"
                  >
                    <Image
                      source={place.image}
                      className="h-24 w-20 rounded-lg"
                    />
                    <View className="flex-1">
                      <Label className="text-base font-semibold">
                        {place.title}
                      </Label>
                      <Label className="mt-1 text-[11px] text-secondary">
                        {place.japanese} · {place.city}
                      </Label>
                      <Label className="mt-3 text-[11px]">{place.price}</Label>
                    </View>
                  </Pressable>
                  {!!stop.note && (
                    <Label className="mt-3 rounded-lg bg-stone p-3 text-[12px] leading-5 text-muted">
                      {stop.note}
                    </Label>
                  )}
                  {edit && (
                    <View className="mt-2 flex-row justify-end">
                      <IconButton
                        icon={ChevronUp}
                        label={`${place.title} 위로 이동`}
                        onPress={() => move(stop, -1)}
                      />
                      <IconButton
                        icon={ChevronDown}
                        label={`${place.title} 아래로 이동`}
                        onPress={() => move(stop, 1)}
                      />
                      <IconButton
                        icon={Edit3}
                        label={`${place.title} 시간과 메모 수정`}
                        onPress={() => {
                          setEditing(stop.id);
                          setTime(stop.time);
                          setNote(stop.note);
                        }}
                      />
                      <IconButton
                        icon={Trash2}
                        label={`${place.title} 일정에서 삭제`}
                        onPress={() => removeStop(stop.id)}
                      />
                    </View>
                  )}
                  {editing === stop.id && (
                    <View className="mt-3 gap-2">
                      <Input
                        accessibilityLabel="방문 시간"
                        value={time}
                        onChangeText={setTime}
                      />
                      <Input
                        accessibilityLabel="일정 메모"
                        value={note}
                        onChangeText={setNote}
                        multiline
                      />
                      <Button
                        onPress={() => {
                          update((prev) => ({
                            ...prev,
                            stops: prev.stops.map((s) =>
                              s.id === stop.id
                                ? {
                                    ...s,
                                    time: time.trim() || '시간 미정',
                                    note: note.trim(),
                                  }
                                : s,
                            ),
                          }));
                          setEditing(null);
                        }}
                      >
                        수정 저장
                      </Button>
                    </View>
                  )}
                </Surface>
                {index < stops.length - 1 && (
                  <Label className="mt-3 text-[11px] text-secondary">
                    ↓ 다음 장소로 이동 · 지도에서 실제 경로 확인
                  </Label>
                )}
              </View>
            </View>
          );
        })}
        {!stops.length && (
          <Empty
            text={`${day}에는 아직 장소가 없어요.`}
            onPress={() => nav.go({ name: 'main', tab: '탐색' })}
          />
        )}
        {!!stops.length && (
          <Surface>
            <Label className="mb-3 text-sm font-semibold">
              {day} 이동 동선 미리보기
            </Label>
            <RouteMap stops={stops} small />
            <Button
              secondary
              icon={Map}
              onPress={() => nav.go({ name: 'route', day: dayNumber })}
            >
              상세 지도 핀 보기
            </Button>
          </Surface>
        )}
      </Page>
      <View className="flex-row gap-2 px-4 pb-3">
        <View className="flex-1">
          <Button
            secondary
            icon={Map}
            onPress={() => nav.go({ name: 'route', day: dayNumber })}
          >
            동선 보기
          </Button>
        </View>
        <View className="flex-1">
          <Button
            icon={Plus}
            onPress={() => nav.go({ name: 'main', tab: '탐색' })}
          >
            장소 추가
          </Button>
        </View>
      </View>
    </View>
  );
}
