import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 justify-center px-6">
        <View className="w-full max-w-xl self-center rounded-3xl bg-white p-8">
          <Text className="text-sm font-semibold tracking-widest text-orange-600">
            TABIMOTO
          </Text>
          <Text className="mt-4 text-3xl font-bold leading-tight text-slate-900">
            나만의 일본 여행을 시작하세요
          </Text>
          <Text className="mt-4 text-base leading-7 text-slate-600">
            여행지 탐색부터 지도, 일정 관리, 장소 저장까지.
          </Text>
          <View className="mt-8 rounded-2xl bg-orange-50 p-4">
            <Text className="text-sm font-medium text-orange-800">
              React Native + NativeWind 설정 완료
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
