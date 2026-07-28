import { Stack, useRouter } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';

import { useAuthActions, useProfile, useSessionStore } from '@/features/auth';
import { AppText, Button, Card, Screen } from '@/shared/ui';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <AppText variant="body" tone="secondary">
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const email = useSessionStore((s) => s.user?.email);
  const { data: profile } = useProfile();
  const { submitting, logOut, removeAccount } = useAuthActions();

  const confirmDelete = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account, bar and history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeAccount() },
      ],
    );
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: true, title: 'Settings', headerBackTitle: 'Home' }} />
      <View className="gap-6 pt-2">
        <Card>
          <View className="gap-2">
            <AppText variant="label" tone="secondary">
              Account
            </AppText>
            <Row label="Email" value={email ?? '—'} />
            <Row label="Name" value={profile?.displayName ?? 'Not set'} />
          </View>
        </Card>

        <Card>
          <View className="gap-2">
            <AppText variant="label" tone="secondary">
              Appearance
            </AppText>
            <Row label="Theme" value="Dark" />
            <AppText variant="caption" tone="tertiary">
              A light theme is coming. MixAI is dark-first by design.
            </AppText>
          </View>
        </Card>

        <View className="gap-3">
          <Button label="Sign out" variant="secondary" onPress={() => logOut()} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            disabled={submitting}
            onPress={confirmDelete}
            className="h-[52px] items-center justify-center rounded-card"
          >
            <AppText variant="body" tone="danger">
              Delete account
            </AppText>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <AppText variant="caption" tone="tertiary" className="text-center">
            Back to home
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}
