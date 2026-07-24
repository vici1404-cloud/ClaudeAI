import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/shared/theme/tokens';

export interface ScreenProps {
  children: ReactNode;
  /** Wrap content in a ScrollView. Default true — most screens scroll. */
  scroll?: boolean;
}

/** Base screen container: ink background, safe-area aware, consistent gutters. */
export function Screen({ children, scroll = true }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + spacing.md,
    paddingBottom: insets.bottom + spacing.lg,
    paddingLeft: insets.left + spacing.md,
    paddingRight: insets.right + spacing.md,
  };

  if (!scroll) {
    return (
      <View className="flex-1 bg-ink" style={padding}>
        {children}
      </View>
    );
  }
  return (
    <ScrollView
      className="flex-1 bg-ink"
      contentContainerStyle={padding}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
