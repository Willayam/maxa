/**
 * Maxa Design System v3 - Duolingo-inspired
 *
 * Aesthetic: Clean, playful Duolingo-style design
 * - Golden yellow (#FFC800) as primary
 * - Cards with 2px gray borders (no shadows)
 * - 3D pressed button effects
 * - Bold, extra-bold typography
 */

import { Platform, TextStyle, ViewStyle } from 'react-native';

// ============================================
// PRIMITIVE TOKENS (Duolingo-inspired palette)
// ============================================

export const Primitives = {
  // Primary Yellow (Duolingo style)
  yellow: {
    50: '#FFFBEB',
    100: '#FFF8E1',
    200: '#FFECB3',
    300: '#FFE082',
    400: '#FFD54F',
    500: '#FFC800', // ← PRIMARY (Duolingo yellow)
    600: '#E5A400', // ← Dark variant for 3D button effect
    700: '#CC9200',
    800: '#A67500',
    900: '#7A5600',
  },

  // Blue (Duolingo cyan)
  blue: {
    50: '#E0F7FA',
    100: '#B2EBF2',
    200: '#80DEEA',
    300: '#4DD0E1',
    400: '#26C6DA',
    500: '#00E5FF', // ← Duolingo blue
    600: '#00B8CC',
    700: '#008BA3',
    800: '#006064',
    900: '#004D40',
  },

  // Neutral (Duolingo grays)
  neutral: {
    0: '#FFFFFF',
    50: '#F8F9FA', // ← Background
    100: '#F0F0F0',
    200: '#E0E6EB', // ← Border color (duo-gray)
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#6C7A89', // ← Muted text
    600: '#5A6A78',
    700: '#404040',
    800: '#2C3E50', // ← Primary text
    900: '#1A1A1A',
    1000: '#000000',
  },

  // Success - Green
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    400: '#58CC02', // ← Duolingo green
    500: '#58CC02',
    600: '#46A302',
  },

  // Warning - Amber
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
  },

  // Error - Pink/Red
  error: {
    50: '#FFF1F5',
    100: '#FFE4EC',
    400: '#FF2B8F', // ← Duolingo pink
    500: '#FF2B8F',
    600: '#E0257D',
  },

  // Streak Orange (Duolingo)
  streak: '#FF7A00',

  // Pure
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// HP Sections (Muted pastel colors)
export const SectionColors = {
  // Verbal sections - blue family (muted)
  ORD: {
    light: '#E8F4FD',
    dark: '#1E3A5F',
    accent: '#5B9BD5',
    text: '#2563EB',
  },
  LÄS: {
    light: '#E8F0FE',
    dark: '#1E2D4A',
    accent: '#4A7FC1',
    text: '#1D4ED8',
  },
  MEK: {
    light: '#EDE8FD',
    dark: '#2D1E4A',
    accent: '#7B68C1',
    text: '#7C3AED',
  },
  ELF: {
    light: '#F0E8FD',
    dark: '#351E4A',
    accent: '#9B68C1',
    text: '#8B5CF6',
  },

  // Quantitative sections - teal/green family (muted)
  XYZ: {
    light: '#E8FDF4',
    dark: '#1E4A3A',
    accent: '#5BC1A0',
    text: '#059669',
  },
  KVA: {
    light: '#E8FDFD',
    dark: '#1E4A4A',
    accent: '#5BC1C1',
    text: '#0891B2',
  },
  NOG: {
    light: '#E8FDE8',
    dark: '#1E4A1E',
    accent: '#5BC15B',
    text: '#16A34A',
  },
  DTK: {
    light: '#F0FDE8',
    dark: '#2D4A1E',
    accent: '#7BC15B',
    text: '#65A30D',
  },
};

// ============================================
// SEMANTIC COLORS (Theme-aware)
// ============================================

export const Colors = {
  light: {
    // Backgrounds (Duolingo style)
    background: Primitives.neutral[50], // #F8F9FA - light gray background
    backgroundSecondary: Primitives.neutral[0], // #FFFFFF
    backgroundTertiary: Primitives.neutral[200], // #E0E6EB - for progress track
    cardBackground: Primitives.neutral[0], // #FFFFFF - white cards

    // Text (Duolingo style)
    text: Primitives.neutral[800], // #2C3E50 - dark blue-gray
    textSecondary: Primitives.neutral[500], // #6C7A89 - muted
    textTertiary: Primitives.neutral[500], // #6C7A89
    textInverse: Primitives.neutral[0], // #FFFFFF
    textOnPrimary: Primitives.neutral[800], // Dark text on yellow

    // Brand - Duolingo Yellow
    primary: Primitives.yellow[500], // #FFC800
    primaryLight: Primitives.yellow[100],
    primaryDark: Primitives.yellow[600], // #E5A400 - for 3D button border
    primaryHover: Primitives.yellow[600],
    primaryPressed: Primitives.yellow[700],

    // Blue accent
    blue: Primitives.blue[500], // #00E5FF
    blueDark: Primitives.blue[600],

    // Secondary Interactive
    secondary: Primitives.neutral[0],
    secondaryHover: Primitives.neutral[100],

    // Accent
    accent: Primitives.yellow[500],
    accentLight: Primitives.yellow[100],
    accentDark: Primitives.yellow[600],

    // Semantic
    success: Primitives.success[500],
    successLight: Primitives.success[100],
    warning: Primitives.warning[500],
    warningLight: Primitives.warning[100],
    error: Primitives.error[500],
    errorLight: Primitives.error[100],

    // Borders & Dividers (Duolingo uses 2px gray borders)
    border: Primitives.neutral[200], // #E0E6EB - duo-gray
    borderSubtle: Primitives.neutral[200],
    borderFocus: Primitives.yellow[500],
    divider: Primitives.neutral[200],

    // Components
    cardBorder: Primitives.neutral[200], // #E0E6EB - 2px border for cards
    inputBackground: Primitives.neutral[0],
    inputBorder: Primitives.neutral[200],

    // Tab bar
    tabIconDefault: Primitives.neutral[500],
    tabIconSelected: Primitives.yellow[500],
    tint: Primitives.yellow[500],
    icon: Primitives.neutral[500],

    // Gamification
    streak: Primitives.streak, // #FF7A00
    star: Primitives.yellow[500],

    // Progress
    progressTrack: Primitives.neutral[200], // #E0E6EB
    progressFill: Primitives.yellow[500], // #FFC800
    progressWeak: Primitives.error[500],
    progressMedium: Primitives.warning[500],
    progressStrong: Primitives.success[500],

    // Overlay
    overlay: 'rgba(0,0,0,0.5)',
  },

  dark: {
    // Backgrounds - Rich deep indigo/navy
    background: '#0F0D1A', // Deep indigo-black
    backgroundSecondary: '#1A1625', // Slightly lighter indigo
    backgroundTertiary: '#252136', // Card/elevated surfaces
    cardBackground: '#1E1A2D', // Rich card background

    // Text - High contrast
    text: '#FFFFFF',
    textSecondary: '#A8A3B8', // Soft lavender-gray
    textTertiary: '#6B6580', // Muted purple-gray
    textInverse: '#0F0D1A',
    textOnPrimary: Primitives.neutral[800],

    // Brand - Softened amber-gold (warm and inviting without eye strain)
    primary: '#F7C948',
    primaryLight: '#2D2815',
    primaryDark: '#D4A528',
    primaryHover: '#FFDA6A',
    primaryPressed: '#D4A528',

    // Blue accent - Cyan for energy
    blue: '#00E5FF',
    blueDark: '#00B8D4',

    // Secondary - Subtle glass-like
    secondary: '#2A2541', // Frosted dark purple
    secondaryHover: '#363050', // Lift on hover

    // Accent
    accent: '#F7C948',
    accentLight: '#2D2815',
    accentDark: '#FFDA6A',

    // Semantic - Vibrant but balanced
    success: '#4ADE80', // Fresh green
    successLight: '#1A3D2E', // Dark green tint
    warning: '#FBBF24', // Warm amber
    warningLight: '#3D3520', // Dark amber tint
    error: '#FF6B9D', // Soft pink-red
    errorLight: '#3D1A2E', // Dark pink tint

    // Borders - Subtle purple tint
    border: '#3A3550', // Visible but not harsh
    borderSubtle: '#2A2541', // Very subtle
    borderFocus: '#F7C948',
    divider: '#2A2541',

    // Components
    cardBorder: '#3A3550',
    inputBackground: '#1E1A2D',
    inputBorder: '#3A3550',

    // Tab bar
    tabIconDefault: '#6B6580',
    tabIconSelected: '#F7C948',
    tint: '#F7C948',
    icon: '#A8A3B8',

    // Gamification
    streak: '#FF8C42', // Warm orange
    star: '#F7C948',

    // Progress
    progressTrack: '#2A2541',
    progressFill: '#F7C948',
    progressWeak: '#FF6B9D',
    progressMedium: '#FBBF24',
    progressStrong: '#4ADE80',

    // Overlay
    overlay: 'rgba(15, 13, 26, 0.85)',
  },
};

// Legacy Palette export for backwards compatibility
export const Palette = {
  indigo: Primitives.yellow, // Map to yellow for migration
  coral: Primitives.yellow,
  emerald: Primitives.success,
  amber: Primitives.warning,
  rose: Primitives.error,
  slate: Primitives.neutral,
  white: Primitives.white,
  black: Primitives.black,
  transparent: Primitives.transparent,
};

// ============================================
// TYPOGRAPHY
// ============================================

// Nunito font family - friendly, rounded, warm aesthetic
export const FontFamily = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
  // Aliases for different use cases
  display: 'Nunito_800ExtraBold',
  displayBold: 'Nunito_900Black',
  body: 'Nunito_400Regular',
  bodyMedium: 'Nunito_500Medium',
  bodyBold: 'Nunito_700Bold',
  mono: Platform.select({ ios: 'SF Mono', android: 'monospace', default: 'monospace' }),
};

export const FontSize = {
  // Display sizes
  hero: 48,
  '5xl': 40,
  '4xl': 32,
  '3xl': 28,
  '2xl': 24,
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  xl: 20,

  // Body sizes
  lg: 18,
  base: 16,
  md: 16,
  sm: 14,
  xs: 12,
  xxs: 10,
};

export const LineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

export const FontWeight = {
  normal: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
  black: '900' as TextStyle['fontWeight'], // Duolingo uses font-black
};

export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

// Pre-built typography styles with Nunito font family
export const Typography = {
  hero: {
    fontSize: FontSize.hero,
    fontFamily: FontFamily.extrabold,
    lineHeight: FontSize.hero * LineHeight.tight,
    letterSpacing: -1,
  },
  h1: {
    fontSize: FontSize.h1,
    fontFamily: FontFamily.bold,
    lineHeight: FontSize.h1 * LineHeight.tight,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
    lineHeight: FontSize.h2 * LineHeight.snug,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: FontSize.h3,
    fontFamily: FontFamily.semibold,
    lineHeight: FontSize.h3 * LineHeight.snug,
  },
  h4: {
    fontSize: FontSize.h4,
    fontFamily: FontFamily.semibold,
    lineHeight: FontSize.h4 * LineHeight.snug,
  },
  h5: {
    fontSize: FontSize.h5,
    fontFamily: FontFamily.semibold,
    lineHeight: FontSize.h5 * LineHeight.normal,
  },
  bodyLg: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.regular,
    lineHeight: FontSize.lg * LineHeight.relaxed,
  },
  body: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  bodySm: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },
  caption: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    lineHeight: FontSize.xs * LineHeight.snug,
  },
  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semibold,
    lineHeight: FontSize.xs * LineHeight.tight,
    letterSpacing: 0.5,
  },
  button: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    lineHeight: FontSize.base * LineHeight.snug,
  },
  buttonSm: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semibold,
    lineHeight: FontSize.sm * LineHeight.snug,
  },
  stat: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
    lineHeight: FontSize.h2 * LineHeight.tight,
    letterSpacing: -0.5,
  },
};

// ============================================
// SPACING
// ============================================

export const Spacing = {
  0: 0,
  1: 4,
  xxs: 2,
  xs: 4,
  2: 8,
  sm: 8,
  3: 12,
  md: 12,
  4: 16,
  base: 16,
  5: 20,
  lg: 20,
  6: 24,
  xl: 24,
  7: 28,
  8: 32,
  '2xl': 32,
  10: 40,
  '3xl': 40,
  12: 48,
  '4xl': 48,
  16: 64,
  '5xl': 64,
  20: 80,
  '6xl': 80,
};

// ============================================
// BORDER RADIUS
// ============================================

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16, // 1rem
  '2xl': 20, // 1.25rem - Duolingo rounded-2xl
  '3xl': 24,
  full: 9999,
};

// Button 3D effect depth
export const ButtonDepth = 6; // border-b-[6px] for 3D pressed effect

// ============================================
// SHADOWS
// ============================================

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
};

// Dark mode shadows (stronger for visibility)
export const ShadowsDark = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
};

// ============================================
// ANIMATION
// ============================================

export const Animation = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  easing: {
    easeOut: 'easeOut',
    easeIn: 'easeIn',
    easeInOut: 'easeInOut',
    bounce: 'bounce',
    spring: { damping: 15, stiffness: 150 },
    springBouncy: { damping: 10, stiffness: 200 },
    springGentle: { damping: 20, stiffness: 100 },
  },
};

// ============================================
// Z-INDEX
// ============================================

export const ZIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  tooltip: 500,
  toast: 600,
};

// ============================================
// COMPONENT SIZES
// ============================================

export const ComponentSize = {
  button: {
    sm: { height: 36, paddingHorizontal: Spacing.md },
    md: { height: 44, paddingHorizontal: Spacing.lg },
    lg: { height: 52, paddingHorizontal: Spacing.xl },
    xl: { height: 56, paddingHorizontal: Spacing['2xl'] },
  },
  input: {
    sm: { height: 36 },
    md: { height: 44 },
    lg: { height: 52 },
  },
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
    '2xl': 96,
  },
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  chip: {
    sm: { height: 28, paddingHorizontal: Spacing.sm },
    md: { height: 32, paddingHorizontal: Spacing.md },
    lg: { height: 40, paddingHorizontal: Spacing.base },
  },
  progressBar: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
  },
  tabBar: {
    height: 84,
    iconSize: 24,
  },
  card: {
    radius: BorderRadius['3xl'], // 24px
    padding: {
      sm: Spacing.md,
      md: Spacing.lg,
      lg: Spacing.xl,
    },
  },
};

// Legacy Fonts export for backwards compatibility
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
