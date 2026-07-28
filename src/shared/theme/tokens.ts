import { palette } from './palette';

/**
 * Design tokens. Screens never hardcode raw values — they compose
 * NativeWind classes (see tailwind.config.js) or import these tokens
 * for imperative APIs (navigation themes, animations, native props).
 */

export const colors = {
  ink: palette.ink,
  surface: palette.surface,
  surfaceRaised: palette.surfaceRaised,
  glassBorder: palette.glassBorder,
  glassFill: palette.glassFill,
  gold: palette.gold,
  goldBright: palette.goldBright,
  copper: palette.copper,
  cream: palette.cream,
  mist: palette.mist,
  slate: palette.slate,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
} as const;

/** 4pt base grid. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  card: 20,
  panel: 28,
  pill: 999,
} as const;

/**
 * Motion tokens. Fluid, understated: fast enough to feel instant,
 * slow enough to read as intentional.
 */
export const motion = {
  duration: {
    fast: 150,
    base: 250,
    slow: 400,
  },
  /** Scale applied to pressables on press-in. */
  pressScale: 0.97,
} as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 16, fontWeight: '600' },
} as const;

export type TypographyVariant = keyof typeof typography;
