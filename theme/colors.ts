// Usage examples:
// colors.primary.main     // Main background
// colors.secondary.main   // Buttons
// colors.text.primary     // Main text
// colors.status.error     // Error messages

export const colors = {
  // Core theme colors
  text: '#151f3d',  // Dark navy - from logo text
  background: '#f0f4fb',  // Lighter, more modern background
  accent1: '#fff8e1',  // Warmer, softer accent
  accent2: '#0092c6',  // Mid-blue from logo
  accent3: '#00d887',  // Mid-green from logo

  primary: '#151f3d',  // Darker, more saturated primary color 
  secondary: '#0092c6',  // Mid-blue from logo - for secondary elements
  // Brand colors from logo
  brand: {
    darkBlue: '#0062b1',  // Bottom of logo
    midBlue: '#0092c6',   // Middle-bottom of logo
    lightBlue: '#00bbd4', // Middle of logo
    turquoise: '#00d8c6',  // Middle-top of logo
    lightGreen: '#00d887', // Upper-middle of logo
    green: '#40d848',      // Top of logo
    darkText: '#151f3d',   // Logo text color
  },

  // Common colors
  common: {
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent',
  },
  
  // Status colors
  status: {
    error: '#ff3d69',
    success: '#00d887', // Using brand green
    warning: '#fbbc05',
    info: '#0092c6',    // Using brand blue
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
  
  // Enhanced gradients matching the HeadshotAI logo
  gradients: {
    primary: ['#40d848', '#00d887', '#00d8c6', '#00bbd4', '#0092c6', '#0062b1'],  // Full logo gradient
    header: ['#40d848', '#00bbd4'],  // Green to cyan - modern, tech
    button: ['#0092c6', '#0062b1'],  // Blue gradient - professional, trustworthy
    card: ['#00d887', '#00bbd4'],    // Green to cyan - fresh, innovative
    success: ['#40d848', '#00d887'], // Green gradient - fresh, positive
    cool: ['#00bbd4', '#0092c6'],    // Cyan to blue - calm, tech-focused
    warm: ['#f97316', '#db2777'],    // Orange to pink - vibrant, friendly (non-logo colors for contrast)
    dark: ['#151f3d', '#273456']     // Dark navy gradients - sophisticated, premium
  }
};

// Optional: Export type for TypeScript support
export type AppColors = typeof colors;
