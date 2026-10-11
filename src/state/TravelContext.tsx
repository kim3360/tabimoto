import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initialState,
  valid,
  insertStop,
  type TravelState,
} from './travelState';

const key = '@tabimoto/travel-v1';
type TravelContextValue = {
  state: TravelState;
  ready: boolean;
  storageError: string | null;
  update: (change: (state: TravelState) => TravelState) => void;
  toggleSaved: (id: string) => void;
  addStop: (id: string, day?: number) => void;
  removeStop: (id: string) => void;
  reset: () => void;
};
const Context = createContext<TravelContextValue | null>(null);
export function TravelProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (!active) return;
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (valid(parsed)) setState(parsed);
          else
            setStorageError(
              '저장된 여행 정보를 읽을 수 없어 샘플 여정을 표시합니다.',
            );
        }
      })
      .catch(() => {
        if (active) setStorageError('여행 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(key, JSON.stringify(state)))
      .then(() => setStorageError(null))
      .catch(() =>
        setStorageError(
          '기기 저장에 실패했습니다. 현재 화면의 변경은 유지됩니다.',
        ),
      );
  }, [ready, state]);
  const update: TravelContextValue['update'] = (change) =>
    setState((prev) => change(prev));
  const toggleSaved = (id: string) =>
    update((prev) => ({
      ...prev,
      saved: prev.saved.includes(id)
        ? prev.saved.filter((value) => value !== id)
        : [...prev.saved, id],
    }));
  const addStop = (placeId: string, day = 2) =>
    update((prev) =>
      insertStop(prev, placeId, day, `${placeId}-${day}-${Date.now()}`),
    );
  return (
    <Context.Provider
      value={{
        state,
        ready,
        storageError,
        update,
        toggleSaved,
        addStop,
        removeStop: (id) =>
          update((prev) => ({
            ...prev,
            stops: prev.stops.filter((s) => s.id !== id),
          })),
        reset: () => setState(initialState),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useTravel() {
  const value = useContext(Context);
  if (!value) throw new Error('TravelProvider is required');
  return value;
}
