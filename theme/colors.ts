// Usage examples:
// colors.primary.main     // Main background
// colors.secondary.main   // Buttons
// colors.text.primary     // Main text
// colors.status.error     // Error messages

export const colors = {
  // Core theme colors
  text: '#010309',
  background: '#c9d5f7',
  accent1: '#f7ebc6',
  accent2: '#aabcf3',
  accent3: '#ae8919',

  // Common colors
  common: {
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent',
  },
  // Status colors
  status: {
    error: '#ff3d69', // Existing pink as error
    success: '#0e6669', // Reuse primary color
    warning: '#ffb74d', // New warning color
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// Optional: Export type for TypeScript support
export type AppColors = typeof colors;
