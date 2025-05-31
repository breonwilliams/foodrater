export const theme = {
  colors: {
    light: {
      bgPrimary: '#fafbfb',
      bgSecondary: '#ffffff', 
      bgTertiary: '#CCE4E4',
      textPrimary: '#090909',
      textSecondary: '#1a202c',
      textTertiary: '#2d3748',
      textMuted: '#4a5568',
      accentYellow: '#FFDA80',
      accentDark: '#090909',
      borderLight: '#e2e8f0',
    },
    dark: {
      bgPrimary: '#090909',
      bgSecondary: '#1a1a1a',
      bgTertiary: '#2a2a2a', 
      textPrimary: '#ffffff',
      textSecondary: '#e5e5e5',
      textTertiary: '#b3b3b3',
      textMuted: '#808080',
      accentYellow: '#FFDA80',
      accentDark: '#090909',
      borderLight: '#333333',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 50,
  },
  typography: {
    fontFamily: 'System',
    sizes: {
      xs: 11,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
    },
    weights: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    }
  }
};

export type Theme = typeof theme;