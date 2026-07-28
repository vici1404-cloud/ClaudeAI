import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, motion } from '@/shared/theme/tokens';
import { cn } from '@/shared/utils/cn';

import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost';

const containerClasses: Record<Variant, string> = {
  primary: 'bg-gold',
  secondary: 'bg-surface-raised border border-glass-border',
  ghost: 'bg-transparent',
};

const labelTone: Record<Variant, 'primary' | 'gold'> = {
  primary: 'primary',
  secondary: 'primary',
  ghost: 'gold',
};

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps & { className?: string }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const inactive = disabled || loading;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !!inactive, busy: loading }}
        disabled={inactive}
        onPressIn={() =>
          scale.set(withTiming(motion.pressScale, { duration: motion.duration.fast }))
        }
        onPressOut={() => scale.set(withTiming(1, { duration: motion.duration.fast }))}
        className={cn(
          'h-[52px] flex-row items-center justify-center rounded-card px-6',
          containerClasses[variant],
          inactive && 'opacity-50',
          className,
        )}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? colors.ink : colors.cream} />
        ) : (
          <AppText
            variant="heading"
            tone={labelTone[variant]}
            className={variant === 'primary' ? 'text-ink' : undefined}
          >
            {label}
          </AppText>
        )}
      </Pressable>
    </Animated.View>
  );
}
