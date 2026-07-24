import { View } from 'react-native';

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

  return (
    <Screen>
      <View className="gap-6">
        <View className="gap-1 pt-2">
          <AppText variant="label" tone="gold">
            MixAI
          </AppText>
          <AppText variant="display">{greeting}</AppText>
          <AppText variant="body" tone="secondary">
            Your personal AI bartender.
          </AppText>
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
