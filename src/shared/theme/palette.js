/**
 * MixAI color palette — the single source of truth for color.
 * Plain CommonJS so both tailwind.config.js (Node) and TypeScript
 * modules can consume the same values.
 *
 * Dark-first luxury: near-black ink surfaces, warm off-white text,
 * amber-gold brand accent. Light theme arrives with the Settings
 * toggle in M2+; dark is the default experience.
 */
const palette = {
  // Surfaces (dark theme)
  ink: '#0B0E13', // app background
  surface: '#141924', // cards, sheets
  surfaceRaised: '#1C2331', // elevated cards, modals
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassFill: 'rgba(20, 25, 36, 0.55)',

  // Brand
  gold: '#E4A94F', // primary actions, highlights
  goldBright: '#F2C077', // pressed/hover states, gradients
  copper: '#B4633A', // secondary accent

  // Text (dark theme)
  cream: '#F4EFE6', // primary text
  mist: '#9AA3B4', // secondary text
  slate: '#5C6678', // tertiary text, disabled

  // Semantic
  success: '#4FB477',
  warning: '#E4A94F',
  danger: '#E05C5C',
  info: '#5B8DEF',
};

module.exports = { palette };
