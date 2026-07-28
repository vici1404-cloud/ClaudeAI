import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { useProfile } from '@/features/auth';
import { AppText, GlassPanel, Screen } from '@/shared/ui';

function greetingForHour(hour: number): string {
  if (hour < 5) return 'Nightcap hours';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Home dashboard shell (M1). Renders the layout and empty states the
 * real dashboard fills in as features land: inventory (M3) and
 * recommendations (M4) replace these panels with live data.
 */
export default function HomeScreen() {
  const greeting = greetingForHour(new Date().getHours());
  const { data: profile } = useProfile();
  const name = profile?.displayName;

  return (
    <Screen>
      <View className="gap-6">
        <View className="flex-row items-start justify-between pt-2">
          <View className="flex-1 gap-1">
            <AppText variant="label" tone="gold">
              MixAI
            </AppText>
            <AppText variant="display">{name ? `${greeting}, ${name}` : greeting}</AppText>
            <AppText variant="body" tone="secondary">
              Your personal AI bartender.
            </AppText>
          </View>
          <Link href="/(app)/settings" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Settings"
              className="h-11 w-11 items-center justify-center rounded-full border border-glass-border bg-surface"
            >
              <AppText variant="heading">⚙︎</AppText>
            </Pressable>
          </Link>
        </View>

        <GlassPanel>
          <View className="gap-2">
            <AppText variant="label" tone="secondary">
              Your bar
            </AppText>
            <AppText variant="heading">No bottles yet</AppText>
            <AppText variant="body" tone="secondary">
              Once you add the bottles you own, MixAI will show every cocktail
              you can make with them.
            </AppText>
          </View>
        </GlassPanel>

        <GlassPanel>
          <View className="gap-2">
            <AppText variant="label" tone="secondary">
              Tonight&apos;s picks
            </AppText>
            <AppText variant="heading">Recommendations live here</AppText>
            <AppText variant="body" tone="secondary">
              Personal suggestions appear as soon as your bar has its first
              bottle — including drinks you&apos;re just one ingredient away
              from.
            </AppText>
          </View>
        </GlassPanel>
      </View>
    </Screen>
  );
}
