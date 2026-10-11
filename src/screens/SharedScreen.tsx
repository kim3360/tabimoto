import { useState } from 'react';
import { Image, Pressable, Share, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  Link,
  Map,
  MessageCircle,
  Plus,
  Send,
  Users,
  Wallet,
} from 'lucide-react-native';
import {
  Button,
  Caps,
  Chips,
  Input,
  Label,
  Page,
  Surface,
} from '../components/TravelUI';
import { getPlace, tripTitle } from '../data/travel';
import { useTravel } from '../state/TravelContext';
import { designAssets } from '../data/designAssets';
import type { Navigation } from '../navigation/types';
export function SharedScreen({ nav }: { nav: Navigation }) {
  const { state, update } = useTravel();
  const [day, setDay] = useState('2일차');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const stops = state.stops.filter((s) => s.day === Number(day[0]));
  const share = () =>
    Share.share({
      title: tripTitle,
      message: `${tripTitle}\n${state.stops.map((s) => `Day ${s.day} · ${s.time} · ${getPlace(s.placeId).title}`).join('\n')}`,
    }).catch(() => setMessage('공유 창을 열지 못했습니다.'));
  const vote = (value: 'tea' | 'okonomiyaki') => {
    update((prev) => ({ ...prev, vote: prev.vote === value ? null : value }));
    setMessage('내 선택을 기기에 저장했습니다.');
  };
  return (
    <View className="flex-1">
      <Page className="px-4">
        <View className="my-3">
          <Caps>AUTUMN RETREAT · 협업 미리보기</Caps>
          <Label className="text-[11px] text-secondary">
            2025.10.14 — 10.18 · 4박 5일
          </Label>
          <Label className="my-2 text-2xl leading-8">{tripTitle}</Label>
          <Label className="text-[13px] leading-5 text-muted">
            고요한 선(禪) 정원과 맑은 말차의 계절을 거니는 세 사람의 기록
          </Label>
        </View>
        <View className="mb-4 flex-row items-center gap-2">
          {state.members
            .filter((m) => !m.pending)
            .map((m, i) => (
              <View key={m.id} className="items-center">
                <Image
                  source={
                    i === 0
                      ? designAssets['profile-0']
                      : designAssets[
                          `invite-${Math.min(i, 2)}` as 'invite-1' | 'invite-2'
                        ]
                  }
                  className="h-9 w-9 rounded-full"
                />
                <Label className="mt-1 text-[10px] text-secondary">
                  {m.name}
                </Label>
              </View>
            ))}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="동행자 초대"
            onPress={() => nav.go({ name: 'invite' })}
            className="h-9 w-9 items-center justify-center rounded-full bg-sand"
          >
            <Plus size={18} color="#6b5c4a" />
          </Pressable>
          <Label className="ml-2 flex-1 text-[11px] text-secondary">
            기기에 저장된 동행 설정
          </Label>
        </View>
        <Surface>
          <Caps>SHARED EDIT</Caps>
          <Label className="text-xs leading-5 text-muted">
            이 보드는 협업 화면 미리보기입니다. 내 변경은 기기에 저장되며 다른
            동행자에게 전송되지 않습니다.
          </Label>
        </Surface>
        <View className="my-4 flex-row gap-2">
          {[
            { title: '일정 공유', icon: Link, fn: share },
            {
              title: '권한 관리',
              icon: Users,
              fn: () => nav.go({ name: 'invite' }),
            },
            {
              title: '공동 경비',
              icon: Wallet,
              fn: () => nav.go({ name: 'expenses' }),
            },
          ].map(({ title, icon: Icon, fn }) => (
            <Pressable
              key={title}
              accessibilityRole="button"
              onPress={fn}
              className="flex-1 items-center gap-2 rounded-xl bg-stone p-3"
            >
              <Icon size={20} color="#6b5c4a" />
              <Label className="text-[11px]">{title}</Label>
            </Pressable>
          ))}
        </View>
        <Chips
          values={['1일차', '2일차', '3일차', '4일차', '5일차']}
          value={day}
          onChange={setDay}
        />
        <Label className="my-4 text-xl">교토 자연과 전통의 미학</Label>
        {stops.map((stop, i) => {
          const place = getPlace(stop.placeId);
          return (
            <View key={stop.id} className="mb-4">
              <Surface>
                <View className="mb-2 flex-row justify-between">
                  <Caps>{`${stop.time} · ${place.category}`}</Caps>
                  <Label className="text-[11px] text-secondary">
                    순서 #{i + 1}
                  </Label>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => nav.go({ name: 'detail', placeId: place.id })}
                >
                  <Label className="mb-3 text-lg font-semibold">
                    {place.title}
                  </Label>
                  <Image
                    source={place.image}
                    className="h-40 w-full rounded-lg"
                  />
                </Pressable>
                <Label className="mt-3 text-[13px] leading-6 text-muted">
                  {stop.note || place.description}
                </Label>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => nav.go({ name: 'notes' })}
                  className="mt-3 flex-row items-center gap-1"
                >
                  <MessageCircle size={14} color="#6b5c4a" />
                  <Label className="text-xs text-secondary">메모 추가</Label>
                </Pressable>
              </Surface>
            </View>
          );
        })}
        <View className="my-4 rounded-xl bg-sand/40 p-4">
          <Caps>동행자 투표 미리보기</Caps>
          <Label className="mb-2 text-lg font-semibold">
            15:30 오후 디저트 & 휴식 장소
          </Label>
          <Label className="mb-4 text-[13px] leading-5 text-muted">
            난젠지 산책 후 편안히 쉴 장소를 골라보세요.
          </Label>
          {[
            {
              id: 'tea' as const,
              title: 'A. 카모가와 강변 감성 찻집',
              text: '강바람 뷰 · 말차 파르페와 강물 멍때리기',
              count: 2,
            },
            {
              id: 'okonomiyaki' as const,
              title: 'B. 기온 탄토 오코노미야키',
              text: '노포 감성 · 따뜻한 철판요리',
              count: 0,
            },
          ].map((option) => (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: state.vote === option.id }}
              onPress={() => vote(option.id)}
              className={`mb-3 rounded-xl border p-4 ${state.vote === option.id ? 'border-secondary bg-white' : 'border-stone bg-cream'}`}
            >
              <Label className="text-sm font-semibold">{option.title}</Label>
              <Label className="my-2 text-xs leading-5 text-muted">
                {option.text}
              </Label>
              <View className="flex-row justify-between">
                <Label className="text-xs text-secondary">
                  {option.count + (state.vote === option.id ? 1 : 0)}표 · 샘플
                  응답 포함
                </Label>
                <Label className="text-xs font-semibold">
                  {state.vote === option.id ? '✓ 내 선택' : '여기에 투표'}
                </Label>
              </View>
            </Pressable>
          ))}
        </View>
        <Surface>
          <Caps>동행자 톡 & 피드 미리보기</Caps>
          <Label className="mb-3 text-[13px] leading-5 text-muted">
            민준: 카모가와 찻집으로 가면 일몰 햇살이 예쁠 것 같아요!
          </Label>
          {state.comments.map((text, i) => (
            <View key={i} className="mb-3 rounded-lg bg-stone p-3">
              <Label className="text-[11px] text-secondary">
                나 · 기기 메모
              </Label>
              <Label className="mt-1 text-sm leading-6">{text}</Label>
            </View>
          ))}
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <Input
                accessibilityLabel="동행 보드 메모"
                placeholder="내 메모를 남겨보세요"
                value={comment}
                onChangeText={setComment}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="내 메모 저장"
              disabled={!comment.trim()}
              onPress={() => {
                update((prev) => ({
                  ...prev,
                  comments: [...prev.comments, comment.trim()],
                }));
                setComment('');
              }}
              className="h-12 w-12 items-center justify-center rounded-lg bg-ink"
            >
              <Send size={18} color="#fff" />
            </Pressable>
          </View>
        </Surface>
        {!!message && (
          <Label
            accessibilityLiveRegion="polite"
            className="mt-3 text-xs text-secondary"
          >
            {message}
          </Label>
        )}
        <View className="mt-4 gap-2">
          <Button
            secondary
            onPress={() => {
              Clipboard.setString(
                state.stops
                  .map((s) => `Day ${s.day} ${getPlace(s.placeId).title}`)
                  .join('\n'),
              );
              setMessage('일정 요약을 복사했습니다.');
            }}
          >
            일정 요약 복사
          </Button>
        </View>
      </Page>
      <View className="px-4 pb-3">
        <Button
          icon={Map}
          onPress={() => nav.go({ name: 'route', day: Number(day[0]) })}
        >
          동행자와 지도 동선 보기
        </Button>
      </View>
    </View>
  );
}
