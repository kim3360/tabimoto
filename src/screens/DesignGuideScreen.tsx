import { useState } from 'react';
import { Switch, View } from 'react-native';
import { Map, Plus } from 'lucide-react-native';
import {
  Button,
  Caps,
  Chips,
  Label,
  Page,
  PlaceCard,
  SectionTitle,
  Surface,
} from '../components/TravelUI';
import { places, sampleStops } from '../data/travel';
import { RouteMap } from '../components/RouteMap';
import type { Navigation } from '../navigation/types';
export function DesignGuideScreen({ nav }: { nav: Navigation }) {
  const [chip, setChip] = useState('전체');
  const [enabled, setEnabled] = useState(true);
  return (
    <Page className="px-4">
      <View className="my-4">
        <Caps>RYOKA DESIGN SYSTEM</Caps>
        <Label className="text-2xl">旅香 · 컴포넌트 아카이브</Label>
        <Label className="mt-2 text-sm leading-6 text-muted">
          9개 핵심 화면을 구성하는 공통 스타일과 컴포넌트입니다.
        </Label>
      </View>
      <SectionTitle title="01. 색상 & 타이포그래피" />
      <View className="flex-row gap-2">
        {[
          { name: 'Cream', color: 'bg-cream' },
          { name: 'Ink', color: 'bg-ink' },
          { name: 'Sand', color: 'bg-sand' },
          { name: 'Stone', color: 'bg-stone' },
        ].map((token) => (
          <View key={token.name} className="flex-1">
            <View
              className={`h-16 rounded-xl border border-sand ${token.color}`}
            />
            <Label className="mt-2 text-center text-xs text-secondary">
              {token.name}
            </Label>
          </View>
        ))}
      </View>
      <Label className="my-5 font-editorial text-3xl text-secondary">
        Curated Journey in Japan
      </Label>
      <Label className="text-2xl">고요 속에 머무는 시간</Label>
      <SectionTitle title="02. 버튼, 필터 & 스위치" />
      <View className="gap-3">
        <Button
          icon={Plus}
          onPress={() => nav.go({ name: 'main', tab: '일정' })}
        >
          내 여행 일정에 담기
        </Button>
        <Button
          secondary
          icon={Map}
          onPress={() => nav.go({ name: 'route', day: 2 })}
        >
          동선 미리보기
        </Button>
        <Chips
          values={['전체', '교토', '도쿄', '고즈넉한 료칸']}
          value={chip}
          onChange={setChip}
        />
        <Surface>
          <View className="flex-row justify-between">
            <Label>실시간 푸시 알림 선호</Label>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              accessibilityLabel="컴포넌트 가이드 스위치"
              trackColor={{ false: '#ccc6bd', true: '#6b5c4a' }}
            />
          </View>
        </Surface>
      </View>
      <SectionTitle title="03. 큐레이션 카드" />
      <PlaceCard place={places[0]} nav={nav} />
      <SectionTitle title="04. 공유 & 동행자" />
      <Surface>
        <Caps>SHARED EDIT</Caps>
        <Label className="text-sm leading-6 text-muted">
          공동 편집자 · 일정과 메모 편집{'\n'}뷰어 · 여정 조회 전용
        </Label>
      </Surface>
      <SectionTitle title="05. 지도 핀 & 루트 마커" />
      <RouteMap stops={sampleStops} small />
    </Page>
  );
}
