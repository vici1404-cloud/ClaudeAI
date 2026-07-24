import type { Session, User } from '@supabase/supabase-js';

/** Social identity providers. Apple is intentionally absent for now; add
 *  'apple' here + one AuthApi method to enable it (App Store 4.8). */
export type OAuthProvider = 'google';

export interface AuthProfile {
  id: string;
  displayName: string | null;
  country: string | null;
  birthDate: string | null; // ISO date; null until the age gate is completed
}

export interface SessionState {
  /** undefined = still restoring from storage; null = signed out. */
  session: Session | null | undefined;
  user: User | null;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
