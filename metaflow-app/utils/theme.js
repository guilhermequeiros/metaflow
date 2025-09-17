import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Colors } from '../constants/Colors';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Cores principais
    primary: Colors.light.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: Colors.light.primary + '20',
    onPrimaryContainer: Colors.light.primary,
    
    // Cores secundárias
    secondary: Colors.light.secondary,
    onSecondary: '#FFFFFF',
    secondaryContainer: Colors.light.secondary + '20',
    onSecondaryContainer: Colors.light.secondary,
    
    // Backgrounds
    background: Colors.light.background,
    onBackground: Colors.light.text,
    surface: Colors.light.surface,
    onSurface: Colors.light.text,
    surfaceVariant: Colors.light.surfaceVariant,
    onSurfaceVariant: Colors.light.textSecondary,
    
    // Contornos e bordas
    outline: Colors.light.outline,
    outlineVariant: Colors.light.border,
    
    // Estados
    error: Colors.light.error,
    onError: '#FFFFFF',
    errorContainer: Colors.light.error + '20',
    onErrorContainer: Colors.light.error,
    
    // Outros
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: Colors.dark.surface,
    inverseOnSurface: Colors.dark.text,
    inversePrimary: Colors.dark.primary,
    
    // Elevação
    elevation: {
      level0: 'transparent',
      level1: Colors.light.surface,
      level2: '#F1F5F9',
      level3: '#E2E8F0',
      level4: '#CBD5E1',
      level5: '#94A3B8',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Cores principais
    primary: Colors.dark.primary,
    onPrimary: Colors.dark.background,
    primaryContainer: Colors.dark.primary + '30',
    onPrimaryContainer: Colors.dark.primary,
    
    // Cores secundárias
    secondary: Colors.dark.secondary,
    onSecondary: Colors.dark.background,
    secondaryContainer: Colors.dark.secondary + '30',
    onSecondaryContainer: Colors.dark.secondary,
    
    // Backgrounds
    background: Colors.dark.background,
    onBackground: Colors.dark.text,
    surface: Colors.dark.surface,
    onSurface: Colors.dark.text,
    surfaceVariant: Colors.dark.surfaceVariant,
    onSurfaceVariant: Colors.dark.textSecondary,
    
    // Contornos e bordas
    outline: Colors.dark.outline,
    outlineVariant: Colors.dark.border,
    
    // Estados
    error: Colors.dark.error,
    onError: Colors.dark.background,
    errorContainer: Colors.dark.error + '30',
    onErrorContainer: Colors.dark.error,
    
    // Outros
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: Colors.light.surface,
    inverseOnSurface: Colors.light.text,
    inversePrimary: Colors.light.primary,
    
    // Elevação
    elevation: {
      level0: 'transparent',
      level1: Colors.dark.surface,
      level2: '#334155',
      level3: '#475569',
      level4: '#64748B',
      level5: '#94A3B8',
    },
  },
};

// Função para obter cores específicas baseadas no tema
export const getThemeColors = (isDarkMode) => {
  return isDarkMode ? Colors.dark : Colors.light;
};

// Função para obter cores de status baseadas no tema
export const getStatusColors = (isDarkMode) => {
  return isDarkMode ? StatusColors.dark : StatusColors.light;
};

export default { lightTheme, darkTheme, getThemeColors, getStatusColors };

