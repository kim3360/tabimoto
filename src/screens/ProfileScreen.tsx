import { useState } from 'react';
import { Image, ImageBackground, Linking, Pressable, View } from 'react-native';
import {
  CalendarDays,
  Map,
  NotebookPen,
  Settings,
  Users,
  Wallet,
} from 'lucide-react-native';
import {
  Button,
  Caps,
  Fade,
  Input,
  Label,
  Page,
  Row,
  SectionTitle,
  Surface,
} from '../components/TravelUI';
import { designAssets } from '../data/designAssets';
import { useTravel } from '../state/TravelContext';
import type { Navigation } from '../navigation/types';
export function ProfileScreen({ nav }: { nav: Navigation }) {
  const { state, update } = useTravel();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(state.name);
  const [tag, setTag] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  return (
    <Page className="px-4">
      <View className="mb-5 mt-3 flex-row items-center gap-4">
        <Image
          source={designAssets['profile-0']}
          className="h-16 w-16 rounded-full"
        />
        <View className="flex-1">
          <Caps>MY PROFILE</Caps>
          <Label className="text-2xl font-semibold">{state.name}</Label>
          <Label className="mt-1 text-[11px] text-secondary">
            RYOKA · 로컬 여행 프로필
          </Label>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setEdit(!edit)}
          className="rounded-full bg-stone px-3 py-2"
        >
          <Label className="text-xs">수정</Label>
        </Pressable>
      </View>
      {edit && (
        <View className="mb-4 gap-2">
          <Input
            accessibilityLabel="프로필 이름"
            value={name}
            onChangeText={setName}
            maxLength={30}
          />
          <Button
            disabled={!name.trim()}
            onPress={() => {
              update((prev) => ({
                ...prev,
                name: name.trim(),
                members: prev.members.map((m) =>
                  m.id === 'owner' ? { ...m, name: name.trim() } : m,
                ),
              }));
              setEdit(false);
            }}
          >
            이름 저장
          </Button>
        </View>
      )}
      <View className="mb-5 flex-row rounded-xl bg-stone py-4">
        {[
          { label: '일정 장소', value: state.stops.length },
          {
            label: '여행 메모',
            value: Object.keys(state.notes).length + state.comments.length,
          },
          { label: '보관 취향', value: state.saved.length },
          { label: '동행 설정', value: state.members.length },
        ].map((item) => (
          <View key={item.label} className="flex-1 items-center">
            <Label className="text-[11px] text-secondary">{item.label}</Label>
            <Label className="mt-1 text-xl">{item.value}</Label>
          </View>
        ))}
      </View>
      <SectionTitle title="다가오는 여정" subtitle="MY QUIET JOURNEY" />
      <Pressable
        accessibilityRole="button"
        onPress={() => nav.go({ name: 'main', tab: '일정' })}
        className="mb-4 overflow-hidden rounded-xl bg-white"
      >
        <ImageBackground source={designAssets['profile-1']} className="h-48">
          <Fade />
          <View className="absolute bottom-4 left-4">
            <Caps>교토 · 히가시야마</Caps>
            <Label className="text-xl font-semibold text-white">
              2박 3일 힐링 리트릿
            </Label>
            <Label className="mt-1 text-xs text-white">
              소소안 히가시야마 별제
            </Label>
          </View>
        </ImageBackground>
        <View className="p-4">
          <Label className="text-xs text-secondary">
            2025.10.14 — 10.18 · 샘플 여행
          </Label>
          <Label className="mt-2 text-sm">
            예약 화면 미리보기 · 실제 예약 없음
          </Label>
        </View>
      </Pressable>
      <View className="mb-5 flex-row gap-2">
        <View className="flex-1">
          <Button
            secondary
            icon={CalendarDays}
            onPress={() => nav.go({ name: 'main', tab: '일정' })}
          >
            일정표 상세
          </Button>
        </View>
        <View className="flex-1">
          <Button
            secondary
            icon={Map}
            onPress={() => nav.go({ name: 'route', day: 2 })}
          >
            동선 및 길찾기
          </Button>
        </View>
      </View>
      <SectionTitle title="나의 여행 취향" subtitle="PERSONAL CURATION" />
      <Surface>
        <Label className="mb-3 text-[13px] leading-6 text-muted">
          조용한 정원 산책과 계절 제철 미식 중심의 여정. 나의 취향 태그를
          담아보세요.
        </Label>
        <View className="flex-row flex-wrap gap-2">
          {state.tags.map((value) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityLabel={`${value} 취향 태그 삭제`}
              onPress={() =>
                update((prev) => ({
                  ...prev,
                  tags: prev.tags.filter((t) => t !== value),
                }))
              }
              className="rounded-full bg-stone px-3 py-2"
            >
              <Label className="text-[11px] text-secondary">#{value} ×</Label>
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setAdding(!adding)}
          className="mt-3"
        >
          <Label className="text-xs text-secondary">+ 취향 태그 추가</Label>
        </Pressable>
        {adding && (
          <View className="mt-3 gap-2">
            <Input
              accessibilityLabel="여행 취향 태그"
              value={tag}
              onChangeText={setTag}
              placeholder="예: 조용한찻집"
            />
            <Button
              disabled={!tag.trim()}
              secondary
              onPress={() => {
                const value = tag.trim().replace(/^#/, '');
                if (value)
                  update((prev) => ({
                    ...prev,
                    tags: [...new Set([...prev.tags, value])],
                  }));
                setTag('');
                setAdding(false);
              }}
            >
              취향 저장
            </Button>
          </View>
        )}
      </Surface>
      <SectionTitle title="여행 편의 도구" subtitle="TRAVEL DESK" />
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {[
          {
            title: '비짓재팬 웹',
            subtitle: '공식 입국 절차 사이트',
            icon: CalendarDays,
            fn: () =>
              Linking.openURL('https://www.vjw.digital.go.jp/').catch(() =>
                setError('웹사이트를 열지 못했습니다.'),
              ),
          },
          {
            title: '여행 메모',
            subtitle: '기기에 보관하는 기록',
            icon: NotebookPen,
            fn: () => nav.go({ name: 'notes' }),
          },
          {
            title: '공동 경비',
            subtitle: '엔화 지출 간편 정산',
            icon: Wallet,
            fn: () => nav.go({ name: 'expenses' }),
          },
          {
            title: '교토 동선 지도',
            subtitle: '지도 앱 길찾기 연결',
            icon: Map,
            fn: () => nav.go({ name: 'route', day: 2 }),
          },
        ].map(({ title, subtitle, icon: Icon, fn }) => (
          <Pressable
            key={title}
            accessibilityRole="button"
            onPress={fn}
            className="w-[48%] rounded-xl bg-white p-4"
          >
            <Icon size={24} color="#6b5c4a" />
            <Label className="mb-1 mt-3 text-sm font-semibold">{title}</Label>
            <Label className="text-[11px] leading-5 text-secondary">
              {subtitle}
            </Label>
          </Pressable>
        ))}
      </View>
      <SectionTitle title="여정 및 계정 관리" />
      <Surface>
        <Row
          title="함께 만드는 여행 보드"
          subtitle="일정 공유, 투표와 동행자 설정 미리보기"
          icon={Users}
          onPress={() => nav.go({ name: 'shared' })}
        />
        <Row
          title="나만의 일본 여행 노트"
          subtitle="료칸 리뷰 및 온천 메모"
          icon={NotebookPen}
          onPress={() => nav.go({ name: 'notes' })}
        />
        <Row
          title="앱 설정 및 알림"
          subtitle="기기 저장 데이터와 여행 설정"
          icon={Settings}
          onPress={() => nav.go({ name: 'settings' })}
        />
        <Row
          title="RYOKA 컴포넌트 가이드"
          subtitle="원본 디자인 시스템을 옮긴 공통 UI"
          onPress={() => nav.go({ name: 'guide' })}
        />
      </Surface>
      {!!error && (
        <Label className="my-3 text-xs text-secondary">{error}</Label>
      )}
      <View className="items-center py-8">
        <Caps>RYOKA HOSPITALITY CLUB</Caps>
        <Label className="text-[11px] text-secondary">
          버전 1.0.0 · 샘플 여정과 나만의 기기 기록
        </Label>
      </View>
    </Page>
  );
}
