import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton, ProgressBar, Chip } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const GoalItem = ({ goal, onEdit, onDelete, onToggleComplete }) => {
  const getTypeText = (type) => {
    switch (type) {
      case 'annual':
        return 'Anual';
      case 'quarterly':
        return 'Trimestral';
      case 'monthly':
        return 'Mensal';
      default:
        return 'Anual';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'annual':
        return Colors.light.primary;
      case 'quarterly':
        return Colors.light.secondary;
      case 'monthly':
        return Colors.light.accent;
      default:
        return Colors.light.primary;
    }
  };

  const calculateProgress = () => {
    if (!goal.targetValue || goal.targetValue === 0) return 0;
    return Math.min(goal.currentValue / goal.targetValue, 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!goal.deadline) return false;
    const today = new Date();
    const deadline = new Date(goal.deadline);
    return deadline < today && !goal.completed;
  };

  const getDaysRemaining = () => {
    if (!goal.deadline) return null;
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const progress = calculateProgress();
  const daysRemaining = getDaysRemaining();
  const overdue = isOverdue();

  return (
    <Card style={[styles.card, goal.completed && styles.completedCard]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Title style={[styles.title, goal.completed && styles.completedTitle]}>
              {goal.title}
            </Title>
            <View style={styles.chipContainer}>
              <Chip 
                style={[styles.typeChip, { backgroundColor: getTypeColor(goal.type) + '20' }]}
                textStyle={[styles.chipText, { color: getTypeColor(goal.type) }]}
              >
                {getTypeText(goal.type)}
              </Chip>
              {goal.completed && (
                <Chip 
                  style={styles.completedChip}
                  textStyle={styles.completedChipText}
                  icon="check"
                >
                  Concluída
                </Chip>
              )}
              {overdue && (
                <Chip 
                  style={styles.overdueChip}
                  textStyle={styles.overdueChipText}
                  icon="alert"
                >
                  Atrasada
                </Chip>
              )}
            </View>
          </View>
        </View>
        
        {goal.description && (
          <Paragraph style={styles.description}>{goal.description}</Paragraph>
        )}
        
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Paragraph style={styles.progressText}>
              Progresso: {goal.currentValue || 0} / {goal.targetValue || 0} {goal.unit || ''}
            </Paragraph>
            <Paragraph style={styles.percentageText}>
              {Math.round(progress * 100)}%
            </Paragraph>
          </View>
          <ProgressBar 
            progress={progress} 
            color={goal.completed ? Colors.light.success : getTypeColor(goal.type)}
            style={styles.progressBar}
          />
        </View>

        {goal.deadline && (
          <View style={styles.deadlineContainer}>
            <Paragraph style={[
              styles.deadlineText,
              overdue && styles.overdueText,
              goal.completed && styles.completedText
            ]}>
              {goal.completed 
                ? `Concluída em ${formatDate(goal.completedAt || goal.deadline)}`
                : overdue 
                  ? `Prazo expirou em ${formatDate(goal.deadline)}`
                  : daysRemaining === 0
                    ? 'Prazo hoje'
                    : daysRemaining === 1
                      ? '1 dia restante'
                      : daysRemaining > 0
                        ? `${daysRemaining} dias restantes`
                        : `${Math.abs(daysRemaining)} dias em atraso`
              }
            </Paragraph>
          </View>
        )}
        
        <View style={styles.actionButtons}>
          {!goal.completed && progress >= 1 && (
            <IconButton
              icon="check-circle"
              size={24}
              onPress={() => onToggleComplete(goal.id)}
              iconColor={Colors.light.success}
              style={styles.completeButton}
            />
          )}
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => onEdit(goal)}
            iconColor={Colors.light.textSecondary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(goal.id)}
            iconColor={Colors.light.error}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.success,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.light.textSecondary,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    height: 28,
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedChip: {
    backgroundColor: Colors.light.success + '20',
    height: 28,
  },
  completedChipText: {
    color: Colors.light.success,
    fontSize: 12,
    fontWeight: 'bold',
  },
  overdueChip: {
    backgroundColor: Colors.light.error + '20',
    height: 28,
  },
  overdueChipText: {
    color: Colors.light.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  percentageText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  deadlineContainer: {
    marginBottom: 8,
  },
  deadlineText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  overdueText: {
    color: Colors.light.error,
    fontWeight: 'bold',
  },
  completedText: {
    color: Colors.light.success,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  completeButton: {
    marginRight: 8,
  },
});

export default GoalItem;

