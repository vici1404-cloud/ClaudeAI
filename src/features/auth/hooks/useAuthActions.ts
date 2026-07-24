import { makeRedirectUri } from 'expo-auth-session';
import { useCallback, useState } from 'react';

import { logger } from '@/shared/lib/logger';

import { deleteAccount, sendMagicLink, signInWithProvider, signOut } from '../api/authApi';
import { isValidEmail } from '../services/authService';
import type { OAuthProvider } from '../types';

/** Deep link Supabase redirects back to after magic-link / OAuth. */
const redirectTo = makeRedirectUri({ scheme: 'mixai', path: 'auth-callback' });

interface AuthActionsState {
  submitting: boolean;
  error: string | null;
  magicLinkSentTo: string | null;
}

function messageFor(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

/** Auth mutations with loading/error state for screens to bind to. */
export function useAuthActions() {
  const [state, setState] = useState<AuthActionsState>({
    submitting: false,
    error: null,
    magicLinkSentTo: null,
  });

  const requestMagicLink = useCallback(async (email: string) => {
    if (!isValidEmail(email)) {
      setState((s) => ({ ...s, error: 'Enter a valid email address.' }));
      return;
    }
    setState({ submitting: true, error: null, magicLinkSentTo: null });
    try {
      await sendMagicLink(email, redirectTo);
      setState({ submitting: false, error: null, magicLinkSentTo: email.trim() });
    } catch (error) {
      logger.error('Magic link request failed', error);
      setState({ submitting: false, error: messageFor(error), magicLinkSentTo: null });
    }
  }, []);

  const signInWith = useCallback(async (provider: OAuthProvider) => {
    setState({ submitting: true, error: null, magicLinkSentTo: null });
    try {
      await signInWithProvider(provider, redirectTo);
      setState((s) => ({ ...s, submitting: false }));
    } catch (error) {
      logger.error('OAuth sign-in failed', error, { provider });
      setState({ submitting: false, error: messageFor(error), magicLinkSentTo: null });
    }
  }, []);

  const logOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      logger.error('Sign-out failed', error);
    }
  }, []);

  const removeAccount = useCallback(async () => {
    setState((s) => ({ ...s, submitting: true, error: null }));
    try {
      await deleteAccount();
    } catch (error) {
      logger.error('Account deletion failed', error);
      setState((s) => ({ ...s, submitting: false, error: messageFor(error) }));
    }
  }, []);

  const reset = useCallback(
    () => setState({ submitting: false, error: null, magicLinkSentTo: null }),
    [],
  );

  return { ...state, requestMagicLink, signInWith, logOut, removeAccount, reset };
}
