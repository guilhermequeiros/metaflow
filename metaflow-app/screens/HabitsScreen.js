import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Title, FAB, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import HabitItem from '../components/habits/HabitItem';
import HabitForm from '../components/habits/HabitForm';
import habitService from '../services/habitService';

const HabitsScreen = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Carregar hábitos quando o ecrã ganha foco
  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const loadHabits = async () => {
    try {
      setLoading(true);
      const loadedHabits = await habitService.getHabits();
      setHabits(loadedHabits);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
      showSnackbar('Erro ao carregar hábitos');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAddHabit = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleSaveHabit = async (habitData) => {
    try {
      await habitService.saveHabit(habitData);
      await loadHabits();
      
      const message = editingHabit 
        ? 'Hábito atualizado com sucesso!' 
        : 'Hábito criado com sucesso!';
      showSnackbar(message);
    } catch (error) {
      console.error('Erro ao guardar hábito:', error);
      showSnackbar('Erro ao guardar hábito');
    }
  };

  const handleDeleteHabit = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    
    Alert.alert(
      'Eliminar Hábito',
      `Tem a certeza que deseja eliminar o hábito "${habit?.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await habitService.deleteHabit(habitId);
              await loadHabits();
              showSnackbar('Hábito eliminado com sucesso!');
            } catch (error) {
              console.error('Erro ao eliminar hábito:', error);
              showSnackbar('Erro ao eliminar hábito');
            }
          },
        },
      ]
    );
  };

  const handleToggleHabit = async (habitId) => {
    try {
      await habitService.toggleHabitCompletion(habitId);
      await loadHabits();
      
      const habit = habits.find(h => h.id === habitId);
      const today = new Date().toDateString();
      const wasCompleted = habit?.completedDates?.some(
        date => new Date(date).toDateString() === today
      );
      
      const message = wasCompleted 
        ? 'Hábito desmarcado!' 
        : 'Parabéns! Hábito concluído! 🎉';
      showSnackbar(message);
    } catch (error) {
      console.error('Erro ao alternar hábito:', error);
      showSnackbar('Erro ao atualizar hábito');
    }
  };

  const renderHabitItem = ({ item }) => (
    <HabitItem
      habit={item}
      onToggle={handleToggleHabit}
      onEdit={handleEditHabit}
      onDelete={handleDeleteHabit}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Ainda não tem hábitos definidos.{'\n'}
        Toque no botão + para criar o seu primeiro hábito.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Hábitos</Title>
        {habits.length > 0 && (
          <Text style={styles.subtitle}>
            {habits.filter(h => {
              const today = new Date().toDateString();
              return h.completedDates?.some(
                date => new Date(date).toDateString() === today
              );
            }).length} de {habits.length} concluídos hoje
          </Text>
        )}
      </View>
      
      <View style={styles.content}>
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={habits.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadHabits}
        />
      </View>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddHabit}
        label="Novo Hábito"
      />

      <HabitForm
        visible={showForm}
        onDismiss={() => setShowForm(false)}
        onSave={handleSaveHabit}
        habit={editingHabit}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 20,
    paddingBottom: 100, // Espaço para o FAB
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.6,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  snackbar: {
    marginBottom: 80, // Espaço para a barra de navegação
  },
});

export default HabitsScreen;

