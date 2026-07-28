import { describe, expect, it } from 'vitest';

import { colors } from './tokens';

/** WCAG 2.x relative luminance + contrast ratio. */
function luminance(hex: string): number {
  const raw = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(raw.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Accessibility is an engineering rule, not a polish step: these tests
 * fail the build if a palette change drops text below WCAG AA.
 */
describe('palette accessibility (WCAG AA)', () => {
  const surfaces = [colors.ink, colors.surface, colors.surfaceRaised];

  it('primary text reaches 4.5:1 on every surface', () => {
    for (const bg of surfaces) {
      expect(contrast(colors.cream, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('secondary text reaches 4.5:1 on every surface', () => {
    for (const bg of surfaces) {
      expect(contrast(colors.mist, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('gold accent works as large text (3:1) on every surface', () => {
    for (const bg of surfaces) {
      expect(contrast(colors.gold, bg)).toBeGreaterThanOrEqual(3);
    }
  });

  it('ink text on gold primary buttons reaches 4.5:1', () => {
    expect(contrast(colors.ink, colors.gold)).toBeGreaterThanOrEqual(4.5);
  });
});
