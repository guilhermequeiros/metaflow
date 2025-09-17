import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Title, FAB, Snackbar, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import GoalItem from '../components/goals/GoalItem';
import GoalForm from '../components/goals/GoalForm';
import goalService from '../services/goalService';

const GoalsScreen = () => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Carregar metas quando o ecrã ganha foco
  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  // Filtrar metas quando o tipo de filtro ou lista de metas muda
  useEffect(() => {
    filterGoals();
  }, [goals, filterType]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const loadedGoals = await goalService.getGoals();
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      showSnackbar('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  };

  const filterGoals = () => {
    let filtered = [...goals];
    
    switch (filterType) {
      case 'annual':
        filtered = goals.filter(goal => goal.type === 'annual');
        break;
      case 'quarterly':
        filtered = goals.filter(goal => goal.type === 'quarterly');
        break;
      case 'monthly':
        filtered = goals.filter(goal => goal.type === 'monthly');
        break;
      case 'completed':
        filtered = goals.filter(goal => goal.completed);
        break;
      case 'active':
        filtered = goals.filter(goal => !goal.completed);
        break;
      default:
        filtered = goals;
    }
    
    // Ordenar: metas ativas primeiro, depois por data de criação
    filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    setFilteredGoals(filtered);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleSaveGoal = async (goalData) => {
    try {
      await goalService.saveGoal(goalData);
      await loadGoals();
      
      const message = editingGoal 
        ? 'Meta atualizada com sucesso!' 
        : 'Meta criada com sucesso!';
      showSnackbar(message);
    } catch (error) {
      console.error('Erro ao guardar meta:', error);
      showSnackbar('Erro ao guardar meta');
    }
  };

  const handleDeleteGoal = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    
    Alert.alert(
      'Eliminar Meta',
      `Tem a certeza que deseja eliminar a meta "${goal?.title}"?`,
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
              await goalService.deleteGoal(goalId);
              await loadGoals();
              showSnackbar('Meta eliminada com sucesso!');
            } catch (error) {
              console.error('Erro ao eliminar meta:', error);
              showSnackbar('Erro ao eliminar meta');
            }
          },
        },
      ]
    );
  };

  const handleToggleComplete = async (goalId) => {
    try {
      await goalService.toggleGoalCompletion(goalId);
      await loadGoals();
      
      const goal = goals.find(g => g.id === goalId);
      const message = goal?.completed 
        ? 'Meta desmarcada como concluída!' 
        : 'Parabéns! Meta concluída! 🎉';
      showSnackbar(message);
    } catch (error) {
      console.error('Erro ao alternar conclusão da meta:', error);
      showSnackbar('Erro ao atualizar meta');
    }
  };

  const renderGoalItem = ({ item }) => (
    <GoalItem
      goal={item}
      onEdit={handleEditGoal}
      onDelete={handleDeleteGoal}
      onToggleComplete={handleToggleComplete}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {filterType === 'all' 
          ? 'Ainda não tem metas definidas.\nToque no botão + para criar a sua primeira meta.'
          : 'Nenhuma meta encontrada para este filtro.'
        }
      </Text>
    </View>
  );

  const getFilterButtons = () => [
    { value: 'all', label: 'Todas' },
    { value: 'active', label: 'Ativas' },
    { value: 'completed', label: 'Concluídas' },
    { value: 'annual', label: 'Anuais' },
    { value: 'quarterly', label: 'Trimestrais' },
    { value: 'monthly', label: 'Mensais' },
  ];

  const getStatsText = () => {
    const completed = goals.filter(g => g.completed).length;
    const total = goals.length;
    
    if (total === 0) return '';
    
    return `${completed} de ${total} concluídas`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Metas</Title>
        {goals.length > 0 && (
          <Text style={styles.subtitle}>{getStatsText()}</Text>
        )}
      </View>

      {goals.length > 0 && (
        <View style={styles.filterContainer}>
          <SegmentedButtons
            value={filterType}
            onValueChange={setFilterType}
            buttons={getFilterButtons()}
            style={styles.segmentedButtons}
          />
        </View>
      )}
      
      <View style={styles.content}>
        <FlatList
          data={filteredGoals}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={filteredGoals.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadGoals}
        />
      </View>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddGoal}
        label="Nova Meta"
      />

      <GoalForm
        visible={showForm}
        onDismiss={() => setShowForm(false)}
        onSave={handleSaveGoal}
        goal={editingGoal}
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  segmentedButtons: {
    backgroundColor: 'white',
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

export default GoalsScreen;

