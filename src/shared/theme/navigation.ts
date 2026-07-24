import { DarkTheme } from 'expo-router';

import { colors } from './tokens';

/** Dark-first navigation theme; light theme ships with the M2 settings toggle. */
export const navigationTheme: typeof DarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.gold,
    background: colors.ink,
    card: colors.surface,
    text: colors.cream,
    border: colors.glassBorder,
    notification: colors.gold,
  },
};
