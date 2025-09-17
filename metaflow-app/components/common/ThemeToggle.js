import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Menu, Text, Divider } from 'react-native-paper';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ style }) => {
  const { themeMode, setTheme, isDarkMode } = useTheme();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleThemeChange = async (mode) => {
    await setTheme(mode);
    closeMenu();
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return 'white-balance-sunny';
      case 'dark':
        return 'moon-waning-crescent';
      case 'system':
      default:
        return 'theme-light-dark';
    }
  };

  const getThemeLabel = (mode) => {
    switch (mode) {
      case 'light':
        return 'Tema Claro';
      case 'dark':
        return 'Tema Escuro';
      case 'system':
      default:
        return 'Sistema';
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon={getThemeIcon()}
            onPress={openMenu}
            iconColor={isDarkMode ? '#F9FAFB' : '#1F2937'}
            style={styles.iconButton}
          />
        }
        contentStyle={styles.menuContent}
      >
        <Text style={styles.menuTitle}>Escolher Tema</Text>
        <Divider style={styles.divider} />
        
        <Menu.Item
          onPress={() => handleThemeChange('light')}
          title="Claro"
          leadingIcon="white-balance-sunny"
          titleStyle={[
            styles.menuItemText,
            themeMode === 'light' && styles.selectedMenuItem
          ]}
        />
        
        <Menu.Item
          onPress={() => handleThemeChange('dark')}
          title="Escuro"
          leadingIcon="moon-waning-crescent"
          titleStyle={[
            styles.menuItemText,
            themeMode === 'dark' && styles.selectedMenuItem
          ]}
        />
        
        <Menu.Item
          onPress={() => handleThemeChange('system')}
          title="Sistema"
          leadingIcon="theme-light-dark"
          titleStyle={[
            styles.menuItemText,
            themeMode === 'system' && styles.selectedMenuItem
          ]}
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    margin: 0,
  },
  menuContent: {
    borderRadius: 12,
    minWidth: 160,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
  divider: {
    marginBottom: 4,
  },
  menuItemText: {
    fontSize: 14,
  },
  selectedMenuItem: {
    fontWeight: 'bold',
    color: '#6366F1',
  },
});

export default ThemeToggle;

