import { ImageBackground, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Minus, Plus, RotateCcw } from 'lucide-react-native';
import { useState } from 'react';
import { Label } from './HomePrimitives';
import { getPlace, type Stop } from '../data/travel';
const positions = [
  { x: 12, y: 27 },
  { x: 74, y: 40 },
  { x: 54, y: 64 },
  { x: 45, y: 84 },
  { x: 27, y: 55 },
  { x: 82, y: 72 },
];
export function RouteMap({
  stops,
  selected,
  onSelect,
  small = false,
}: {
  stops: Stop[];
  selected?: string;
  onSelect?: (id: string) => void;
  small?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const points = stops
    .slice(0, 6)
    .map((stop, i) => ({ ...positions[i], stop }));
  const path = points.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
  return (
    <View
      className={`overflow-hidden rounded-xl bg-stone ${small ? 'h-44' : 'h-80'}`}
    >
      <ImageBackground
        source={require('../../assets/images/stitch/route-map.jpg')}
        className="absolute inset-0 opacity-60"
        imageStyle={{ transform: [{ scale: zoom }] }}
      />
      <Svg
        className="absolute inset-0"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <Path
          d={path}
          fill="none"
          stroke="#6b5c4a"
          strokeWidth="0.8"
          strokeDasharray="2 1"
        />
      </Svg>
      {points.map(({ x, y, stop }, i) => (
        <Pressable
          key={stop.id}
          accessibilityRole="button"
          accessibilityLabel={`${i + 1}번 ${getPlace(stop.placeId).title}`}
          onPress={() => onSelect?.(stop.id)}
          style={{ left: `${x}%`, top: `${y}%` }}
          className="absolute -ml-4 -mt-4 items-center"
        >
          <View
            className={`h-8 w-8 items-center justify-center rounded-full border-2 border-white ${selected === stop.id ? 'bg-ink' : 'bg-secondary'}`}
          >
            <Label className="text-sm font-semibold text-white">{i + 1}</Label>
          </View>
          {!small && (
            <Label className="mt-1 max-w-24 rounded bg-white/90 px-1 py-0.5 text-[10px]">
              {getPlace(stop.placeId).title}
            </Label>
          )}
        </Pressable>
      ))}
      {!small && (
        <View className="absolute bottom-3 right-3 overflow-hidden rounded-xl bg-white">
          {[
            {
              icon: Plus,
              fn: () => setZoom((z) => Math.min(z + 0.2, 2)),
              label: '지도 배경 확대',
            },
            {
              icon: Minus,
              fn: () => setZoom((z) => Math.max(z - 0.2, 1)),
              label: '지도 배경 축소',
            },
            {
              icon: RotateCcw,
              fn: () => setZoom(1),
              label: '지도 배경 초기화',
            },
          ].map(({ icon: Icon, fn, label }) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={label}
              onPress={fn}
              className="h-10 w-10 items-center justify-center"
            >
              <Icon size={18} color="#6b5c4a" />
            </Pressable>
          ))}
        </View>
      )}
      <Label className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-[10px] text-secondary">
        원본 디자인 동선 미리보기 · 실제 지도는 길찾기에서 열기
      </Label>
    </View>
  );
}
