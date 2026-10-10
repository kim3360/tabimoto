# tabimoto

한국인 여행객을 위한 일본 여행 플래너 — 여행지 탐색부터 지도, 일정 관리, 장소 저장까지

## 기술 구성

- React Native 0.86.3 + React Native Community CLI
- TypeScript (strict 모드)
- NativeWind 4 + Tailwind CSS 3
- Reanimated 4 + Worklets
- ESLint + Prettier (Tailwind 클래스 자동 정렬)
- 패키지 관리: npm (`package-lock.json` 포함)

## 개발 환경

- Node.js 22 LTS (22.13.0 이상), npm. `.nvmrc`는 22.17.0입니다.
- iOS: macOS, Xcode 16.1 이상, iOS 시뮬레이터, Ruby와 Bundler. 앱 최소 지원 버전은 iOS 15.1입니다.
- Android: Android Studio, JDK 17, Android SDK Platform 36, Build Tools 36.0.0, NDK 27.1.12297006. 에뮬레이터 또는 USB 디버깅을 활성화한 기기가 필요합니다.
- Watchman 설치를 권장합니다.

Android 개발 환경에서는 `JAVA_HOME`, `ANDROID_HOME`과 SDK의 `platform-tools` 경로를 설정하세요.
환경 구성은 [React Native 공식 가이드](https://reactnative.dev/docs/set-up-your-environment)를 참고하세요.

## 시작하기

```sh
npm ci
```

iOS를 처음 실행하거나 네이티브 의존성을 변경했을 때는 CocoaPods를 설치합니다.
Ruby 의존성은 프로젝트의 `vendor/bundle/`에 설치됩니다.

```sh
bundle install
cd ios
bundle exec pod install
cd ..
```

먼저 Metro 개발 서버를 실행합니다.

```sh
npm start
```

다른 터미널에서 앱을 실행합니다.

```sh
npm run ios
# 또는
npm run android
```

특정 iOS 시뮬레이터는 `npm run ios -- --simulator="기기 이름"`으로 선택할 수 있습니다.
Xcode에서 직접 실행할 때는 Pods 설치 후 생성된 `ios/Tabimoto.xcworkspace`를 엽니다.

## 개발 명령

| 명령                      | 설명                              |
| ------------------------- | --------------------------------- |
| `npm start`               | Metro 개발 서버 실행              |
| `npm run ios`             | iOS 앱 빌드 및 실행               |
| `npm run android`         | Android 앱 빌드 및 실행           |
| `npm run start:clear`     | Metro 캐시 초기화 후 실행         |
| `npm run typecheck`       | TypeScript 타입 검사              |
| `npm run lint`            | ESLint 검사                       |
| `npm run format`          | 코드 포맷 및 Tailwind 클래스 정렬 |
| `npm run format:check`    | 포맷 검사                         |
| `npx react-native doctor` | 로컬 개발 환경 진단               |

## 프로젝트 구조

```text
index.js                 # AppRegistry 앱 등록
App.tsx                  # 전역 CSS, SafeAreaProvider, 시작 화면
src/
  screens/
    HomeScreen.tsx       # NativeWind 스타일이 적용된 시작 화면
  types/
    styles.d.ts          # CSS 모듈 타입
ios/                     # Xcode 프로젝트, Podfile, Swift 진입점
android/                 # Gradle 프로젝트, Kotlin 진입점
app.json                 # 앱 등록 이름과 표시 이름
global.css               # Tailwind CSS 지시문
tailwind.config.js       # 스타일 토큰과 클래스 탐색 경로
babel.config.js          # React Native, NativeWind, Worklets 변환
metro.config.js          # React Native Metro + NativeWind
nativewind-env.d.ts      # className 타입 지원
Gemfile                  # CocoaPods와 Ruby 의존성
```

`ios/`, `android/`는 Git으로 관리하며 네이티브 설정을 직접 수정할 수 있습니다.
Pods, 네이티브 빌드 결과, 로컬 SDK 경로와 서명 키는 Git에서 제외됩니다.
기본 앱 아이콘과 개발용 앱 식별자는 출시 전에 각 네이티브 프로젝트에서 변경하세요.

## 스타일 작성

React Native 컴포넌트에 `className`으로 스타일을 적용합니다.

```tsx
import { Text, View } from 'react-native';

export function Example() {
  return (
    <View className="rounded-2xl bg-white p-6">
      <Text className="text-xl font-bold text-slate-900">여행 일정</Text>
    </View>
  );
}
```

새 화면과 공통 컴포넌트는 `src/` 아래에 추가하면 클래스가 자동으로 탐색됩니다.
다른 경로에 파일을 추가할 때는 `tailwind.config.js`의 `content`도 수정하세요.
클래스 이름은 `bg-${color}-500`처럼 조합하지 않고 `bg-orange-500`처럼 완전한 문자열로 작성합니다.
NativeWind 또는 Babel 설정을 변경한 뒤에는 `npm run start:clear`로 재시작하세요.

## 참고 문서

- [React Native CLI 시작하기](https://reactnative.dev/docs/getting-started-without-a-framework)
- [NativeWind CLI 설치](https://www.nativewind.dev/docs/getting-started/installation/frameworkless)
- [Reanimated CLI 설정](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)

## RYOKA 홈 화면

Stitch 원본 홈 디자인의 사진, 크림색 배경, 에디토리얼 제목, 가로 카드 목록과 하단 메뉴를 React Native + NativeWind로 구현했습니다.

- 검색어·카테고리·도시로 큐레이션된 장소를 탐색합니다.
- 장소 상세에서 저장하거나 내 일정에 추가할 수 있습니다.
- 저장과 일정은 앱 실행 중의 로컬 상태입니다. 재실행 시 초기화되며 예약·로그인·백엔드는 연결되지 않았습니다.
- 사진은 `assets/images/`, Playfair Display 제목 글꼴과 OFL 라이선스는 `assets/fonts/`에 포함됩니다. 네트워크 이미지 로딩 없이 표시됩니다.
- 원본 화면: Stitch 프로젝트 `15104297020985350947`, 화면 `d4f7c5146c0b409ba012e21e66bfaba4`.
- API 키는 앱 코드나 설정에 포함하지 않습니다.
