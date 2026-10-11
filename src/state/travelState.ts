import { places, sampleStops, type Stop } from '../data/travel';
type Member = {
  id: string;
  name: string;
  role: '소유자' | '공동 편집자' | '뷰어';
  pending: boolean;
};
type Folder = { id: string; name: string; placeIds: string[] };
type Expense = { id: string; title: string; amount: number };
export type TravelState = {
  saved: string[];
  stops: Stop[];
  folders: Folder[];
  name: string;
  tags: string[];
  members: Member[];
  rules: boolean[];
  vote: 'tea' | 'okonomiyaki' | null;
  comments: string[];
  expenses: Expense[];
  notes: Record<string, string>;
};
export const initialState: TravelState = {
  saved: ['garden', 'skyline', 'matsuda', 'bamboo'],
  stops: sampleStops,
  folders: [
    {
      id: 'kyoto',
      name: '10월 교토 여행',
      placeIds: ['garden', 'matsuda', 'bamboo'],
    },
    { id: 'tokyo', name: '도쿄 버킷리스트', placeIds: ['skyline'] },
  ],
  name: '이지원',
  tags: ['사찰과정원', '가이세키미식', '조용한노천탕', '다도체험'],
  members: [
    { id: 'owner', name: '이지원', role: '소유자', pending: false },
    { id: 'minjun', name: '김민준', role: '공동 편집자', pending: false },
    { id: 'seoyeon', name: '박서연', role: '공동 편집자', pending: false },
  ],
  rules: [true, false, true],
  vote: null,
  comments: [],
  expenses: [{ id: 'taxi', title: '택시 이동', amount: 2400 }],
  notes: {},
};
// Reject malformed local data instead of letting one corrupted value break every screen.
export function valid(value: unknown): value is TravelState {
  if (!value || typeof value !== 'object') return false;
  const s = value as TravelState;
  return (
    Array.isArray(s.saved) &&
    s.saved.every((id) => typeof id === 'string') &&
    Array.isArray(s.stops) &&
    s.stops.every(
      (stop) =>
        !!stop &&
        typeof stop.id === 'string' &&
        places.some((p) => p.id === stop.placeId) &&
        Number.isInteger(stop.day) &&
        stop.day >= 1 &&
        stop.day <= 5 &&
        typeof stop.time === 'string' &&
        typeof stop.note === 'string',
    ) &&
    Array.isArray(s.folders) &&
    s.folders.every(
      (f) =>
        !!f &&
        typeof f.id === 'string' &&
        typeof f.name === 'string' &&
        Array.isArray(f.placeIds) &&
        f.placeIds.every((id) => typeof id === 'string'),
    ) &&
    typeof s.name === 'string' &&
    Array.isArray(s.tags) &&
    s.tags.every((t) => typeof t === 'string') &&
    Array.isArray(s.members) &&
    s.members.every(
      (m) =>
        !!m &&
        typeof m.id === 'string' &&
        typeof m.name === 'string' &&
        ['소유자', '공동 편집자', '뷰어'].includes(m.role) &&
        typeof m.pending === 'boolean',
    ) &&
    Array.isArray(s.rules) &&
    s.rules.length === 3 &&
    s.rules.every((r) => typeof r === 'boolean') &&
    (s.vote === null || ['tea', 'okonomiyaki'].includes(s.vote)) &&
    Array.isArray(s.comments) &&
    s.comments.every((c) => typeof c === 'string') &&
    Array.isArray(s.expenses) &&
    s.expenses.every(
      (e) =>
        !!e &&
        typeof e.id === 'string' &&
        typeof e.title === 'string' &&
        Number.isFinite(e.amount) &&
        e.amount > 0,
    ) &&
    !!s.notes &&
    typeof s.notes === 'object' &&
    !Array.isArray(s.notes) &&
    Object.values(s.notes).every((n) => typeof n === 'string')
  );
}

export function insertStop(
  state: TravelState,
  placeId: string,
  day: number,
  id: string,
): TravelState {
  if (
    !places.some((p) => p.id === placeId) ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > 5 ||
    state.stops.some((s) => s.placeId === placeId && s.day === day)
  )
    return state;
  return {
    ...state,
    stops: [...state.stops, { id, placeId, day, time: '시간 미정', note: '' }],
  };
}
export function moveStop(
  state: TravelState,
  id: string,
  direction: -1 | 1,
): TravelState {
  const stop = state.stops.find((s) => s.id === id);
  if (!stop) return state;
  const dayStops = state.stops.filter((s) => s.day === stop.day);
  const index = dayStops.findIndex((s) => s.id === id);
  const other = dayStops[index + direction];
  if (!other) return state;
  const stops = [...state.stops];
  const a = stops.findIndex((s) => s.id === id),
    b = stops.findIndex((s) => s.id === other.id);
  [stops[a], stops[b]] = [stops[b], stops[a]];
  return { ...state, stops };
}
