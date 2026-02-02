/**
 * ProofIt - Global Theme Configuration
 * Minimal Dark Mode Aesthetic
 * 
 * This file contains all design tokens and theme values
 * used throughout the application for consistency.
 */

export const theme = {
  // Core Colors - Minimal Dark Mode
  colors: {
    // Backgrounds
    background: {
      primary: '#0a0a0a',
      card: '#141414',
      surface: '#1a1a1a',
      elevated: '#202020',
    },
    
    // Borders
    border: {
      default: '#262626',
      light: '#333333',
      focus: '#404040',
    },
    
    // Activity types - muted/minimal colors
    pillars: {
      iron: {
        primary: '#888888',
        secondary: '#999999',
        glow: 'rgba(136, 136, 136, 0.2)',
        gradient: ['#888888', '#999999'],
      },
      path: {
        primary: '#888888',
        secondary: '#999999',
        glow: 'rgba(136, 136, 136, 0.2)',
        gradient: ['#888888', '#999999'],
      },
      deep: {
        primary: '#888888',
        secondary: '#999999',
        glow: 'rgba(136, 136, 136, 0.2)',
        gradient: ['#888888', '#999999'],
      },
      snap: {
        primary: '#888888',
        secondary: '#999999',
        glow: 'rgba(136, 136, 136, 0.2)',
        gradient: ['#888888', '#999999'],
      },
    },
    
    // Accent color - single muted accent
    accent: {
      primary: '#ffffff',
      secondary: '#cccccc',
      muted: '#666666',
    },
    
    // Text
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      muted: '#666666',
      inverse: '#0a0a0a',
    },
    
    // Status
    status: {
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
    },
    
    // Overlays
    overlay: {
      light: 'rgba(255, 255, 255, 0.03)',
      medium: 'rgba(255, 255, 255, 0.06)',
      dark: 'rgba(0, 0, 0, 0.5)',
      heavy: 'rgba(0, 0, 0, 0.8)',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      regular: 'Inter',
      medium: 'InterMedium',
      semibold: 'InterSemiBold',
      bold: 'InterBold',
      mono: 'JetBrainsMono',
    },
    fontSize: {
      xs: 10,
      sm: 12,
      base: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    lineHeight: {
      tight: 1.1,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  
  // Spacing (8px base grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
  },
  
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    base: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 12,
    },
    glow: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 0,
    }),
  },
  
  // Animation Durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Safe Areas
  safeArea: {
    top: 44,
    bottom: 34,
  },
  
  // Component-specific
  components: {
    tabBar: {
      height: 80,
      iconSize: 24,
    },
    card: {
      padding: 16,
      borderRadius: 16,
    },
    button: {
      height: 48,
      borderRadius: 12,
    },
    input: {
      height: 48,
      borderRadius: 10,
    },
    avatar: {
      sm: 32,
      md: 40,
      lg: 56,
      xl: 80,
    },
  },
} as const;

// Pillar configuration with metadata
export const PILLARS = {
  iron: {
    id: 'iron',
    name: 'Gym',
    description: 'Log your workout',
    icon: 'Dumbbell',
    color: theme.colors.pillars.iron.primary,
    gradient: theme.colors.pillars.iron.gradient,
  },
  path: {
    id: 'path',
    name: 'Run',
    description: 'Track your run',
    icon: 'Route',
    color: theme.colors.pillars.path.primary,
    gradient: theme.colors.pillars.path.gradient,
  },
  deep: {
    id: 'deep',
    name: 'Study',
    description: 'Focus session',
    icon: 'Brain',
    color: theme.colors.pillars.deep.primary,
    gradient: theme.colors.pillars.deep.gradient,
  },
  snap: {
    id: 'snap',
    name: 'Notes',
    description: 'Daily check-in',
    icon: 'Sparkles',
    color: theme.colors.pillars.snap.primary,
    gradient: theme.colors.pillars.snap.gradient,
  },
} as const;

export type PillarType = keyof typeof PILLARS;

export default theme;
