import { useState } from 'react';
import { View } from 'react-native';

import { SocialButton } from '@/features/auth/components/SocialButton';
import { useAuthActions } from '@/features/auth';
import { AppText, Button, GlassPanel, Screen, TextField } from '@/shared/ui';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const { submitting, error, magicLinkSentTo, requestMagicLink, signInWith, reset } =
    useAuthActions();

  if (magicLinkSentTo) {
    return (
      <Screen scroll={false}>
        <View className="flex-1 justify-center gap-6">
          <View className="gap-2">
            <AppText variant="label" tone="gold">
              Check your inbox
            </AppText>
            <AppText variant="title">Magic link sent</AppText>
            <AppText variant="body" tone="secondary">
              We emailed a sign-in link to {magicLinkSentTo}. Open it on this device to continue.
            </AppText>
          </View>
          <Button label="Use a different email" variant="secondary" onPress={reset} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-center gap-8">
        <View className="gap-1">
          <AppText variant="label" tone="gold">
            MixAI
          </AppText>
          <AppText variant="display">Welcome</AppText>
          <AppText variant="body" tone="secondary">
            Your AI bartender. Sign in to build your bar.
          </AppText>
        </View>

        <GlassPanel>
          <View className="gap-4">
            <TextField
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              inputMode="email"
              value={email}
              onChangeText={setEmail}
              error={error}
              editable={!submitting}
            />
            <Button
              label="Email me a magic link"
              loading={submitting}
              onPress={() => requestMagicLink(email)}
            />
          </View>
        </GlassPanel>

        <View className="flex-row items-center gap-3">
          <View className="h-px flex-1 bg-glass-border" />
          <AppText variant="caption" tone="tertiary">
            or
          </AppText>
          <View className="h-px flex-1 bg-glass-border" />
        </View>

        <SocialButton provider="google" onPress={() => signInWith('google')} disabled={submitting} />

        <AppText variant="caption" tone="tertiary" className="text-center">
          You must be of legal drinking age to use MixAI. By continuing you agree to our Terms and
          Privacy Policy.
        </AppText>
      </View>
    </Screen>
  );
}
