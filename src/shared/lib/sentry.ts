import { getEnv } from './env';

/**
 * Initializes crash reporting when a DSN is configured. Safe to call
 * unconditionally: without a DSN this is a no-op, so local dev and CI
 * need no Sentry account.
 *
 * @sentry/react-native is required lazily — its native module doesn't
 * exist in Expo Go, and a static import would break Expo Go previews.
 * Production (dev-client/EAS) builds always have it linked.
 * Source-map upload is wired in EAS once the Sentry org/project exist
 * (see README).
 */
export function initSentry(): void {
  const { sentryDsn } = getEnv();
  if (!sentryDsn) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy on purpose: no native module in Expo Go
  const Sentry = require('@sentry/react-native') as typeof import('@sentry/react-native');
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.2,
    sendDefaultPii: false,
  });
}
