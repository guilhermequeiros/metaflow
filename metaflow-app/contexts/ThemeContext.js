import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../utils/theme';

const THEME_STORAGE_KEY = '@metaflow_theme';

const ThemeContext = createContext({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
  themeMode: 'system', // 'light', 'dark', 'system'
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Carregar preferência de tema do armazenamento
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Atualizar tema quando a preferência ou esquema do sistema muda
  useEffect(() => {
    updateTheme();
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.error('Erro ao carregar preferência de tema:', error);
    }
  };

  const saveThemePreference = async (mode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Erro ao guardar preferência de tema:', error);
    }
  };

  const updateTheme = () => {
    let shouldUseDarkMode = false;

    switch (themeMode) {
      case 'light':
        shouldUseDarkMode = false;
        break;
      case 'dark':
        shouldUseDarkMode = true;
        break;
      case 'system':
      default:
        shouldUseDarkMode = systemColorScheme === 'dark';
        break;
    }

    setIsDarkMode(shouldUseDarkMode);
  };

  const setTheme = async (mode) => {
    setThemeMode(mode);
    await saveThemePreference(mode);
  };

  const toggleTheme = async () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    await setTheme(newMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
    themeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

