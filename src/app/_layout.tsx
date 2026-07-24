import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuthBootstrap, useAuthGuard } from '@/features/auth';
import { createQueryClient } from '@/shared/lib/queryClient';
import { initSentry } from '@/shared/lib/sentry';
import { navigationTheme } from '@/shared/theme/navigation';
import { colors } from '@/shared/theme/tokens';

// MixAI is dark-first; a light theme lands with the M2 settings toggle.
colorScheme.set('dark');
initSentry();

function RootNavigator() {
  useAuthBootstrap();
  const status = useAuthGuard();

  if (status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-ink">
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ink },
      }}
    >
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="light" />
        <RootNavigator />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
