export type Tab = '홈' | '탐색' | '일정' | '저장' | '마이';
export type Route =
  | { name: 'main'; tab: Tab; query?: string; city?: string; category?: string }
  | { name: 'detail'; placeId: string }
  | { name: 'route'; day: number }
  | { name: 'navigation'; placeId: string }
  | { name: 'shared' }
  | { name: 'invite' }
  | { name: 'guide' }
  | { name: 'expenses' }
  | { name: 'notes' }
  | { name: 'settings' }
  | { name: 'notifications' };
export type Navigation = { go: (route: Route) => void; back: () => void };
