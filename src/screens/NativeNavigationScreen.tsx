import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationProvider,
  TaskRemovedBehavior,
  NavigationSessionStatus,
  NavigationView,
  RouteStatus,
  TravelMode,
  useNavigation,
} from '@googlemaps/react-native-navigation-sdk';
import {
  openSettings,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import { Button, Label } from '../components/TravelUI';
import { getPlace } from '../data/travel';
import {
  NavigationHeader,
  type NavigationProps as Props,
} from './GoogleNavigationScreen';
export function NativeNavigation(props: Props) {
  const {
    navigationController: controller,
    setOnRawLocationChanged,
    setOnArrival,
    setOnRemainingTimeOrDistanceChanged,
  } = useNavigation();
  const cleanupPending = useRef<Promise<void>>(Promise.resolve());
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState('현재 위치를 확인하고 있습니다.');
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    let canceled = false;
    let resolveLocation: (() => void) | undefined;
    let rejectLocation: ((reason: Error) => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let locationReady = false;
    const dispose = async () => {
      try {
        await controller.stopGuidance();
      } finally {
        await controller.cleanup();
      }
    };
    const run = async () => {
      await cleanupPending.current;
      if (canceled) return;
      setBusy(true);
      setError('');
      setBlocked(false);
      const permission =
        Platform.OS === 'ios'
          ? await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          : (
              await requestMultiple([
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
              ])
            )[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
      if (canceled) return;
      if (permission !== RESULTS.GRANTED) {
        setBlocked(permission === RESULTS.BLOCKED);
        throw new Error(
          '정확한 위치 권한이 필요합니다. 위치 접근을 허용한 뒤 다시 시도해 주세요.',
        );
      }
      const accepted = await controller.showTermsAndConditionsDialog();
      if (canceled) return;
      if (!accepted)
        throw new Error(
          'Google 길찾기 이용 안내에 동의해야 안내를 시작할 수 있습니다.',
        );
      setOnRawLocationChanged(() => {
        locationReady = true;
        resolveLocation?.();
      });
      const session = await controller.init();
      if (canceled) {
        await dispose();
        return;
      }
      if (session !== NavigationSessionStatus.OK)
        throw new Error(
          session === NavigationSessionStatus.NOT_AUTHORIZED
            ? 'Google Maps 키와 Navigation SDK 활성화 설정을 확인해 주세요.'
            : '지도를 시작하지 못했습니다. 네트워크와 위치 설정을 확인해 주세요.',
        );
      setStatus('현재 위치에서 도보 경로를 찾고 있습니다.');
      if (!locationReady)
        await new Promise<void>((resolve, reject) => {
          resolveLocation = resolve;
          rejectLocation = reject;
          timer = setTimeout(
            () =>
              reject(
                new Error(
                  '현재 위치를 찾지 못했습니다. 위치 서비스를 켜고 다시 시도해 주세요.',
                ),
              ),
            30000,
          );
        });
      if (timer) clearTimeout(timer);
      if (canceled) return;
      const place = getPlace(props.placeId);
      const route = await controller.setDestination(
        {
          title: place.title,
          position: {
            lat: place.coordinate.latitude,
            lng: place.coordinate.longitude,
          },
        },
        { routingOptions: { travelMode: TravelMode.WALKING } },
      );
      if (canceled) {
        await dispose();
        return;
      }
      if (route !== RouteStatus.OK)
        throw new Error(
          route === RouteStatus.NO_ROUTE_FOUND
            ? '이 장소까지의 도보 경로를 찾을 수 없습니다.'
            : '경로를 불러오지 못했습니다. 네트워크와 위치 설정을 확인해 주세요.',
        );
      setOnArrival(() => {
        if (!canceled) {
          setStatus('목적지에 도착했습니다.');
          controller.stopGuidance().catch(() => {});
        }
      });
      setOnRemainingTimeOrDistanceChanged(({ meters, seconds }) => {
        if (!canceled)
          setStatus(
            `도보 ${Math.max(1, Math.ceil(seconds / 60))}분 · ${meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${Math.round(meters)}m`} 남음`,
          );
      });
      await controller.startGuidance();
      if (canceled) {
        await dispose();
        return;
      }
      setStatus('도보 경로 안내 중');
      setBusy(false);
    };
    run().catch(async (reason: unknown) => {
      await dispose().catch(() => {});
      if (!canceled) {
        setError(
          reason instanceof Error
            ? reason.message
            : '길찾기를 시작하지 못했습니다.',
        );
        setBusy(false);
      }
    });
    return () => {
      canceled = true;
      if (timer) clearTimeout(timer);
      rejectLocation?.(new Error('안내 종료'));
      setOnRawLocationChanged(null);
      setOnArrival(null);
      setOnRemainingTimeOrDistanceChanged(null);
      cleanupPending.current = dispose().catch(() => {});
    };
  }, [
    attempt,
    controller,
    props.placeId,
    setOnRawLocationChanged,
    setOnArrival,
    setOnRemainingTimeOrDistanceChanged,
  ]);
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <NavigationHeader {...props} />
      <View className="flex-1">
        <NavigationView style={styles.map} />
      </View>
      <View className="gap-2 border-t border-stone bg-cream px-4 py-3">
        {busy && <ActivityIndicator color="#6b5c4a" />}
        <Label accessibilityLiveRegion="polite" className="text-sm leading-6">
          {error || status}
        </Label>
        {!!error && (
          <Button
            onPress={() => {
              if (blocked)
                openSettings().catch(() =>
                  setError('설정 앱에서 위치 권한을 허용해 주세요.'),
                );
              else setAttempt((n) => n + 1);
            }}
          >
            {blocked ? '위치 설정 열기' : '다시 시도'}
          </Button>
        )}
        {blocked && (
          <Button secondary onPress={() => setAttempt((n) => n + 1)}>
            권한 확인 후 다시 시도
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ map: { flex: 1 } });

const termsOptions = {
  title: '길찾기 이용 안내',
  companyName: 'RYOKA',
  showOnlyDisclaimer: false,
};
export function ConfiguredNavigation(props: Props) {
  return (
    <NavigationProvider
      termsAndConditionsDialogOptions={termsOptions}
      taskRemovedBehavior={TaskRemovedBehavior.QUIT_SERVICE}
    >
      <NativeNavigation {...props} />
    </NavigationProvider>
  );
}
