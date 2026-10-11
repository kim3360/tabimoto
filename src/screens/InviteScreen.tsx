import { useState } from 'react';
import { Image, Pressable, Share, Switch, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';
import { Copy, Link, QrCode, UserPlus, X } from 'lucide-react-native';
import {
  Button,
  Caps,
  IconButton,
  Input,
  Label,
  Page,
  Surface,
} from '../components/TravelUI';
import { demoLink } from '../data/travel';
import { designAssets } from '../data/designAssets';
import { useTravel } from '../state/TravelContext';
import type { Navigation } from '../navigation/types';
export function InviteScreen({ nav }: { nav: Navigation }) {
  const { state, update } = useTravel();
  const [qr, setQr] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const add = () => {
    if (!name.trim()) return;
    if (state.members.length >= 6) {
      setMessage('최대 6명의 동행 설정을 담을 수 있습니다.');
      return;
    }
    update((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id: `member-${Date.now()}`,
          name: name.trim(),
          role: '뷰어',
          pending: true,
        },
      ],
    }));
    setName('');
    setMessage(
      '초대 대상을 기기에 저장했습니다. 실제 초대는 발송되지 않습니다.',
    );
  };
  return (
    <View className="flex-1">
      <Page className="px-4">
        <View className="my-4">
          <Caps>TRAVEL COMPANION DESK · 설정 미리보기</Caps>
          <Label className="text-[28px] leading-9">
            {'동행 초대\n& 권한 설정'}
          </Label>
          <Label className="mt-3 text-[13px] leading-6 text-muted">
            소중한 사람들과 료칸 일정과 동선을 함께 만들어보세요. 아래 권한과
            보호 설정은 기기에 저장됩니다.
          </Label>
        </View>
        <Surface>
          <View className="mb-3 flex-row items-center gap-2">
            <Link size={18} color="#6b5c4a" />
            <Label className="text-sm font-semibold">
              프라이빗 전용 초대 링크
            </Label>
          </View>
          <Label selectable className="mb-3 text-xs text-secondary">
            {demoLink}
          </Label>
          <Button
            icon={Copy}
            onPress={() => {
              Clipboard.setString(demoLink);
              setMessage('미리보기 링크를 복사했습니다.');
            }}
          >
            미리보기 링크 복사
          </Button>
          <Label className="mt-2 text-[11px] leading-5 text-secondary">
            실제 초대 서비스가 연결되지 않은 디자인 예시 링크입니다.
          </Label>
        </Surface>
        <View className="my-3 flex-row gap-2">
          <View className="flex-1">
            <Button
              secondary
              icon={UserPlus}
              onPress={() =>
                Share.share({
                  message: `RYOKA 동행 초대 화면 미리보기\n${demoLink}`,
                }).catch(() => setMessage('공유 창을 열지 못했습니다.'))
              }
            >
              초대 링크 공유
            </Button>
          </View>
          <View className="flex-1">
            <Button secondary icon={QrCode} onPress={() => setQr(!qr)}>
              {qr ? 'QR 접기' : '미리보기 QR'}
            </Button>
          </View>
        </View>
        {qr && (
          <View className="mb-4 items-center gap-3 rounded-xl bg-white p-6">
            <QRCode value={demoLink} size={170} />
            <Label className="text-[11px] text-secondary">
              QR은 위 미리보기 링크를 담고 있습니다.
            </Label>
          </View>
        )}
        <View className="my-4 flex-row justify-between">
          <Label className="text-lg font-semibold">여정 동행자</Label>
          <Label className="text-xs text-secondary">
            {state.members.length}명 · 최대 6인
          </Label>
        </View>
        {state.members.map((member, i) => (
          <View key={member.id} className="mb-3 rounded-xl bg-white p-4">
            <View className="flex-row items-center gap-3">
              <Image
                source={
                  designAssets[
                    `invite-${Math.min(i, 2)}` as
                      'invite-0' | 'invite-1' | 'invite-2'
                  ]
                }
                className="h-10 w-10 rounded-full"
              />
              <View className="flex-1">
                <Label className="text-sm font-semibold">
                  {member.name}
                  {i === 0 ? ' (나)' : ''}
                </Label>
                <Label className="mt-1 text-[11px] text-secondary">
                  {member.pending ? '초대 대상 · 미발송' : '샘플 동행자'}
                </Label>
              </View>
              {member.role === '소유자' ? (
                <Label className="rounded-full bg-sand px-3 py-1 text-[11px]">
                  소유자
                </Label>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${member.name} 권한 변경`}
                  onPress={() =>
                    update((prev) => ({
                      ...prev,
                      members: prev.members.map((m) =>
                        m.id === member.id
                          ? {
                              ...m,
                              role:
                                m.role === '공동 편집자'
                                  ? '뷰어'
                                  : '공동 편집자',
                            }
                          : m,
                      ),
                    }))
                  }
                  className="rounded-full bg-stone px-3 py-2"
                >
                  <Label className="text-[11px]">{member.role} ⌄</Label>
                </Pressable>
              )}
            </View>
            {member.role !== '소유자' && (
              <View className="mt-2 flex-row items-center justify-between">
                <Label className="flex-1 text-[11px] leading-5 text-secondary">
                  {member.role === '공동 편집자'
                    ? '일정 블록과 메모를 함께 편집'
                    : '조회 전용 · 변경 실수 방지'}
                </Label>
                {member.pending && (
                  <IconButton
                    icon={X}
                    label={`${member.name} 초대 대상 삭제`}
                    onPress={() =>
                      update((prev) => ({
                        ...prev,
                        members: prev.members.filter((m) => m.id !== member.id),
                      }))
                    }
                  />
                )}
              </View>
            )}
          </View>
        ))}
        <View className="mb-5 gap-2">
          <Input
            accessibilityLabel="초대할 동행자 이름"
            placeholder="동행자 이름"
            value={name}
            onChangeText={setName}
          />
          <Button
            disabled={!name.trim() || state.members.length >= 6}
            secondary
            onPress={add}
          >
            초대 대상 추가
          </Button>
        </View>
        <View className="mb-5 rounded-xl bg-stone p-4">
          <Label className="mb-3 text-sm font-semibold">
            권한별 권장 가이드
          </Label>
          <Label className="text-[13px] leading-6 text-muted">
            공동 편집자: 일정 블록 추가, 순서 변경과 메모 작성이 가능합니다.
            {'\n\n'}뷰어: 완성된 일정과 지도 동선을 조회합니다.
          </Label>
        </View>
        <Label className="mb-3 text-lg font-semibold">
          여정 보호 & 동기화 규칙
        </Label>
        {[
          '동행자 일정 변경 푸시 알림',
          '장소 삭제 시 멤버 2인 이상 동의',
          '공동 경비 환율 동기화',
        ].map((label, i) => (
          <View
            key={label}
            className="mb-2 flex-row items-center gap-3 rounded-xl bg-white p-4"
          >
            <View className="flex-1">
              <Label className="text-sm">{label}</Label>
              <Label className="mt-1 text-[11px] text-secondary">
                서버 연결 후 적용할 선호 설정
              </Label>
            </View>
            <Switch
              accessibilityLabel={label}
              value={state.rules[i]}
              onValueChange={(value) =>
                update((prev) => ({
                  ...prev,
                  rules: prev.rules.map((v, index) =>
                    index === i ? value : v,
                  ),
                }))
              }
              trackColor={{ false: '#ccc6bd', true: '#6b5c4a' }}
            />
          </View>
        ))}
        {!!message && (
          <Label
            accessibilityLiveRegion="polite"
            className="my-4 text-xs leading-5 text-secondary"
          >
            {message}
          </Label>
        )}
      </Page>
      <View className="px-4 pb-3">
        <Button onPress={nav.back}>설정 저장 및 미리보기 완료</Button>
      </View>
    </View>
  );
}
