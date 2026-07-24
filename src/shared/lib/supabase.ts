import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { requireSupabaseEnv } from './env';

let client: SupabaseClient | undefined;

/**
 * Lazy Supabase client singleton. Created on first use so the app can
 * boot without backend configuration (nothing in M1 talks to it yet).
 *
 * Session persistence is intentionally disabled until M2, where auth
 * lands together with an encrypted secure-storage adapter — tokens
 * never go into plain AsyncStorage.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const { supabaseUrl, supabaseAnonKey } = requireSupabaseEnv();
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
