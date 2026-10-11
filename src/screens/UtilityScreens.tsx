import { useState } from 'react';
import { Alert, Pressable, Switch, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import {
  Button,
  Caps,
  Empty,
  Input,
  Label,
  Page,
  Surface,
} from '../components/TravelUI';
import { useTravel } from '../state/TravelContext';
export function ExpensesScreen() {
  const { state, update } = useTravel();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const total = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const people = Math.max(state.members.filter((m) => !m.pending).length, 1);
  return (
    <Page className="px-4">
      <View className="my-4">
        <Caps>SHARED TRAVEL WALLET</Caps>
        <Label className="text-2xl">함께 쓰는 여행 경비</Label>
      </View>
      <Surface>
        <Label className="text-xs text-secondary">
          엔화 총 지출 · 샘플 택시 경비 포함
        </Label>
        <Label className="my-2 text-3xl font-semibold">
          ¥{total.toLocaleString()}
        </Label>
        <Label className="text-sm text-secondary">
          {people}인 균등 분담 · 1인 약 ¥
          {Math.ceil(total / people).toLocaleString()}
        </Label>
      </Surface>
      <View className="my-5 gap-3">
        <Input
          accessibilityLabel="지출 항목"
          placeholder="예: 가이세키 점심"
          value={title}
          onChangeText={setTitle}
        />
        <Input
          accessibilityLabel="지출 금액 엔화"
          placeholder="금액 (JPY)"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        <Button
          onPress={() => {
            const value = Number(amount.replace(/,/g, ''));
            if (!title.trim() || !Number.isFinite(value) || value <= 0) {
              setError('지출 이름과 0보다 큰 금액을 입력해 주세요.');
              return;
            }
            update((prev) => ({
              ...prev,
              expenses: [
                ...prev.expenses,
                {
                  id: `expense-${Date.now()}`,
                  title: title.trim(),
                  amount: value,
                },
              ],
            }));
            setAmount('');
            setTitle('');
            setError('');
          }}
        >
          지출 기록하기
        </Button>
        {!!error && (
          <Label
            accessibilityLiveRegion="polite"
            className="text-xs text-secondary"
          >
            {error}
          </Label>
        )}
      </View>
      {state.expenses.map((e) => (
        <View
          key={e.id}
          className="mb-2 flex-row items-center justify-between rounded-xl bg-white p-4"
        >
          <Label className="flex-1 text-sm">{e.title}</Label>
          <Label className="mr-3 text-sm font-semibold">
            ¥{e.amount.toLocaleString()}
          </Label>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${e.title} 지출 삭제`}
            onPress={() =>
              update((prev) => ({
                ...prev,
                expenses: prev.expenses.filter((item) => item.id !== e.id),
              }))
            }
          >
            <Trash2 size={18} color="#6b5c4a" />
          </Pressable>
        </View>
      ))}
      <Label className="mt-4 text-[11px] leading-5 text-secondary">
        지출은 기기에 보관됩니다. 실제 송금과 환율 서비스는 연결되어 있지
        않습니다.
      </Label>
    </Page>
  );
}
export function NotesScreen() {
  const { state, update } = useTravel();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  return (
    <Page className="px-4">
      <View className="my-4">
        <Caps>MY JAPAN JOURNAL</Caps>
        <Label className="text-2xl">고요한 순간의 기록</Label>
      </View>
      <View className="mb-5 gap-3">
        <Input
          accessibilityLabel="여행 노트 제목"
          placeholder="노트 제목"
          value={title}
          onChangeText={setTitle}
        />
        <Input
          accessibilityLabel="여행 노트 내용"
          placeholder="오늘의 향기와 풍경을 남겨보세요"
          multiline
          value={note}
          onChangeText={setNote}
        />
        <Button
          disabled={!title.trim() || !note.trim()}
          onPress={() => {
            update((prev) => ({
              ...prev,
              notes: {
                ...prev.notes,
                [editId || `note-${Date.now()}`]: JSON.stringify({
                  title: title.trim(),
                  text: note.trim(),
                }),
              },
            }));
            setTitle('');
            setNote('');
            setEditId(null);
          }}
        >
          {editId ? '노트 수정 저장' : '여행 노트 저장'}
        </Button>
      </View>
      {Object.entries(state.notes).map(([id, raw]) => {
        let n: { title: string; text: string };
        try {
          const parsed: unknown = JSON.parse(raw);
          n =
            parsed &&
            typeof parsed === 'object' &&
            'title' in parsed &&
            typeof parsed.title === 'string' &&
            'text' in parsed &&
            typeof parsed.text === 'string'
              ? { title: parsed.title, text: parsed.text }
              : { title: '여행 노트', text: raw };
        } catch {
          n = { title: '여행 노트', text: raw };
        }
        return (
          <View key={id} className="mb-3 rounded-xl bg-white p-4">
            <Label className="mb-2 text-lg font-semibold">{n.title}</Label>
            <Label className="text-sm leading-6 text-muted">{n.text}</Label>
            <View className="mt-3 flex-row gap-4">
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setEditId(id);
                  setTitle(n.title);
                  setNote(n.text);
                }}
              >
                <Label className="text-xs text-secondary">수정</Label>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  update((prev) => {
                    const next = { ...prev.notes };
                    delete next[id];
                    return { ...prev, notes: next };
                  })
                }
              >
                <Label className="text-xs text-secondary">삭제</Label>
              </Pressable>
            </View>
          </View>
        );
      })}
      {!Object.keys(state.notes).length && (
        <Empty text="아직 남긴 여행 노트가 없어요." />
      )}
    </Page>
  );
}
export function SettingsScreen() {
  const { state, update, reset } = useTravel();
  return (
    <Page className="px-4">
      <View className="my-4">
        <Caps>QUIET HOSPITALITY PREFERENCES</Caps>
        <Label className="text-2xl">앱 설정</Label>
      </View>
      <Surface>
        <Label className="text-sm font-semibold">
          기기에 보관되는 여행 정보
        </Label>
        <Label className="mt-3 text-[13px] leading-6 text-muted">
          저장한 장소, 날짜별 일정, 메모, 투표와 동행자 설정이 앱을 다시 열어도
          유지됩니다. 서버 계정이나 로그인 기능은 연결되지 않았습니다.
        </Label>
      </Surface>
      <View className="my-5 gap-3">
        {[
          '동행자 변경 알림 선호',
          '장소 삭제 동의 선호',
          '환율 동기화 선호',
        ].map((text, i) => (
          <View
            key={text}
            className="flex-row items-center justify-between rounded-xl bg-white p-4"
          >
            <Label className="text-sm">{text}</Label>
            <Switch
              accessibilityLabel={text}
              value={state.rules[i]}
              onValueChange={(value) =>
                update((prev) => ({
                  ...prev,
                  rules: prev.rules.map((v, index) =>
                    i === index ? value : v,
                  ),
                }))
              }
              trackColor={{ false: '#ccc6bd', true: '#6b5c4a' }}
            />
          </View>
        ))}
      </View>
      <Button
        secondary
        onPress={() =>
          Alert.alert(
            '샘플 데이터로 초기화',
            '저장·일정·메모·동행자 설정이 초기화됩니다.',
            [
              { text: '취소', style: 'cancel' },
              { text: '초기화', style: 'destructive', onPress: reset },
            ],
          )
        }
      >
        샘플 여행 데이터로 초기화
      </Button>
      <Label className="mt-5 text-xs leading-6 text-secondary">
        버전 1.0.0 · React Native CLI{'\n'}설정은 기기에만 저장되며 실제 푸시
        알림은 발송하지 않습니다.
      </Label>
    </Page>
  );
}
export function NotificationsScreen() {
  return (
    <Page className="px-4">
      <Empty text="새로운 알림이 없어요.\n실시간 알림 서비스는 아직 연결되지 않았습니다." />
    </Page>
  );
}
