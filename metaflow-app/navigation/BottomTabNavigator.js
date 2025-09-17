import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// Importar os ecrãs
import DashboardScreen from '../screens/DashboardScreen';
import HabitsScreen from '../screens/HabitsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import TasksScreen from '../screens/TasksScreen';
import NotesScreen from '../screens/NotesScreen';
import JournalScreen from '../screens/JournalScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Hábitos':
              iconName = focused ? 'check-circle' : 'check-circle-outline';
              break;
            case 'Metas':
              iconName = focused ? 'target' : 'target-variant';
              break;
            case 'Tarefas':
              iconName = focused ? 'view-column' : 'view-column-outline';
              break;
            case 'Notas':
              iconName = focused ? 'note' : 'note-outline';
              break;
            case 'Diário':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Configurações':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outline,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Hábitos" component={HabitsScreen} />
      <Tab.Screen name="Metas" component={GoalsScreen} />
      <Tab.Screen name="Tarefas" component={TasksScreen} />
      <Tab.Screen name="Notas" component={NotesScreen} />
      <Tab.Screen name="Diário" component={JournalScreen} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

