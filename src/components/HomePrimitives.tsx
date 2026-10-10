import { useId } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  type TextProps,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import type { LucideIcon } from 'lucide-react-native';

export function Label({
  className = '',
  ...props
}: TextProps & { className?: string }) {
  return <Text {...props} className={`text-ink ${className}`} />;
}
export function Fade({ strong = false }: { strong?: boolean }) {
  const id = useId();
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000" stopOpacity={strong ? 0.12 : 0} />
            <Stop offset="0.45" stopColor="#000" stopOpacity="0.12" />
            <Stop
              offset="1"
              stopColor="#000"
              stopOpacity={strong ? 0.88 : 0.7}
            />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
export function IconButton({
  icon: Icon,
  label,
  onPress,
  dark = false,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  dark?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={`h-10 w-10 items-center justify-center rounded-full ${dark ? 'bg-ink' : ''}`}
    >
      <Icon size={20} strokeWidth={1.5} color={dark ? '#fff' : '#4a4640'} />
    </Pressable>
  );
}
