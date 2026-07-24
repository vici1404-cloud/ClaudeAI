import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colorScheme } from 'nativewind';
import { useState } from 'react';

import { createQueryClient } from '@/shared/lib/queryClient';
import { initSentry } from '@/shared/lib/sentry';
import { navigationTheme } from '@/shared/theme/navigation';
import { colors } from '@/shared/theme/tokens';

// MixAI is dark-first; a light theme lands with the M2 settings toggle.
colorScheme.set('dark');
initSentry();

export default function RootLayout() {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.ink },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
