import { describe, expect, it } from 'vitest';

import {
  ageInYears,
  isOfLegalDrinkingAge,
  isValidEmail,
  latestAllowedBirthDate,
  MINIMUM_AGE,
  normalizeEmail,
} from './authService';

describe('email helpers', () => {
  it('accepts well-formed addresses', () => {
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('  first.last@example.com ')).toBe(true);
  });

  it('rejects malformed addresses', () => {
    for (const bad of ['', 'nope', 'a@b', 'a b@c.com', '@x.com', 'x@.com']) {
      expect(isValidEmail(bad)).toBe(false);
    }
  });

  it('normalizes to trimmed lowercase', () => {
    expect(normalizeEmail('  Foo@Bar.COM ')).toBe('foo@bar.com');
  });
});

describe('age gate', () => {
  const now = new Date('2026-07-24T12:00:00Z');

  it('computes whole years, respecting month/day', () => {
    expect(ageInYears('2000-07-24', now)).toBe(26);
    expect(ageInYears('2000-07-25', now)).toBe(25); // birthday tomorrow
    expect(ageInYears('2008-07-24', now)).toBe(18);
  });

  it('passes exactly at the minimum age', () => {
    expect(isOfLegalDrinkingAge('2008-07-24', now)).toBe(true);
  });

  it('fails one day under the minimum age', () => {
    expect(isOfLegalDrinkingAge('2008-07-25', now)).toBe(false);
  });

  it('rejects invalid dates', () => {
    expect(Number.isNaN(ageInYears('not-a-date', now))).toBe(true);
    expect(isOfLegalDrinkingAge('not-a-date', now)).toBe(false);
  });

  it('latestAllowedBirthDate is exactly MINIMUM_AGE years ago', () => {
    const latest = latestAllowedBirthDate(now);
    expect(now.getFullYear() - latest.getFullYear()).toBe(MINIMUM_AGE);
  });
});
