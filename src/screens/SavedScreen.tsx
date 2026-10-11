import { useState } from 'react';
import { View } from 'react-native';
import { FolderPlus, Map } from 'lucide-react-native';
import {
  Button,
  Caps,
  Chips,
  Empty,
  Input,
  Label,
  Page,
  PlaceCard,
} from '../components/TravelUI';
import { placeCategories, places } from '../data/travel';
import { useTravel } from '../state/TravelContext';
import type { Navigation } from '../navigation/types';
export function SavedScreen({ nav }: { nav: Navigation }) {
  const { state, update, addStop } = useTravel();
  const [folder, setFolder] = useState('모든 장소');
  const [category, setCategory] = useState('전체');
  const [selected, setSelected] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const ids = state.folders.find((f) => f.name === folder)?.placeIds;
  const results = places.filter(
    (p) =>
      state.saved.includes(p.id) &&
      (!ids || ids.includes(p.id)) &&
      (category === '전체' || p.category === category),
  );
  const selectedIds = selected.filter((id) => results.some((p) => p.id === id));
  return (
    <View className="flex-1">
      <Page className="px-4">
        <View className="mt-3 flex-row justify-between">
          <Caps>MY WISHLIST ARCHIVE</Caps>
          <Label className="text-[11px] text-secondary">
            총 {state.saved.length}개 보관됨
          </Label>
        </View>
        <Label className="text-2xl">나의 위시 컬렉션</Label>
        <Label className="mb-4 mt-2 text-[13px] text-muted">
          여행을 위해 정성스레 담아둔 특별한 공간들
        </Label>
        <Chips
          values={['모든 장소', ...state.folders.map((f) => f.name)]}
          value={folder}
          onChange={(value) => {
            setFolder(value);
            setSelected([]);
          }}
        />
        <Button secondary icon={FolderPlus} onPress={() => setAdding(!adding)}>
          폴더 추가
        </Button>
        {adding && (
          <View className="mt-3 gap-2">
            <Input
              accessibilityLabel="새 폴더 이름"
              value={name}
              onChangeText={setName}
              placeholder="예: 다음 교토 여행"
            />
            <Label className="text-xs text-secondary">
              선택한 {selectedIds.length}개 장소를 폴더에 담습니다.
            </Label>
            <Button
              disabled={!name.trim()}
              onPress={() => {
                if (
                  state.folders.some((f) => f.name === name.trim()) ||
                  name.trim() === '모든 장소'
                ) {
                  setMessage('이미 있는 폴더 이름입니다.');
                  return;
                }
                update((prev) => ({
                  ...prev,
                  folders: [
                    ...prev.folders,
                    {
                      id: `folder-${Date.now()}`,
                      name: name.trim(),
                      placeIds: selectedIds,
                    },
                  ],
                }));
                setFolder(name.trim());
                setAdding(false);
                setName('');
                setMessage('폴더가 만들어졌습니다.');
              }}
            >
              폴더 만들기
            </Button>
          </View>
        )}
        <Chips
          values={placeCategories}
          value={category}
          onChange={(value) => {
            setCategory(value);
            setSelected([]);
          }}
        />
        {!!message && (
          <Label
            accessibilityLiveRegion="polite"
            className="my-3 text-xs text-secondary"
          >
            {message}
          </Label>
        )}
        {results.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            nav={nav}
            selection={selectedIds.includes(place.id)}
            onSelect={() =>
              setSelected((prev) =>
                prev.includes(place.id)
                  ? prev.filter((id) => id !== place.id)
                  : [...prev, place.id],
              )
            }
            onAdd={() => {
              addStop(place.id);
              setMessage(`${place.title}을 Day 2에 담았습니다.`);
            }}
          />
        ))}
        {results.length === 0 && (
          <Empty
            text="이 컬렉션에 담긴 장소가 없어요."
            onPress={() => nav.go({ name: 'main', tab: '탐색' })}
          />
        )}
      </Page>
      <View className="gap-1 border-t border-stone bg-cream px-4 py-3">
        <Label className="mb-2 text-xs text-secondary">
          {selectedIds.length}곳 선택됨 · Day 2에 추가
        </Label>
        <Button
          disabled={!selectedIds.length}
          icon={Map}
          onPress={() => {
            selectedIds.forEach((id) => addStop(id));
            nav.go({ name: 'main', tab: '일정' });
          }}
        >
          선택한 장소들로 일정 만들기
        </Button>
      </View>
    </View>
  );
}
