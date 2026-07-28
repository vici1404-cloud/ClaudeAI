import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, View } from 'react-native';

import { cn } from '@/shared/utils/cn';

export interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  /** Blur strength 0–100. */
  intensity?: number;
}

/**
 * Frosted-glass surface — the signature MixAI panel. Real blur on iOS;
 * on Android BlurView is inconsistent across vendors, so we render a
 * translucent fill that reads the same against the ink background.
 */
export function GlassPanel({ children, className, intensity = 40 }: GlassPanelProps) {
  const frame = cn('overflow-hidden rounded-panel border border-glass-border', className);

  if (Platform.OS === 'ios') {
    return (
      <View className={frame}>
        <BlurView intensity={intensity} tint="dark" className="p-5">
          {children}
        </BlurView>
      </View>
    );
  }
  return (
    <View className={cn(frame, 'bg-glass-fill')}>
      <View className="p-5">{children}</View>
    </View>
  );
}
