export const typography = {
  fonts: {
    regular: 'Nunito',
    light: 'NunitoLight',
    medium: 'NunitoMedium',
    semiBold: 'NunitoSemiBold',
    bold: 'NunitoBold',
    extraBold: 'NunitoExtraBold',
    black: 'NunitoBlack',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
    '4xl': 36,
  },
} as const;

export type FontFamily = keyof typeof typography.fonts;
export type FontSize = keyof typeof typography.sizes; 