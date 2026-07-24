import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { requireSupabaseEnv } from './env';
import { secureStorage } from './secureStorage';

let client: SupabaseClient | undefined;

/**
 * Lazy Supabase client singleton. Created on first use so the M1 shell
 * can boot without backend configuration.
 *
 * Sessions persist in encrypted secure storage; PKCE is used for the
 * magic-link and OAuth flows. `detectSessionInUrl` is off on native (we
 * exchange the code ourselves from the deep link) and on for web preview.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const { supabaseUrl, supabaseAnonKey } = requireSupabaseEnv();
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: secureStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: Platform.OS === 'web',
        flowType: 'pkce',
      },
    });
  }
  return client;
}
