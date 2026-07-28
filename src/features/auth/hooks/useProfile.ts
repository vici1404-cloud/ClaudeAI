import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getSupabase } from '@/shared/lib/supabase';

import type { AuthProfile } from '../types';
import { useSessionStore } from './sessionStore';

const profileKey = (userId: string) => ['profile', userId] as const;

async function fetchProfile(userId: string): Promise<AuthProfile | null> {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('id, display_name, country, birth_date')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    displayName: data.display_name,
    country: data.country,
    birthDate: data.birth_date,
  };
}

/** Current user's profile row (auto-created by DB trigger on first sign-in). */
export function useProfile() {
  const userId = useSessionStore((s) => s.user?.id);
  return useQuery({
    queryKey: profileKey(userId ?? 'anon'),
    queryFn: () => fetchProfile(userId as string),
    enabled: !!userId,
  });
}

/** Persists the age-gate birth date (and optional display name). */
export function useCompleteAgeGate() {
  const userId = useSessionStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { birthDate: string; displayName?: string }) => {
      if (!userId) throw new Error('Not signed in.');
      const { error } = await getSupabase()
        .from('profiles')
        .update({ birth_date: input.birthDate, display_name: input.displayName ?? null })
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: profileKey(userId) });
    },
  });
}
