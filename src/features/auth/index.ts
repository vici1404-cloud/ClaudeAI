export { useAuthBootstrap } from './hooks/useAuthBootstrap';
export { useAuthGuard } from './hooks/useAuthGuard';
export { useAuthActions } from './hooks/useAuthActions';
export { useProfile, useCompleteAgeGate } from './hooks/useProfile';
export { useSessionStore } from './hooks/sessionStore';
export {
  isValidEmail,
  normalizeEmail,
  ageInYears,
  isOfLegalDrinkingAge,
  latestAllowedBirthDate,
  MINIMUM_AGE,
} from './services/authService';
export type { OAuthProvider, AuthProfile, AuthStatus, SessionState } from './types';
