import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, IconButton, Text } from 'react-native-paper';
import TaskCard from './TaskCard';
import { Colors } from '../../constants/Colors';

const KanbanColumn = ({ 
  column, 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  onTaskPress,
  onEditColumn,
  onDeleteColumn 
}) => {
  const getColumnColor = (status) => {
    switch (status) {
      case 'todo':
        return Colors.light.textSecondary;
      case 'in_progress':
        return Colors.light.accent;
      case 'done':
        return Colors.light.success;
      default:
        return Colors.light.primary;
    }
  };

  return (
    <View style={[styles.column, { borderTopColor: getColumnColor(column.status) }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>{column.name}</Title>
          <Text style={styles.taskCount}>
            {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
          </Text>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={16}
            onPress={() => onEditColumn(column)}
            iconColor={Colors.light.textSecondary}
            style={styles.actionButton}
          />
          <IconButton
            icon="delete"
            size={16}
            onPress={() => onDeleteColumn(column.id)}
            iconColor={Colors.light.error}
            style={styles.actionButton}
          />
        </View>
      </View>
      
      <ScrollView 
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onPress={onTaskPress}
          />
        ))}
        
        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Nenhuma tarefa
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    marginHorizontal: 8,
    width: 280,
    maxHeight: 600,
    borderTopWidth: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  taskCount: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
    padding: 0,
    width: 24,
    height: 24,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default KanbanColumn;

