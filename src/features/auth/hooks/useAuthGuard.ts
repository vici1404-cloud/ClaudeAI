import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import type { AuthStatus } from '../types';
import { useProfile } from './useProfile';
import { useSessionStore } from './sessionStore';

/**
 * Central routing guard. Redirects between the (auth), (onboarding) and
 * (app) segments based on session + age-gate completion. Returns the
 * resolved status so the root layout can hold a splash while loading.
 *
 * Rules:
 *  - session restoring / profile loading → 'loading' (no redirect)
 *  - no session               → must be in (auth)
 *  - session, no birth_date    → must be in (onboarding) age gate
 *  - session, birth_date set   → must be in (app)
 */
export function useAuthGuard(): AuthStatus {
  const session = useSessionStore((s) => s.session);
  const segments = useSegments();
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const restoring = session === undefined;
  const authed = !!session;
  const needsAgeGate = authed && !profileLoading && profile != null && profile.birthDate === null;

  useEffect(() => {
    if (restoring) return;
    if (authed && profileLoading) return; // wait for profile before routing signed-in users

    const group = segments[0];
    const inAuth = group === '(auth)';
    const inOnboarding = group === '(onboarding)';

    if (!authed && !inAuth) {
      router.replace('/(auth)/sign-in');
    } else if (authed && needsAgeGate && !inOnboarding) {
      router.replace('/(onboarding)/age-gate');
    } else if (authed && !needsAgeGate && (inAuth || inOnboarding)) {
      router.replace('/(app)');
    }
  }, [restoring, authed, needsAgeGate, profileLoading, segments, router]);

  if (restoring || (authed && profileLoading)) return 'loading';
  return authed ? 'authenticated' : 'unauthenticated';
}
