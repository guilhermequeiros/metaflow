import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Title, FAB, Snackbar, Menu, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import KanbanColumn from '../components/tasks/KanbanColumn';
import TaskForm from '../components/tasks/TaskForm';
import ColumnForm from '../components/tasks/ColumnForm';
import taskService from '../services/taskService';

const TasksScreen = () => {
  const [kanbanData, setKanbanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showColumnForm, setShowColumnForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  // Carregar dados quando o ecrã ganha foco
  useFocusEffect(
    useCallback(() => {
      loadKanbanData();
    }, [])
  );

  const loadKanbanData = async () => {
    try {
      setLoading(true);
      const data = await taskService.getKanbanData();
      setKanbanData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do Kanban:', error);
      showSnackbar('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // === GESTÃO DE TAREFAS ===

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
    setMenuVisible(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      await taskService.saveTask(taskData);
      await loadKanbanData();
      
      const message = editingTask 
        ? 'Tarefa atualizada com sucesso!' 
        : 'Tarefa criada com sucesso!';
      showSnackbar(message);
    } catch (error) {
      console.error('Erro ao guardar tarefa:', error);
      showSnackbar('Erro ao guardar tarefa');
    }
  };

  const handleDeleteTask = (taskId) => {
    const task = kanbanData
      .flatMap(column => column.tasks)
      .find(t => t.id === taskId);
    
    Alert.alert(
      'Eliminar Tarefa',
      `Tem a certeza que deseja eliminar a tarefa "${task?.title}"?`,
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
              await taskService.deleteTask(taskId);
              await loadKanbanData();
              showSnackbar('Tarefa eliminada com sucesso!');
            } catch (error) {
              console.error('Erro ao eliminar tarefa:', error);
              showSnackbar('Erro ao eliminar tarefa');
            }
          },
        },
      ]
    );
  };

  const handleTaskPress = (task) => {
    // Implementar navegação para detalhes da tarefa ou ação rápida
    console.log('Tarefa pressionada:', task.title);
  };

  // === GESTÃO DE COLUNAS ===

  const handleAddColumn = () => {
    setEditingColumn(null);
    setShowColumnForm(true);
    setMenuVisible(false);
  };

  const handleEditColumn = (column) => {
    setEditingColumn(column);
    setShowColumnForm(true);
  };

  const handleSaveColumn = async (columnData) => {
    try {
      await taskService.saveColumn(columnData);
      await loadKanbanData();
      
      const message = editingColumn 
        ? 'Coluna atualizada com sucesso!' 
        : 'Coluna criada com sucesso!';
      showSnackbar(message);
    } catch (error) {
      console.error('Erro ao guardar coluna:', error);
      showSnackbar('Erro ao guardar coluna');
    }
  };

  const handleDeleteColumn = (columnId) => {
    const column = kanbanData.find(c => c.id === columnId);
    
    Alert.alert(
      'Eliminar Coluna',
      `Tem a certeza que deseja eliminar a coluna "${column?.name}"?`,
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
              await taskService.deleteColumn(columnId);
              await loadKanbanData();
              showSnackbar('Coluna eliminada com sucesso!');
            } catch (error) {
              console.error('Erro ao eliminar coluna:', error);
              showSnackbar(error.message || 'Erro ao eliminar coluna');
            }
          },
        },
      ]
    );
  };

  // === RENDERIZAÇÃO ===

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Ainda não tem quadros de tarefas.{'\n'}
        Toque no botão + para começar a organizar as suas tarefas.
      </Text>
    </View>
  );

  const getTotalTasks = () => {
    return kanbanData.reduce((total, column) => total + column.tasks.length, 0);
  };

  const getColumns = () => {
    return kanbanData.map(({ tasks, ...column }) => column);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>Tarefas</Title>
          {getTotalTasks() > 0 && (
            <Text style={styles.subtitle}>
              {getTotalTasks()} {getTotalTasks() === 1 ? 'tarefa' : 'tarefas'} em {kanbanData.length} {kanbanData.length === 1 ? 'coluna' : 'colunas'}
            </Text>
          )}
        </View>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
              iconColor="#666"
            />
          }
        >
          <Menu.Item onPress={handleAddTask} title="Nova Tarefa" leadingIcon="plus" />
          <Menu.Item onPress={handleAddColumn} title="Nova Coluna" leadingIcon="view-column" />
        </Menu>
      </View>
      
      <View style={styles.content}>
        {kanbanData.length === 0 ? (
          renderEmptyState()
        ) : (
          <ScrollView 
            horizontal 
            style={styles.kanbanContainer}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.kanbanContent}
          >
            {kanbanData.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={column.tasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onTaskPress={handleTaskPress}
                onEditColumn={handleEditColumn}
                onDeleteColumn={handleDeleteColumn}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddTask}
        label="Nova Tarefa"
      />

      <TaskForm
        visible={showTaskForm}
        onDismiss={() => setShowTaskForm(false)}
        onSave={handleSaveTask}
        task={editingTask}
        columns={getColumns()}
      />

      <ColumnForm
        visible={showColumnForm}
        onDismiss={() => setShowColumnForm(false)}
        onSave={handleSaveColumn}
        column={editingColumn}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  titleContainer: {
    flex: 1,
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
  kanbanContainer: {
    flex: 1,
  },
  kanbanContent: {
    paddingHorizontal: 12,
    paddingBottom: 100, // Espaço para o FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

export default TasksScreen;

