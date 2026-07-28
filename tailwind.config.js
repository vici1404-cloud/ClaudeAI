const { palette } = require('./src/shared/theme/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  // App is dark-first and forces the dark scheme; 'class' lets us set it
  // manually. 'media' (NativeWind default) throws on any manual set.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: palette.ink,
        surface: palette.surface,
        'surface-raised': palette.surfaceRaised,
        'glass-border': palette.glassBorder,
        'glass-fill': palette.glassFill,
        gold: palette.gold,
        'gold-bright': palette.goldBright,
        copper: palette.copper,
        cream: palette.cream,
        mist: palette.mist,
        slate: palette.slate,
        success: palette.success,
        warning: palette.warning,
        danger: palette.danger,
        info: palette.info,
      },
      borderRadius: {
        card: '20px',
        panel: '28px',
      },
    },
  },
  plugins: [],
};
