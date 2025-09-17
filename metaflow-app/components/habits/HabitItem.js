import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Checkbox, IconButton, ProgressBar } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const HabitItem = ({ habit, onToggle, onEdit, onDelete }) => {
  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case 'daily':
        return 'Diário';
      case 'weekly':
        return 'Semanal';
      case 'custom':
        return 'Personalizado';
      default:
        return 'Diário';
    }
  };

  const calculateProgress = () => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    // Calcular progresso baseado nos últimos 7 dias
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentCompletions = habit.completedDates.filter(date => {
      const completionDate = new Date(date);
      return completionDate >= sevenDaysAgo && completionDate <= today;
    });
    
    return Math.min(recentCompletions.length / 7, 1);
  };

  const isCompletedToday = () => {
    if (!habit.completedDates) return false;
    const today = new Date().toDateString();
    return habit.completedDates.some(date => new Date(date).toDateString() === today);
  };

  const getStreakCount = () => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    const sortedDates = habit.completedDates
      .map(date => new Date(date))
      .sort((a, b) => b - a);
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const expectedDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      
      if (date.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const progress = calculateProgress();
  const streak = getStreakCount();
  const completedToday = isCompletedToday();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Title style={styles.title}>{habit.name}</Title>
            <Paragraph style={styles.frequency}>
              {getFrequencyText(habit.frequency)}
            </Paragraph>
          </View>
          <View style={styles.actions}>
            <Checkbox
              status={completedToday ? 'checked' : 'unchecked'}
              onPress={() => onToggle(habit.id)}
              color={Colors.light.primary}
            />
          </View>
        </View>
        
        {habit.description && (
          <Paragraph style={styles.description}>{habit.description}</Paragraph>
        )}
        
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Paragraph style={styles.progressText}>
              Progresso (7 dias): {Math.round(progress * 100)}%
            </Paragraph>
            <Paragraph style={styles.streakText}>
              🔥 {streak} {streak === 1 ? 'dia' : 'dias'} seguidos
            </Paragraph>
          </View>
          <ProgressBar 
            progress={progress} 
            color={Colors.light.primary}
            style={styles.progressBar}
          />
        </View>
        
        <View style={styles.actionButtons}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => onEdit(habit)}
            iconColor={Colors.light.textSecondary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(habit.id)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  frequency: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  actions: {
    marginLeft: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  streakText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});

export default HabitItem;

