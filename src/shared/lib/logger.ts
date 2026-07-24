import * as Sentry from '@sentry/react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Central logger. Console in development; breadcrumbs + captured
 * exceptions in production builds (when Sentry is configured).
 * Never log PII: no emails, tokens, or free-text user input.
 */
function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (__DEV__) {
    const line = context ? `${message} ${JSON.stringify(context)}` : message;
    console[level === 'debug' ? 'log' : level](`[mixai] ${line}`);
    return;
  }
  Sentry.addBreadcrumb({ level: level === 'warn' ? 'warning' : level, message, data: context });
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    log('error', message, context);
    if (!__DEV__ && error instanceof Error) {
      Sentry.captureException(error, { extra: context });
    }
  },
};
