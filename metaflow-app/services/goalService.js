import AsyncStorage from '@react-native-async-storage/async-storage';

const GOALS_STORAGE_KEY = '@metaflow_goals';

class GoalService {
  // Obter todas as metas
  async getGoals() {
    try {
      const goalsJson = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
      return goalsJson ? JSON.parse(goalsJson) : [];
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      return [];
    }
  }

  // Guardar meta (criar ou atualizar)
  async saveGoal(goal) {
    try {
      const goals = await this.getGoals();
      const existingIndex = goals.findIndex(g => g.id === goal.id);
      
      if (existingIndex >= 0) {
        // Atualizar meta existente
        goals[existingIndex] = { ...goals[existingIndex], ...goal };
      } else {
        // Adicionar nova meta
        goals.push(goal);
      }
      
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
      return goal;
    } catch (error) {
      console.error('Erro ao guardar meta:', error);
      throw error;
    }
  }

  // Eliminar meta
  async deleteGoal(goalId) {
    try {
      const goals = await this.getGoals();
      const filteredGoals = goals.filter(g => g.id !== goalId);
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(filteredGoals));
      return true;
    } catch (error) {
      console.error('Erro ao eliminar meta:', error);
      throw error;
    }
  }

  // Atualizar progresso da meta
  async updateGoalProgress(goalId, newCurrentValue) {
    try {
      const goals = await this.getGoals();
      const goalIndex = goals.findIndex(g => g.id === goalId);
      
      if (goalIndex === -1) {
        throw new Error('Meta não encontrada');
      }

      const goal = goals[goalIndex];
      goal.currentValue = newCurrentValue;
      goal.updatedAt = new Date().toISOString();

      // Verificar se a meta foi concluída
      if (newCurrentValue >= goal.targetValue && !goal.completed) {
        goal.completed = true;
        goal.completedAt = new Date().toISOString();
      } else if (newCurrentValue < goal.targetValue && goal.completed) {
        goal.completed = false;
        goal.completedAt = null;
      }

      goals[goalIndex] = goal;
      
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
      return goal;
    } catch (error) {
      console.error('Erro ao atualizar progresso da meta:', error);
      throw error;
    }
  }

  // Marcar meta como concluída
  async toggleGoalCompletion(goalId) {
    try {
      const goals = await this.getGoals();
      const goalIndex = goals.findIndex(g => g.id === goalId);
      
      if (goalIndex === -1) {
        throw new Error('Meta não encontrada');
      }

      const goal = goals[goalIndex];
      
      if (goal.completed) {
        // Desmarcar como concluída
        goal.completed = false;
        goal.completedAt = null;
      } else {
        // Marcar como concluída
        goal.completed = true;
        goal.completedAt = new Date().toISOString();
        // Atualizar valor atual para o valor alvo se ainda não atingiu
        if (goal.currentValue < goal.targetValue) {
          goal.currentValue = goal.targetValue;
        }
      }

      goal.updatedAt = new Date().toISOString();
      goals[goalIndex] = goal;
      
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
      return goal;
    } catch (error) {
      console.error('Erro ao alternar conclusão da meta:', error);
      throw error;
    }
  }

  // Obter estatísticas das metas
  async getGoalsStats() {
    try {
      const goals = await this.getGoals();
      
      const totalGoals = goals.length;
      const completedGoals = goals.filter(g => g.completed).length;
      const inProgressGoals = goals.filter(g => !g.completed && g.currentValue > 0).length;
      const notStartedGoals = goals.filter(g => !g.completed && g.currentValue === 0).length;
      
      // Metas por tipo
      const annualGoals = goals.filter(g => g.type === 'annual').length;
      const quarterlyGoals = goals.filter(g => g.type === 'quarterly').length;
      const monthlyGoals = goals.filter(g => g.type === 'monthly').length;
      
      // Metas atrasadas
      const today = new Date();
      const overdueGoals = goals.filter(g => {
        if (g.completed || !g.deadline) return false;
        const deadline = new Date(g.deadline);
        return deadline < today;
      }).length;

      // Taxa de conclusão média
      const totalProgress = goals.reduce((sum, goal) => {
        const progress = goal.targetValue > 0 ? goal.currentValue / goal.targetValue : 0;
        return sum + Math.min(progress, 1);
      }, 0);
      const averageProgress = totalGoals > 0 ? totalProgress / totalGoals : 0;

      return {
        totalGoals,
        completedGoals,
        inProgressGoals,
        notStartedGoals,
        overdueGoals,
        annualGoals,
        quarterlyGoals,
        monthlyGoals,
        averageProgress,
        completionRate: totalGoals > 0 ? completedGoals / totalGoals : 0,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas das metas:', error);
      return {
        totalGoals: 0,
        completedGoals: 0,
        inProgressGoals: 0,
        notStartedGoals: 0,
        overdueGoals: 0,
        annualGoals: 0,
        quarterlyGoals: 0,
        monthlyGoals: 0,
        averageProgress: 0,
        completionRate: 0,
      };
    }
  }

  // Obter metas por tipo
  async getGoalsByType(type) {
    try {
      const goals = await this.getGoals();
      return goals.filter(goal => goal.type === type);
    } catch (error) {
      console.error('Erro ao carregar metas por tipo:', error);
      return [];
    }
  }

  // Obter metas próximas do prazo
  async getUpcomingDeadlines(days = 7) {
    try {
      const goals = await this.getGoals();
      const today = new Date();
      const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      
      return goals.filter(goal => {
        if (goal.completed || !goal.deadline) return false;
        const deadline = new Date(goal.deadline);
        return deadline >= today && deadline <= futureDate;
      }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } catch (error) {
      console.error('Erro ao carregar metas próximas do prazo:', error);
      return [];
    }
  }

  // Obter progresso geral das metas
  async getOverallProgress() {
    try {
      const goals = await this.getGoals();
      
      if (goals.length === 0) {
        return { progress: 0, completed: 0, total: 0 };
      }

      const completedGoals = goals.filter(g => g.completed).length;
      const progress = completedGoals / goals.length;

      return {
        progress,
        completed: completedGoals,
        total: goals.length,
      };
    } catch (error) {
      console.error('Erro ao calcular progresso geral:', error);
      return { progress: 0, completed: 0, total: 0 };
    }
  }
}

export default new GoalService();

