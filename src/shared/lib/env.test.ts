import { describe, expect, it } from 'vitest';

import { parseEnv } from './env';

describe('parseEnv', () => {
  it('accepts a fully configured environment', () => {
    const env = parseEnv({
      supabaseUrl: 'https://project.supabase.co',
      supabaseAnonKey: 'anon-key',
      sentryDsn: 'https://abc@o1.ingest.sentry.io/1',
    });
    expect(env.supabaseUrl).toBe('https://project.supabase.co');
    expect(env.supabaseAnonKey).toBe('anon-key');
    expect(env.sentryDsn).toBe('https://abc@o1.ingest.sentry.io/1');
  });

  it('allows a completely unconfigured environment (fresh clone, CI)', () => {
    const env = parseEnv({});
    expect(env.supabaseUrl).toBeUndefined();
    expect(env.supabaseAnonKey).toBeUndefined();
    expect(env.sentryDsn).toBeUndefined();
  });

  it('treats empty and whitespace-only values as unset', () => {
    const env = parseEnv({ supabaseUrl: '  ', supabaseAnonKey: '', sentryDsn: '' });
    expect(env.supabaseUrl).toBeUndefined();
    expect(env.supabaseAnonKey).toBeUndefined();
  });

  it('rejects malformed URLs instead of failing later at request time', () => {
    expect(() => parseEnv({ supabaseUrl: 'not-a-url' })).toThrow(
      /Invalid environment configuration/,
    );
  });

  it('trims surrounding whitespace from values', () => {
    const env = parseEnv({ supabaseUrl: ' https://project.supabase.co ' });
    expect(env.supabaseUrl).toBe('https://project.supabase.co');
  });
});
