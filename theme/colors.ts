// Usage examples:
// colors.primary.main     // Main background
// colors.secondary.main   // Buttons
// colors.text.primary     // Main text
// colors.status.error     // Error messages

export const colors = {
  // Core theme colors
  primary: {
    main: '#0e6669',      // Primary brand color
    dark: '#09484a',      // 20% darker
    light: '#128589'      // 20% lighter
  },
  secondary: {
    main: '#cb0c47',      // Accent color for actions
    dark: '#910934',      // 20% darker
    light: '#f5356d'      // 20% lighter
  },
  text: {
    primary: '#f2f1f0',   // Primary text
    secondary: '#b3b1b0', // Secondary text
    disabled: '#7a7877'   // Disabled states
  },
  // Common colors
  common: {
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent'
  },
  // Status colors
  status: {
    error: '#ff3d69',     // Existing pink as error
    success: '#0e6669',   // Reuse primary color
    warning: '#ffb74d'    // New warning color
  }
};

// Optional: Export type for TypeScript support
export type AppColors = typeof colors;
