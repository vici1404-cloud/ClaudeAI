import { useState } from 'react';
import { View } from 'react-native';

import { isOfLegalDrinkingAge, MINIMUM_AGE, useCompleteAgeGate } from '@/features/auth';
import { AppText, Button, GlassPanel, Screen, TextField } from '@/shared/ui';

function toIsoDate(year: string, month: string, day: string): string | null {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
  if (y < 1900 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const iso = `${y.toString().padStart(4, '0')}-${m.toString().padStart(2, '0')}-${d
    .toString()
    .padStart(2, '0')}`;
  const parsed = new Date(iso);
  // Reject impossible dates (e.g. 31 Feb rolls over).
  if (parsed.getUTCMonth() + 1 !== m || parsed.getUTCDate() !== d) return null;
  return iso;
}

export default function AgeGateScreen() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useCompleteAgeGate();

  const onContinue = () => {
    const iso = toIsoDate(year, month, day);
    if (!iso) {
      setError('Enter a valid date of birth.');
      return;
    }
    if (!isOfLegalDrinkingAge(iso)) {
      setError(`You must be at least ${MINIMUM_AGE} to use MixAI.`);
      return;
    }
    setError(null);
    mutate(
      { birthDate: iso },
      { onError: (e) => setError(e instanceof Error ? e.message : 'Could not save. Try again.') },
    );
  };

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-center gap-8">
        <View className="gap-2">
          <AppText variant="label" tone="gold">
            One quick thing
          </AppText>
          <AppText variant="title">Confirm your age</AppText>
          <AppText variant="body" tone="secondary">
            MixAI is for adults of legal drinking age. Enter your date of birth to continue.
          </AppText>
        </View>

        <GlassPanel>
          <View className="gap-4">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextField
                  label="Day"
                  placeholder="DD"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={day}
                  onChangeText={setDay}
                  editable={!isPending}
                />
              </View>
              <View className="flex-1">
                <TextField
                  label="Month"
                  placeholder="MM"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={month}
                  onChangeText={setMonth}
                  editable={!isPending}
                />
              </View>
              <View className="flex-[1.3]">
                <TextField
                  label="Year"
                  placeholder="YYYY"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={year}
                  onChangeText={setYear}
                  editable={!isPending}
                />
              </View>
            </View>
            {error ? (
              <AppText variant="caption" tone="danger">
                {error}
              </AppText>
            ) : null}
            <Button label="Continue" loading={isPending} onPress={onContinue} />
          </View>
        </GlassPanel>
      </View>
    </Screen>
  );
}
