import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface SessionStore {
  /** undefined = restoring; null = signed out; Session = signed in. */
  session: Session | null | undefined;
  user: User | null;
  setSession: (session: Session | null) => void;
}

/** Global session state, kept in sync with Supabase's auth listener. */
export const useSessionStore = create<SessionStore>((set) => ({
  session: undefined,
  user: null,
  setSession: (session) => set({ session, user: session?.user ?? null }),
}));
