import { forwardRef } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { colors } from '@/shared/theme/tokens';
import { cn } from '@/shared/utils/cn';

import { AppText } from './AppText';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, className, ...props },
  ref,
) {
  return (
    <View className="gap-2">
      {label ? (
        <AppText variant="label" tone="secondary">
          {label}
        </AppText>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.slate}
        className={cn(
          'h-[52px] rounded-card border border-glass-border bg-surface px-4 text-[16px] text-cream',
          error && 'border-danger',
          className,
        )}
        {...props}
      />
      {error ? (
        <AppText variant="caption" tone="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
});
