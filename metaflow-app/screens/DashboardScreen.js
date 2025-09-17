import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Card, 
  Title, 
  Paragraph, 
  ProgressBar, 
  Chip,
  Button,
  IconButton
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import habitService from '../services/habitService';
import goalService from '../services/goalService';
import taskService from '../services/taskService';
import noteService from '../services/noteService';
import journalService from '../services/journalService';
import { Colors } from '../constants/Colors';

const DashboardScreen = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState({
    habits: {
      total: 0,
      completed: 0,
      todayHabits: [],
    },
    goals: {
      total: 0,
      completed: 0,
      activeGoals: [],
    },
    tasks: {
      total: 0,
      urgent: 0,
      recentTasks: [],
    },
    notes: {
      total: 0,
      recentNotes: [],
    },
    journal: {
      hasToday: false,
      recentEntries: [],
      currentStreak: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  // Carregar dados quando o ecrã ganha foco
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados de todos os serviços
      const [habits, goals, tasks, notes, journalEntries] = await Promise.all([
        habitService.getHabits(),
        goalService.getGoals(),
        taskService.getTasks(),
        noteService.getNotes(),
        journalService.getEntries(),
      ]);

      // Processar dados dos hábitos
      const today = new Date().toDateString();
      const todayHabits = habits.map(habit => {
        const todayCompletion = habit.completions?.find(c => 
          new Date(c.date).toDateString() === today
        );
        return {
          ...habit,
          completedToday: !!todayCompletion,
        };
      });

      const completedHabitsToday = todayHabits.filter(h => h.completedToday).length;

      // Processar dados das metas
      const activeGoals = goals.filter(goal => goal.status !== 'completed');
      const completedGoals = goals.filter(goal => goal.status === 'completed').length;

      // Processar dados das tarefas
      const allTasks = tasks.reduce((acc, column) => [...acc, ...column.tasks], []);
      const urgentTasks = allTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return dueDate <= tomorrow;
      });

      const recentTasks = allTasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      // Processar dados das notas
      const recentNotes = notes
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3);

      // Processar dados do diário
      const hasToday = await journalService.hasTodayEntry();
      const journalStats = await journalService.getJournalStats();
      const recentJournalEntries = journalEntries.slice(0, 2);

      setDashboardData({
        habits: {
          total: habits.length,
          completed: completedHabitsToday,
          todayHabits: todayHabits.slice(0, 4),
        },
        goals: {
          total: goals.length,
          completed: completedGoals,
          activeGoals: activeGoals.slice(0, 3),
        },
        tasks: {
          total: allTasks.length,
          urgent: urgentTasks.length,
          recentTasks,
        },
        notes: {
          total: notes.length,
          recentNotes,
        },
        journal: {
          hasToday,
          recentEntries: recentJournalEntries,
          currentStreak: journalStats.currentStreak,
        },
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      very_happy: '😄',
      happy: '😊',
      neutral: '😐',
      sad: '😔',
      very_sad: '😢',
      excited: '🤩',
      calm: '😌',
      anxious: '😰',
      angry: '😠',
      grateful: '🙏',
    };
    return moodMap[mood] || '😐';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4CAF50',
      normal: '#2196F3',
      medium: '#FF9800',
      high: '#F44336',
    };
    return colors[priority] || colors.normal;
  };

  const renderHabitsCard = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitle}>Hábitos de Hoje</Title>
          <IconButton
            icon="arrow-right"
            size={20}
            onPress={() => navigation.navigate('Hábitos')}
          />
        </View>
        
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {dashboardData.habits.completed} de {dashboardData.habits.total} concluídos
          </Text>
          {dashboardData.habits.total > 0 && (
            <Text style={styles.percentageText}>
              {Math.round((dashboardData.habits.completed / dashboardData.habits.total) * 100)}%
            </Text>
          )}
        </View>
        
        {dashboardData.habits.total > 0 && (
          <ProgressBar
            progress={dashboardData.habits.completed / dashboardData.habits.total}
            color={Colors.light.primary}
            style={styles.progressBar}
          />
        )}

        {dashboardData.habits.todayHabits.length > 0 ? (
          <View style={styles.habitsList}>
            {dashboardData.habits.todayHabits.map((habit) => (
              <View key={habit.id} style={styles.habitItem}>
                <Text style={[
                  styles.habitName,
                  habit.completedToday && styles.completedHabit
                ]}>
                  {habit.completedToday ? '✅' : '⭕'} {habit.name}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Paragraph style={styles.emptyText}>
            Nenhum hábito definido. Toque para criar o seu primeiro hábito.
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  const renderGoalsCard = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitle}>Progresso das Metas</Title>
          <IconButton
            icon="arrow-right"
            size={20}
            onPress={() => navigation.navigate('Metas')}
          />
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {dashboardData.goals.completed} concluídas de {dashboardData.goals.total}
          </Text>
        </View>

        {dashboardData.goals.activeGoals.length > 0 ? (
          <View style={styles.goalsList}>
            {dashboardData.goals.activeGoals.map((goal) => {
              const progress = goal.targetValue > 0 ? goal.currentValue / goal.targetValue : 0;
              return (
                <View key={goal.id} style={styles.goalItem}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <View style={styles.goalProgress}>
                    <ProgressBar
                      progress={Math.min(progress, 1)}
                      color={Colors.light.primary}
                      style={styles.goalProgressBar}
                    />
                    <Text style={styles.goalPercentage}>
                      {Math.round(progress * 100)}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Paragraph style={styles.emptyText}>
            Nenhuma meta ativa. Toque para definir as suas metas.
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  const renderTasksCard = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitle}>Tarefas</Title>
          <IconButton
            icon="arrow-right"
            size={20}
            onPress={() => navigation.navigate('Tarefas')}
          />
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {dashboardData.tasks.total} tarefas
          </Text>
          {dashboardData.tasks.urgent > 0 && (
            <Chip
              style={[styles.urgentChip, { backgroundColor: '#FFEBEE' }]}
              textStyle={{ color: '#D32F2F', fontSize: 12 }}
              compact
            >
              {dashboardData.tasks.urgent} urgentes
            </Chip>
          )}
        </View>

        {dashboardData.tasks.recentTasks.length > 0 ? (
          <View style={styles.tasksList}>
            {dashboardData.tasks.recentTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <Chip
                    style={[
                      styles.priorityChip,
                      { backgroundColor: getPriorityColor(task.priority) + '20' }
                    ]}
                    textStyle={[
                      styles.priorityText,
                      { color: getPriorityColor(task.priority) }
                    ]}
                    compact
                  >
                    {task.priority}
                  </Chip>
                </View>
                {task.dueDate && (
                  <Text style={styles.taskDueDate}>
                    Prazo: {new Date(task.dueDate).toLocaleDateString('pt-PT')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Paragraph style={styles.emptyText}>
            Nenhuma tarefa criada. Toque para organizar as suas tarefas.
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  const renderNotesCard = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitle}>Notas Recentes</Title>
          <IconButton
            icon="arrow-right"
            size={20}
            onPress={() => navigation.navigate('Notas')}
          />
        </View>

        <Text style={styles.statsText}>
          {dashboardData.notes.total} notas guardadas
        </Text>

        {dashboardData.notes.recentNotes.length > 0 ? (
          <View style={styles.notesList}>
            {dashboardData.notes.recentNotes.map((note) => (
              <View key={note.id} style={styles.noteItem}>
                <Text style={styles.noteTitle} numberOfLines={1}>
                  {note.title}
                </Text>
                <Text style={styles.noteContent} numberOfLines={2}>
                  {note.content}
                </Text>
                {note.tags && note.tags.length > 0 && (
                  <View style={styles.noteTagsContainer}>
                    {note.tags.slice(0, 2).map((tag, index) => (
                      <Chip
                        key={index}
                        style={styles.noteTag}
                        textStyle={styles.noteTagText}
                        compact
                      >
                        {tag}
                      </Chip>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Paragraph style={styles.emptyText}>
            Nenhuma nota criada. Toque para capturar as suas ideias.
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  const renderJournalCard = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitle}>Diário</Title>
          <IconButton
            icon="arrow-right"
            size={20}
            onPress={() => navigation.navigate('Diário')}
          />
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {dashboardData.journal.hasToday ? 'Hoje escrito' : 'Ainda não escreveu hoje'}
          </Text>
          {dashboardData.journal.currentStreak > 0 && (
            <Chip
              style={[styles.streakChip, { backgroundColor: '#E8F5E8' }]}
              textStyle={{ color: '#2E7D32', fontSize: 12 }}
              compact
            >
              🔥 {dashboardData.journal.currentStreak} dias
            </Chip>
          )}
        </View>

        {dashboardData.journal.recentEntries.length > 0 ? (
          <View style={styles.journalList}>
            {dashboardData.journal.recentEntries.map((entry) => (
              <View key={entry.id} style={styles.journalItem}>
                <View style={styles.journalHeader}>
                  <Text style={styles.journalDate}>
                    {new Date(entry.date).toLocaleDateString('pt-PT')}
                  </Text>
                  <Text style={styles.journalMood}>
                    {getMoodEmoji(entry.mood)}
                  </Text>
                </View>
                {entry.title && (
                  <Text style={styles.journalTitle} numberOfLines={1}>
                    {entry.title}
                  </Text>
                )}
                <Text style={styles.journalContent} numberOfLines={2}>
                  {entry.content}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Paragraph style={styles.emptyText}>
              Ainda não tem entradas no diário.
            </Paragraph>
            {!dashboardData.journal.hasToday && (
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Diário')}
                style={styles.journalButton}
                compact
              >
                Escrever sobre hoje
              </Button>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={styles.title}>{getGreeting()}!</Title>
          <Paragraph style={styles.subtitle}>
            {formatDate()}
          </Paragraph>
        </View>

        <View style={styles.content}>
          {renderHabitsCard()}
          {renderGoalsCard()}
          {renderTasksCard()}
          {renderNotesCard()}
          {renderJournalCard()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Hábitos
  habitsList: {
    marginTop: 8,
  },
  habitItem: {
    marginBottom: 6,
  },
  habitName: {
    fontSize: 14,
    color: Colors.light.text,
  },
  completedHabit: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  
  // Metas
  goalsList: {
    marginTop: 8,
  },
  goalItem: {
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  goalPercentage: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    minWidth: 35,
  },
  
  // Tarefas
  tasksList: {
    marginTop: 8,
  },
  taskItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  taskDueDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  urgentChip: {
    height: 24,
  },
  priorityChip: {
    height: 20,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Notas
  notesList: {
    marginTop: 8,
  },
  noteItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  noteTagsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  noteTag: {
    backgroundColor: '#e0e0e0',
    height: 20,
  },
  noteTagText: {
    fontSize: 10,
  },
  
  // Diário
  journalList: {
    marginTop: 8,
  },
  journalItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  journalDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  journalMood: {
    fontSize: 16,
  },
  journalTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  journalContent: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  journalButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
  streakChip: {
    height: 24,
  },
});

export default DashboardScreen;

