import { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bookmark,
  CalendarDays,
  CircleUserRound,
  Compass,
  House,
} from 'lucide-react-native';
import { Header, Label } from '../components/TravelUI';
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { ItineraryScreen } from '../screens/ItineraryScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { GoogleNavigationScreen } from '../screens/GoogleNavigationScreen';
import { RouteScreen } from '../screens/RouteScreen';
import { SharedScreen } from '../screens/SharedScreen';
import { InviteScreen } from '../screens/InviteScreen';
import { DesignGuideScreen } from '../screens/DesignGuideScreen';
import {
  ExpensesScreen,
  NotesScreen,
  NotificationsScreen,
  SettingsScreen,
} from '../screens/UtilityScreens';
import { useTravel } from '../state/TravelContext';
import type { Navigation, Route, Tab } from './types';
const tabs = [
  { name: '홈', icon: House },
  { name: '탐색', icon: Compass },
  { name: '일정', icon: CalendarDays },
  { name: '저장', icon: Bookmark },
  { name: '마이', icon: CircleUserRound },
] as const;
const titles = {
  detail: 'Ryokan Detail',
  route: '동선 지도',
  shared: 'Shared Itinerary',
  invite: 'Invite Companions',
  guide: 'RYOKA UI Guide',
  expenses: '공동 경비',
  notes: '여행 노트',
  settings: '앱 설정',
  notifications: '알림',
};
export function AppNavigator() {
  const { ready, storageError } = useTravel();
  const [tab, setTab] = useState<Tab>('홈');
  const [stack, setStack] = useState<Route[]>([]);
  const [explore, setExplore] = useState({
    query: '',
    city: '',
    category: '전체',
    version: 0,
  });
  const route = stack[stack.length - 1];
  const back = () => setStack((prev) => prev.slice(0, -1));
  const nav: Navigation = {
    back,
    go: (next) => {
      if (next.name === 'main') {
        setStack([]);
        setTab(next.tab);
        if (next.tab === '탐색')
          setExplore((prev) => ({
            query: next.query || '',
            city: next.city || '',
            category: next.category || '전체',
            version: prev.version + 1,
          }));
      } else setStack((prev) => [...prev, next]);
    },
  };
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (stack.length) {
          setStack((prev) => prev.slice(0, -1));
          return true;
        }
        if (tab !== '홈') {
          setTab('홈');
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [stack.length, tab]);
  if (!ready)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator color="#6b5c4a" />
        <Label className="mt-3 text-sm text-secondary">
          여정을 불러오는 중...
        </Label>
      </SafeAreaView>
    );
  if (route?.name === 'navigation')
    return <GoogleNavigationScreen nav={nav} placeId={route.placeId} />;
  const currentTab = route?.name === 'main' ? route.tab : tab;
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <Header
        nav={nav}
        title={route && route.name !== 'main' ? titles[route.name] : undefined}
      />
      {!!storageError && (
        <Label
          accessibilityLiveRegion="polite"
          className="bg-sand px-4 py-2 text-xs"
        >
          {storageError}
        </Label>
      )}
      <View className="flex-1">
        {!route || route.name === 'main' ? (
          currentTab === '홈' ? (
            <HomeScreen nav={nav} />
          ) : currentTab === '탐색' ? (
            <ExploreScreen
              key={explore.version}
              nav={nav}
              initialQuery={explore.query}
              initialCity={explore.city}
              initialCategory={explore.category}
            />
          ) : currentTab === '일정' ? (
            <ItineraryScreen nav={nav} />
          ) : currentTab === '저장' ? (
            <SavedScreen nav={nav} />
          ) : (
            <ProfileScreen nav={nav} />
          )
        ) : route.name === 'detail' ? (
          <DetailScreen nav={nav} placeId={route.placeId} />
        ) : route.name === 'route' ? (
          <RouteScreen nav={nav} day={route.day} />
        ) : route.name === 'shared' ? (
          <SharedScreen nav={nav} />
        ) : route.name === 'invite' ? (
          <InviteScreen nav={nav} />
        ) : route.name === 'guide' ? (
          <DesignGuideScreen nav={nav} />
        ) : route.name === 'expenses' ? (
          <ExpensesScreen />
        ) : route.name === 'notes' ? (
          <NotesScreen />
        ) : route.name === 'settings' ? (
          <SettingsScreen />
        ) : (
          <NotificationsScreen />
        )}
      </View>
      {!route && (
        <View className="h-16 flex-row border-t border-stone">
          {tabs.map(({ name, icon: Icon }) => (
            <Pressable
              key={name}
              accessibilityRole="tab"
              accessibilityLabel={name}
              accessibilityState={{ selected: tab === name }}
              onPress={() => {
                setTab(name);
              }}
              className="flex-1 items-center justify-center gap-1"
            >
              <Icon
                size={22}
                strokeWidth={1.5}
                color={tab === name ? '#1b1c1a' : '#7b766f'}
              />
              <Label
                className={`text-[11px] ${tab === name ? 'text-ink' : 'text-secondary'}`}
              >
                {name}
              </Label>
            </Pressable>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}
