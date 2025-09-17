import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip, IconButton } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const TaskCard = ({ task, onEdit, onDelete, onPress }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return Colors.light.error;
      case 'medium':
        return Colors.light.accent;
      case 'low':
        return Colors.light.secondary;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  };

  const isDueSoon = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  return (
    <TouchableOpacity onPress={() => onPress && onPress(task)} activeOpacity={0.7}>
      <Card style={[styles.card, isOverdue() && styles.overdueCard]}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.title} numberOfLines={2}>
              {task.title}
            </Title>
            <View style={styles.actions}>
              <IconButton
                icon="pencil"
                size={16}
                onPress={() => onEdit(task)}
                iconColor={Colors.light.textSecondary}
                style={styles.actionButton}
              />
              <IconButton
                icon="delete"
                size={16}
                onPress={() => onDelete(task.id)}
                iconColor={Colors.light.error}
                style={styles.actionButton}
              />
            </View>
          </View>
          
          {task.description && (
            <Paragraph style={styles.description} numberOfLines={3}>
              {task.description}
            </Paragraph>
          )}
          
          <View style={styles.footer}>
            <View style={styles.chips}>
              {task.priority && task.priority !== 'normal' && (
                <Chip 
                  style={[styles.priorityChip, { backgroundColor: getPriorityColor(task.priority) + '20' }]}
                  textStyle={[styles.chipText, { color: getPriorityColor(task.priority) }]}
                  compact
                >
                  {getPriorityText(task.priority)}
                </Chip>
              )}
              
              {task.dueDate && (
                <Chip 
                  style={[
                    styles.dateChip,
                    isOverdue() && styles.overdueChip,
                    isDueSoon() && styles.dueSoonChip
                  ]}
                  textStyle={[
                    styles.chipText,
                    isOverdue() && styles.overdueText,
                    isDueSoon() && styles.dueSoonText
                  ]}
                  compact
                  icon={isOverdue() ? 'alert' : isDueSoon() ? 'clock-alert' : 'calendar'}
                >
                  {formatDate(task.dueDate)}
                </Chip>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    marginHorizontal: 4,
    elevation: 1,
    borderRadius: 8,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.error,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    margin: 0,
    padding: 0,
    width: 24,
    height: 24,
  },
  description: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  footer: {
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  priorityChip: {
    height: 24,
  },
  dateChip: {
    height: 24,
    backgroundColor: Colors.light.primary + '20',
  },
  overdueChip: {
    backgroundColor: Colors.light.error + '20',
  },
  dueSoonChip: {
    backgroundColor: Colors.light.accent + '20',
  },
  chipText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  overdueText: {
    color: Colors.light.error,
  },
  dueSoonText: {
    color: Colors.light.accent,
  },
});

export default TaskCard;

