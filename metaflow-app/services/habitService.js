import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_STORAGE_KEY = '@metaflow_habits';

class HabitService {
  // Obter todos os hábitos
  async getHabits() {
    try {
      const habitsJson = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      return habitsJson ? JSON.parse(habitsJson) : [];
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
      return [];
    }
  }

  // Guardar hábito (criar ou atualizar)
  async saveHabit(habit) {
    try {
      const habits = await this.getHabits();
      const existingIndex = habits.findIndex(h => h.id === habit.id);
      
      if (existingIndex >= 0) {
        // Atualizar hábito existente
        habits[existingIndex] = { ...habits[existingIndex], ...habit };
      } else {
        // Adicionar novo hábito
        habits.push(habit);
      }
      
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      return habit;
    } catch (error) {
      console.error('Erro ao guardar hábito:', error);
      throw error;
    }
  }

  // Eliminar hábito
  async deleteHabit(habitId) {
    try {
      const habits = await this.getHabits();
      const filteredHabits = habits.filter(h => h.id !== habitId);
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(filteredHabits));
      return true;
    } catch (error) {
      console.error('Erro ao eliminar hábito:', error);
      throw error;
    }
  }

  // Marcar/desmarcar hábito como concluído para hoje
  async toggleHabitCompletion(habitId) {
    try {
      const habits = await this.getHabits();
      const habitIndex = habits.findIndex(h => h.id === habitId);
      
      if (habitIndex === -1) {
        throw new Error('Hábito não encontrado');
      }

      const habit = habits[habitIndex];
      const today = new Date().toDateString();
      
      if (!habit.completedDates) {
        habit.completedDates = [];
      }

      const todayIndex = habit.completedDates.findIndex(
        date => new Date(date).toDateString() === today
      );

      if (todayIndex >= 0) {
        // Remover conclusão de hoje
        habit.completedDates.splice(todayIndex, 1);
      } else {
        // Adicionar conclusão de hoje
        habit.completedDates.push(new Date().toISOString());
      }

      habit.updatedAt = new Date().toISOString();
      habits[habitIndex] = habit;
      
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      return habit;
    } catch (error) {
      console.error('Erro ao alternar conclusão do hábito:', error);
      throw error;
    }
  }

  // Obter estatísticas de um hábito
  getHabitStats(habit) {
    if (!habit.completedDates || habit.completedDates.length === 0) {
      return {
        totalCompletions: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
      };
    }

    const sortedDates = habit.completedDates
      .map(date => new Date(date))
      .sort((a, b) => a - b);

    // Calcular streak atual
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) { // Verificar últimos 30 dias
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasCompletion = sortedDates.some(
        date => date.toDateString() === checkDate.toDateString()
      );
      
      if (hasCompletion) {
        currentStreak++;
      } else if (i > 0) { // Não quebrar streak se hoje ainda não foi marcado
        break;
      }
    }

    // Calcular maior streak
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    for (const date of sortedDates) {
      if (lastDate && (date.getTime() - lastDate.getTime()) <= 24 * 60 * 60 * 1000 * 1.5) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      lastDate = date;
    }

    // Calcular taxa de conclusão (últimos 30 dias)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentCompletions = sortedDates.filter(date => date >= thirtyDaysAgo);
    const completionRate = recentCompletions.length / 30;

    return {
      totalCompletions: habit.completedDates.length,
      currentStreak,
      longestStreak,
      completionRate: Math.min(completionRate, 1),
    };
  }

  // Obter hábitos para hoje
  async getTodayHabits() {
    try {
      const habits = await this.getHabits();
      const today = new Date().toDateString();
      
      return habits.map(habit => ({
        ...habit,
        completedToday: habit.completedDates?.some(
          date => new Date(date).toDateString() === today
        ) || false,
      }));
    } catch (error) {
      console.error('Erro ao carregar hábitos de hoje:', error);
      return [];
    }
  }
}

export default new HabitService();

