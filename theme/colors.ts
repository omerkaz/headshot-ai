// Usage examples:
// colors.primary.main     // Main background
// colors.secondary.main   // Buttons
// colors.text.primary     // Main text
// colors.status.error     // Error messages

export const colors = {
  // Core theme colors
  text: '#010309',
  background: '#f0f4fb',  // Lighter, more modern background
  accent1: '#fff8e1',  // Warmer, softer accent
  accent2: '#7b95e0',  // Richer, more vibrant accent
  accent3: '#ae8919',

  // Common colors
  common: {
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent',
  },
  // Status colors
  status: {
    error: '#ff3d69',
    success: '#34a853', // More distinct success color
    warning: '#fbbc05', // More vibrant warning color
    info: '#4285f4',    // Added info color
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
  // Enhanced gradients with modern color combinations
  gradients: {
    primary: ['#6366f1', '#3b82f6'],  // Indigo to blue - professional, trustworthy
    secondary: ['#8b5cf6', '#ec4899'], // Purple to pink - creative, energetic
    accent: ['#f59e0b', '#ef4444'],    // Amber to red - warm, attention-grabbing
    success: ['#10b981', '#059669'],   // Emerald gradient - fresh, positive
    cool: ['#06b6d4', '#3b82f6'],      // Cyan to blue - calm, tech-focused
    warm: ['#f97316', '#db2777'],      // Orange to pink - vibrant, friendly
    elegant: ['#1e293b', '#334155']    // Slate gradients - sophisticated, premium
  }
};

// Optional: Export type for TypeScript support
export type AppColors = typeof colors;
