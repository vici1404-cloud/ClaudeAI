import { getEnv } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Central logger. Console in development; breadcrumbs + captured
 * exceptions in production builds when Sentry is configured.
 * Never log PII: no emails, tokens, or free-text user input.
 *
 * Sentry is required lazily (not imported statically) so this module —
 * and everything that logs — stays loadable in Expo Go, where Sentry's
 * native module is unavailable.
 */
function sentry(): typeof import('@sentry/react-native') | undefined {
  if (!getEnv().sentryDsn) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy on purpose: no native module in Expo Go
  return require('@sentry/react-native') as typeof import('@sentry/react-native');
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (__DEV__) {
    const line = context ? `${message} ${JSON.stringify(context)}` : message;
    console[level === 'debug' ? 'log' : level](`[mixai] ${line}`);
    return;
  }
  sentry()?.addBreadcrumb({
    level: level === 'warn' ? 'warning' : level,
    message,
    data: context,
  });
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    log('error', message, context);
    if (!__DEV__ && error instanceof Error) {
      sentry()?.captureException(error, { extra: context });
    }
  },
};
