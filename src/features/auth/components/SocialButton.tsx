import { Pressable } from 'react-native';

import { AppText } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

import type { OAuthProvider } from '../types';

const labels: Record<OAuthProvider, string> = {
  google: 'Continue with Google',
};

export interface SocialButtonProps {
  provider: OAuthProvider;
  onPress: () => void;
  disabled?: boolean;
}

/** Neutral, brand-agnostic social auth button. Adding Apple = one label entry. */
export function SocialButton({ provider, onPress, disabled }: SocialButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={labels[provider]}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        'h-[52px] flex-row items-center justify-center rounded-card border border-glass-border bg-surface-raised px-6',
        disabled && 'opacity-50',
      )}
    >
      <AppText variant="heading">{labels[provider]}</AppText>
    </Pressable>
  );
}
