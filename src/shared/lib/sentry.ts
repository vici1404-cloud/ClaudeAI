import * as Sentry from '@sentry/react-native';

import { getEnv } from './env';

/**
 * Initializes crash reporting when a DSN is configured. Safe to call
 * unconditionally: without a DSN this is a no-op, so local dev and CI
 * need no Sentry account. Source-map upload is wired in EAS once the
 * Sentry org/project exist (see README).
 */
export function initSentry(): void {
  const { sentryDsn } = getEnv();
  if (!sentryDsn) {
    return;
  }
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.2,
    sendDefaultPii: false,
  });
}
