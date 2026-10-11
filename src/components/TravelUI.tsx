import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from 'react-native';
import {
  Bell,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Search,
  Share2,
  Star,
  UserRound,
  type LucideIcon,
} from 'lucide-react-native';
import { Fade, IconButton, Label } from './HomePrimitives';
import { type Place } from '../data/travel';
import { useTravel } from '../state/TravelContext';
import type { Navigation } from '../navigation/types';
export { Label, IconButton, Fade };
export function Page({
  children,
  className = '',
}: ViewProps & { className?: string }) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      className="flex-1"
      contentContainerClassName={`pb-6 ${className}`}
    >
      {children}
    </ScrollView>
  );
}
export function Header({ nav, title }: { nav: Navigation; title?: string }) {
  return (
    <View className="h-16 flex-row items-center justify-between px-4">
      {title ? (
        <View className="flex-1 flex-row items-center gap-1">
          <IconButton icon={ChevronLeft} label="이전 화면" onPress={nav.back} />
          <Label numberOfLines={1} className="flex-1 text-base font-semibold">
            {title}
          </Label>
        </View>
      ) : (
        <View className="flex-row items-center gap-2">
          <Image
            source={require('../../assets/images/ryoka-crest.jpg')}
            className="h-8 w-8"
          />
          <Label className="text-xl font-semibold tracking-[2px]">RYOKA</Label>
          <Label className="text-[11px] text-secondary">旅香</Label>
        </View>
      )}
      <View className="flex-row items-center">
        <IconButton
          icon={title ? Share2 : Search}
          label={title ? '여행 공유 화면' : '검색'}
          onPress={() =>
            nav.go(title ? { name: 'shared' } : { name: 'main', tab: '탐색' })
          }
        />
        {!title && (
          <IconButton
            icon={Bell}
            label="알림"
            onPress={() => nav.go({ name: 'notifications' })}
          />
        )}
        <IconButton
          icon={UserRound}
          label="마이 페이지"
          dark
          onPress={() => nav.go({ name: 'main', tab: '마이' })}
        />
      </View>
    </View>
  );
}
export function Button({
  children,
  onPress,
  icon: Icon,
  secondary = false,
  disabled = false,
}: {
  children: string;
  onPress: () => void;
  icon?: LucideIcon;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 ${disabled ? 'bg-stone' : secondary ? 'bg-sand' : 'bg-ink'}`}
    >
      {Icon && (
        <Icon size={18} color={secondary || disabled ? '#6b5c4a' : '#fff'} />
      )}
      <Label
        className={`text-[13px] font-medium ${secondary || disabled ? 'text-secondary' : 'text-white'}`}
      >
        {children}
      </Label>
    </Pressable>
  );
}
export function Caps({ children }: { children: string }) {
  return (
    <Label className="mb-1 text-[11px] font-semibold tracking-[1.3px] text-secondary">
      {children}
    </Label>
  );
}
export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-4 mt-5">
      {subtitle && <Caps>{subtitle}</Caps>}
      <Label className="text-2xl leading-8">{title}</Label>
    </View>
  );
}
export function Chips({
  values,
  value,
  onChange,
}: {
  values: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 py-2"
    >
      {values.map((item) => (
        <Pressable
          key={item}
          accessibilityRole="button"
          accessibilityState={{ selected: item === value }}
          onPress={() => onChange(item)}
          className={`rounded-full px-3 py-2 ${item === value ? 'bg-ink' : 'bg-stone'}`}
        >
          <Label
            className={`text-[11px] ${item === value ? 'text-white' : 'text-muted'}`}
          >
            {item}
          </Label>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="#918b83"
      {...props}
      className="min-h-12 rounded-lg bg-stone px-3 text-sm text-ink"
    />
  );
}
export function Surface({ children }: ViewProps) {
  return <View className="rounded-xl bg-white p-4">{children}</View>;
}
export function Empty({
  text,
  onPress,
}: {
  text: string;
  onPress?: () => void;
}) {
  return (
    <View className="items-center gap-4 py-12">
      <Bookmark size={28} color="#6b5c4a" />
      <Label className="text-center text-sm leading-6 text-muted">{text}</Label>
      {onPress && <Button onPress={onPress}>여정 둘러보기</Button>}
    </View>
  );
}
export function PlaceCard({
  place,
  nav,
  selection,
  onSelect,
  onAdd,
}: {
  place: Place;
  nav: Navigation;
  selection?: boolean;
  onSelect?: () => void;
  onAdd?: () => void;
}) {
  const { state, toggleSaved } = useTravel();
  return (
    <View className="mb-6 overflow-hidden rounded-xl bg-white">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${place.title} 상세 보기`}
        onPress={() => nav.go({ name: 'detail', placeId: place.id })}
      >
        <ImageBackground source={place.image} className="h-56">
          <Fade />
          <View className="absolute left-3 top-3 rounded-full bg-sand px-3 py-1">
            <Label className="text-[11px] text-secondary">{place.badge}</Label>
          </View>
          <View className="absolute bottom-3 left-3 right-3">
            <Label className="text-[11px] text-white">{place.access}</Label>
          </View>
        </ImageBackground>
        <View className="p-4">
          <Caps>{place.english}</Caps>
          <View className="flex-row items-center justify-between gap-2">
            <Label className="flex-1 text-xl font-semibold">
              {place.title}
            </Label>
            {!!place.rating && (
              <View className="flex-row items-center gap-1">
                <Star size={12} fill="#6b5c4a" color="#6b5c4a" />
                <Label className="text-xs font-semibold">{place.rating}</Label>
              </View>
            )}
          </View>
          <Label className="mb-2 text-xs text-secondary">
            {place.japanese}
          </Label>
          <Label numberOfLines={3} className="text-[13px] leading-5 text-muted">
            {place.description}
          </Label>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {place.tags.map((tag) => (
              <Label
                key={tag}
                className="rounded bg-stone px-2 py-1 text-[11px] text-secondary"
              >
                #{tag}
              </Label>
            ))}
          </View>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          state.saved.includes(place.id)
            ? `${place.title} 저장 취소`
            : `${place.title} 저장`
        }
        onPress={() => toggleSaved(place.id)}
        className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-white/90"
      >
        <Bookmark
          size={18}
          color="#1b1c1a"
          fill={state.saved.includes(place.id) ? '#1b1c1a' : 'none'}
        />
      </Pressable>
      <View className="flex-row items-center justify-between border-t border-stone px-4 py-3">
        <Label className="text-sm font-semibold">{place.price}</Label>
        {onSelect ? (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selection }}
            onPress={onSelect}
            className={`rounded-full px-3 py-2 ${selection ? 'bg-sand' : 'bg-stone'}`}
          >
            <Label className="text-xs">
              {selection ? '✓ 선택됨' : '선택하기'}
            </Label>
          </Pressable>
        ) : (
          <Label className="text-[11px] text-secondary">디자인 예시</Label>
        )}
        {onAdd && (
          <Pressable
            accessibilityRole="button"
            onPress={onAdd}
            className="rounded-lg bg-stone px-3 py-2"
          >
            <Label className="text-xs">+ 일정 추가</Label>
          </Pressable>
        )}
      </View>
    </View>
  );
}
export function Row({
  title,
  subtitle,
  onPress,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: LucideIcon;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-16 flex-row items-center gap-3 border-b border-stone py-4"
    >
      {Icon && <Icon size={22} color="#6b5c4a" />}
      <View className="flex-1">
        <Label className="text-sm font-semibold">{title}</Label>
        {subtitle && (
          <Label className="mt-1 text-[11px] text-secondary">{subtitle}</Label>
        )}
      </View>
      <ChevronRight size={16} color="#7b766f" />
    </Pressable>
  );
}
