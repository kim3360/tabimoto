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
    HomeScreen.tsx       # 에디토리얼 홈 화면
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

## RYOKA 화면 구성

Stitch 프로젝트 `15104297020985350947`의 9개 앱 화면과 UI 컴포넌트 가이드를 React Native CLI + NativeWind로 옮겼습니다. API 키는 앱 코드와 Git에 포함하지 않습니다.

| 화면               | 연결된 기능                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| 홈                 | 원본 이미지, 에디토리얼 제목, 추천 카드, 도시·취향 탐색                |
| 여행지 탐색        | 검색, 도시·카테고리 필터, 평점 정렬, 장소 저장                         |
| 여행지 상세        | 사진 갤러리, 저장, 날짜 선택 후 일정 추가, 시스템 공유, 지도 앱 길찾기 |
| 여행 일정          | 5일 탭, 장소 순서 변경·삭제, 시간과 메모 편집                          |
| 저장한 장소        | 카테고리·폴더 필터, 선택한 장소의 폴더 생성, 일정 추가                 |
| 마이 페이지        | 이름과 취향 편집, 여행 메모·경비·설정 연결                             |
| 지도 동선          | 원본 지도 배경과 선택 가능한 핀, 앱 내부 Google 길찾기 연결            |
| 공유 보드          | 일정 공유·복사, 기기에 저장하는 투표와 메모, 경비 정산                 |
| 친구 초대          | 미리보기 링크 복사·공유·QR, 동행자와 권한·선호 설정                    |
| UI 컴포넌트 가이드 | 마이 페이지에서 색상, 글꼴, 버튼, 필터와 공통 카드 확인                |

`TravelProvider`가 저장·일정·폴더·프로필·투표·메모·경비·동행자 설정을 공유하며 AsyncStorage로 기기에 보관합니다. 화면 간 저장 상태가 즉시 반영되고 재실행 후 복원됩니다. Android 뒤로가기와 하위 화면 돌아가기를 지원합니다.

원본 디자인을 확인할 수 있도록 첫 실행에는 2025년 교토 샘플 여행과 저장 장소 4개가 표시됩니다. 마이 → 앱 설정에서 샘플 데이터로 초기화할 수 있습니다. 원본 디자인의 가격·운영시간·리뷰는 예시로 표시하며, 실제 예약·바우처·로그인·실시간 협업·초대 전송·환율 서비스는 연결하지 않았습니다. 일정 지도는 디자인 동선 미리보기입니다. “길찾기 시작”은 앱 내부 Google Navigation SDK 화면을 열며, 현재 위치에서 선택한 장소까지 도보 안내합니다. Google Maps 키가 없으면 연결 설정 안내를 표시합니다.

사진과 지도 배경은 `assets/images/stitch/`, 제목 글꼴과 OFL 라이선스는 `assets/fonts/`에 포함됩니다. 공통 UI는 `src/components/`, 화면은 `src/screens/`, 화면 이동은 `src/navigation/`, 기기 저장 모델은 `src/state/`에 있습니다.

```sh
npm test                 # 저장 데이터 검증, 날짜별 중복 방지, 일정 순서 변경 검사
npm run typecheck
npm run lint
npm run format:check
```

새 네이티브 라이브러리가 추가되어 iOS 실행 전 `cd ios && bundle exec pod install`이 필요합니다.

## 앱 내부 Google 지도와 길찾기 설정

1. Google Cloud 프로젝트에 결제를 연결하고 **Navigation SDK for Android**, **Navigation SDK for iOS**를 활성화합니다. 플랫폼별 키를 만들고 Android는 앱 패키지 `com.tabimoto`와 서명 SHA-1, iOS는 실제 Bundle ID에 제한합니다. Stitch 키는 사용할 수 없습니다.
2. 프로젝트 루트의 `.env`에 아래 키를 입력합니다. 파일이 없으면 `.env.example`을 복사하세요. `.env`와 생성된 키 파일은 Git에 포함되지 않습니다. CI에서는 같은 이름의 환경변수를 사용할 수 있습니다.

   ```dotenv
   GOOGLE_MAPS_IOS_API_KEY=여기에_iOS용_키
   GOOGLE_MAPS_ANDROID_API_KEY=여기에_Android용_키
   ```

   비어 있지 않은 값은 실행 환경변수 → `.env` → 기존 `config/google-maps.local.json` 순서로 적용됩니다. 기존 JSON 설정도 호환되지만 새 설정은 `.env`를 사용하세요. 키는 JavaScript 코드에 포함하지 않고 네이티브 설정에만 전달합니다.

3. `npm run maps:configure`를 실행합니다. 네이티브 키 파일과 키 포함 여부만 담긴 앱 설정이 생성됩니다. `npm install`, `npm run ios`, `npm run android`에서도 자동 실행됩니다. 키 변경 후 앱을 다시 빌드하세요.
4. iOS 빌드에는 **Xcode 26 이상**이 필요합니다. 현재 Xcode 16.4에서는 GoogleNavigation의 `UIGlassEffect` 링크 오류가 발생합니다. [Google 요구사항](https://developers.google.com/maps/documentation/navigation/ios-sdk/release-notes)을 참고하세요. iOS는 `ios` 폴더에서 `bundle exec pod install` 후 실행합니다. Google Navigation SDK 적용으로 최소 iOS 버전은 **16.0**입니다. Android는 최소 API 24입니다.

길찾기 화면은 WebView와 외부 Google Maps 앱을 사용하지 않습니다. Google 이용 안내 동의와 정확한 위치 권한 확인 후 네이티브 전체 화면 지도에서 경로를 계산하고 안내합니다. 뒤로 돌아가면 안내 세션을 종료합니다. 위치 권한 거절, 위치 조회 실패, 네트워크 오류, 경로 없음에 대한 안내와 재시도를 제공합니다. 실제 위치가 일본의 목적지와 너무 멀면 도보 경로가 없을 수 있으므로 실제 기기 또는 시뮬레이터의 교토 위치로 확인하세요. 샘플 장소 좌표와 운영 정보는 실제 방문 전 확인이 필요합니다.

공식 설치 안내: [Google React Native Navigation SDK](https://github.com/googlemaps/react-native-navigation-sdk/tree/v0.16.3). API 키가 준비되기 전에는 실제 지도 표시와 경로 안내를 검증할 수 없습니다.
