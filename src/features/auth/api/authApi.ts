import * as WebBrowser from 'expo-web-browser';

import { getSupabase } from '@/shared/lib/supabase';

import { normalizeEmail } from '../services/authService';
import type { OAuthProvider } from '../types';

/**
 * Infrastructure layer: the only module that talks to Supabase auth and
 * the system browser. Providers are handled uniformly so adding Apple is
 * a one-line change to the OAuthProvider union + no new code here.
 */

/** Sends a passwordless magic link to the given email. */
export async function sendMagicLink(email: string, redirectTo: string): Promise<void> {
  const { error } = await getSupabase().auth.signInWithOtp({
    email: normalizeEmail(email),
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
}

/**
 * Runs a browser-based OAuth flow and establishes a session. Returns
 * when the session is set, or throws on failure/cancel.
 */
export async function signInWithProvider(
  provider: OAuthProvider,
  redirectTo: string,
): Promise<void> {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data.url) throw new Error('No authorization URL returned by Supabase.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') {
    throw new Error('Sign-in was cancelled.');
  }
  await exchangeCodeFromUrl(result.url);
}

/** Exchanges a PKCE `code` from a redirect URL for a session. */
export async function exchangeCodeFromUrl(url: string): Promise<void> {
  const code = new URL(url).searchParams.get('code');
  if (!code) return;
  const { error } = await getSupabase().auth.exchangeCodeForSession(code);
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

/**
 * Permanently deletes the caller's account. The Edge Function verifies
 * the JWT and uses the service role to remove the auth user; all owned
 * rows cascade via foreign keys. Local session is cleared afterwards.
 */
export async function deleteAccount(): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
  if (error) throw error;
  await supabase.auth.signOut();
}
