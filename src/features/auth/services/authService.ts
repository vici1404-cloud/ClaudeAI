/**
 * Pure auth domain logic — no React, no Supabase, no Expo. Everything
 * here is trivially unit-testable and is the single place validation and
 * age-gate rules live.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MINIMUM_AGE = 18;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Whole years between a birth date and a reference date (default: today). */
export function ageInYears(birthDate: string, now: Date = new Date()): number {
  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) return Number.NaN;
  let age = now.getFullYear() - dob.getFullYear();
  const monthDelta = now.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

export function isOfLegalDrinkingAge(birthDate: string, now: Date = new Date()): boolean {
  const age = ageInYears(birthDate, now);
  return Number.isFinite(age) && age >= MINIMUM_AGE;
}

/** The latest birth date that still qualifies — used to cap the date picker. */
export function latestAllowedBirthDate(now: Date = new Date()): Date {
  return new Date(now.getFullYear() - MINIMUM_AGE, now.getMonth(), now.getDate());
}
