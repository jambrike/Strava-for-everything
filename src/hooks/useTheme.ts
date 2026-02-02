import { useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';

/**
 * Hook to access theme values with type safety
 * Currently always returns dark theme values
 */
export function useTheme() {
  // Force dark mode for the Gemini aesthetic
  const colorScheme = 'dark';
  
  return {
    colors: theme.colors,
    typography: theme.typography,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    shadows: theme.shadows,
    isDark: true,
    colorScheme,
  };
}

export default useTheme;
