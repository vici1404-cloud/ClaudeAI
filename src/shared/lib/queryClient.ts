import { QueryClient } from '@tanstack/react-query';

/**
 * Server-state cache. Catalog data is long-lived and public, so we
 * default to a generous staleTime; user data hooks override per-query.
 * Offline persistence (AsyncStorage persister) arrives with the
 * inventory feature in M3, where offline reads first matter.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
