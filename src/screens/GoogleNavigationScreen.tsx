import { lazy, Suspense } from 'react';
import { ActivityIndicator, NativeModules, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Button, IconButton, Label } from '../components/TravelUI';
import { googleMapsConfigured } from '../config/googleMaps.generated';
import { getPlace } from '../data/travel';
import type { Navigation } from '../navigation/types';

const NativeScreen = lazy(() =>
  import('./NativeNavigationScreen').then((module) => ({
    default: module.ConfiguredNavigation,
  })),
);

export type NavigationProps = { nav: Navigation; placeId: string };
export function GoogleNavigationScreen(props: NavigationProps) {
  const configured =
    Platform.OS === 'ios'
      ? googleMapsConfigured.ios
      : googleMapsConfigured.android;
  const nativeSdkAvailable = !!NativeModules.NavModule;
  if (!configured || !nativeSdkAvailable) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <NavigationHeader {...props} />
        <View className="flex-1 justify-center gap-4 px-6">
          <Label className="text-2xl font-semibold">길찾기 준비 중</Label>
          <Label className="text-base leading-7 text-secondary">
            {configured
              ? '지도 키 설정이 완료되었습니다. 지도 기능을 적용하려면 앱을 다시 빌드해 주세요.'
              : 'Google Maps 연결 설정이 필요합니다. 설정이 완료되면 이 화면에서 전체 화면 지도와 경로 안내를 사용할 수 있어요.'}
          </Label>
          <Label className="text-sm text-secondary">
            {getPlace(props.placeId).title}까지 안내
          </Label>
          <Button onPress={props.nav.back}>동선으로 돌아가기</Button>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <Suspense
      fallback={
        <SafeAreaView className="flex-1 items-center justify-center bg-cream">
          <ActivityIndicator color="#6b5c4a" />
        </SafeAreaView>
      }
    >
      <NativeScreen {...props} />
    </Suspense>
  );
}
export function NavigationHeader({ nav, placeId }: NavigationProps) {
  return (
    <View className="h-16 flex-row items-center bg-cream px-3">
      <IconButton icon={ChevronLeft} label="길찾기 종료" onPress={nav.back} />
      <View className="flex-1">
        <Label className="text-base font-semibold">길찾기</Label>
        <Label numberOfLines={1} className="text-xs text-secondary">
          {getPlace(placeId).title} · 도보
        </Label>
      </View>
    </View>
  );
}
