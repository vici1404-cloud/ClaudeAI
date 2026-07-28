import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { getEnv } from '@/shared/lib/env';
import { logger } from '@/shared/lib/logger';
import { getSupabase } from '@/shared/lib/supabase';

import { exchangeCodeFromUrl } from '../api/authApi';
import { useSessionStore } from './sessionStore';

/**
 * Wires the app to Supabase auth for the lifetime of the root layout:
 *  - restores any persisted session and subscribes to auth changes,
 *  - drives token auto-refresh from foreground/background transitions,
 *  - completes magic-link / OAuth deep links by exchanging the PKCE code.
 *
 * No-op when Supabase isn't configured, so the shell still boots.
 */
export function useAuthBootstrap(): void {
  const setSession = useSessionStore((s) => s.setSession);

  useEffect(() => {
    if (!getEnv().supabaseUrl) {
      setSession(null); // unconfigured → treat as signed out, show auth screen
      return;
    }
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));

    const onAppState = (state: AppStateStatus) => {
      if (state === 'active') supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    };
    const appStateSub = AppState.addEventListener('change', onAppState);
    if (AppState.currentState === 'active') supabase.auth.startAutoRefresh();

    const handleUrl = (url: string) => {
      exchangeCodeFromUrl(url).catch((e) => logger.error('Deep-link code exchange failed', e));
    };
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });
    const linkSub = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    return () => {
      subscription.unsubscribe();
      appStateSub.remove();
      linkSub.remove();
    };
  }, [setSession]);
}
