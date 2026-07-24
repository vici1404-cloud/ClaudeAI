import { z } from 'zod';

/**
 * Runtime-validated environment. Only EXPO_PUBLIC_* variables are
 * available in the client bundle; secrets live in Edge Functions.
 *
 * Supabase and Sentry values are optional at this stage so the app
 * shell can run without a configured backend (e.g. fresh clones, CI);
 * features that need them must go through `requireSupabaseEnv`.
 */
const envSchema = z.object({
  supabaseUrl: z.string().url().optional(),
  supabaseAnonKey: z.string().min(1).optional(),
  sentryDsn: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(raw: {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  sentryDsn?: string;
}): Env {
  const result = envSchema.safeParse({
    supabaseUrl: emptyToUndefined(raw.supabaseUrl),
    supabaseAnonKey: emptyToUndefined(raw.supabaseAnonKey),
    sentryDsn: emptyToUndefined(raw.sentryDsn),
  });
  if (!result.success) {
    throw new Error(`Invalid environment configuration: ${result.error.message}`);
  }
  return result.data;
}

function emptyToUndefined(value: string | undefined): string | undefined {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

let cached: Env | undefined;

export function getEnv(): Env {
  cached ??= parseEnv({
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  });
  return cached;
}

export function requireSupabaseEnv(): { supabaseUrl: string; supabaseAnonKey: string } {
  const env = getEnv();
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (see .env.example).',
    );
  }
  return { supabaseUrl: env.supabaseUrl, supabaseAnonKey: env.supabaseAnonKey };
}
