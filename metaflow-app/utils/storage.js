import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves de armazenamento
export const STORAGE_KEYS = {
  HABITS: '@metaflow_habits',
  GOALS: '@metaflow_goals',
  TASKS: '@metaflow_tasks',
  NOTES: '@metaflow_notes',
  JOURNAL: '@metaflow_journal',
  THEME: '@metaflow_theme',
  USER_PREFERENCES: '@metaflow_preferences',
  APP_DATA: '@metaflow_app_data',
};

// Classe para gestão centralizada de armazenamento
class StorageManager {
  // Operações básicas de armazenamento
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Erro ao guardar ${key}:`, error);
      return false;
    }
  }

  async getItem(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
      return defaultValue;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      return false;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar armazenamento:', error);
      return false;
    }
  }

  // Operações específicas para cada módulo
  async saveHabits(habits) {
    return await this.setItem(STORAGE_KEYS.HABITS, habits);
  }

  async getHabits() {
    return await this.getItem(STORAGE_KEYS.HABITS, []);
  }

  async saveGoals(goals) {
    return await this.setItem(STORAGE_KEYS.GOALS, goals);
  }

  async getGoals() {
    return await this.getItem(STORAGE_KEYS.GOALS, []);
  }

  async saveTasks(tasks) {
    return await this.setItem(STORAGE_KEYS.TASKS, tasks);
  }

  async getTasks() {
    return await this.getItem(STORAGE_KEYS.TASKS, []);
  }

  async saveNotes(notes) {
    return await this.setItem(STORAGE_KEYS.NOTES, notes);
  }

  async getNotes() {
    return await this.getItem(STORAGE_KEYS.NOTES, []);
  }

  async saveJournal(entries) {
    return await this.setItem(STORAGE_KEYS.JOURNAL, entries);
  }

  async getJournal() {
    return await this.getItem(STORAGE_KEYS.JOURNAL, []);
  }

  async saveTheme(theme) {
    return await this.setItem(STORAGE_KEYS.THEME, theme);
  }

  async getTheme() {
    return await this.getItem(STORAGE_KEYS.THEME, 'system');
  }

  async saveUserPreferences(preferences) {
    return await this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  async getUserPreferences() {
    return await this.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      notifications: {
        habits: false,
        journal: false,
        goals: false,
      },
      backup: {
        auto: false,
        frequency: 'weekly',
      },
      privacy: {
        analytics: false,
        crashReports: true,
      },
    });
  }

  // Operações de backup e exportação
  async exportAllData() {
    try {
      const data = {
        habits: await this.getHabits(),
        goals: await this.getGoals(),
        tasks: await this.getTasks(),
        notes: await this.getNotes(),
        journal: await this.getJournal(),
        preferences: await this.getUserPreferences(),
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      return {
        success: true,
        data,
        filename: `metaflow_backup_${new Date().toISOString().split('T')[0]}.json`,
      };
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async importAllData(importData) {
    try {
      // Validar estrutura dos dados
      if (!importData || typeof importData !== 'object') {
        throw new Error('Dados de importação inválidos');
      }

      // Fazer backup dos dados atuais antes da importação
      const currentData = await this.exportAllData();
      await this.setItem('@metaflow_backup_before_import', currentData.data);

      // Importar dados
      if (importData.habits) await this.saveHabits(importData.habits);
      if (importData.goals) await this.saveGoals(importData.goals);
      if (importData.tasks) await this.saveTasks(importData.tasks);
      if (importData.notes) await this.saveNotes(importData.notes);
      if (importData.journal) await this.saveJournal(importData.journal);
      if (importData.preferences) await this.saveUserPreferences(importData.preferences);

      return {
        success: true,
        message: 'Dados importados com sucesso',
      };
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Operações de limpeza e manutenção
  async getStorageInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const metaflowKeys = keys.filter(key => key.startsWith('@metaflow_'));
      
      let totalSize = 0;
      const itemSizes = {};

      for (const key of metaflowKeys) {
        const value = await AsyncStorage.getItem(key);
        const size = value ? value.length : 0;
        totalSize += size;
        itemSizes[key] = size;
      }

      return {
        totalKeys: metaflowKeys.length,
        totalSize,
        itemSizes,
        keys: metaflowKeys,
      };
    } catch (error) {
      console.error('Erro ao obter informações de armazenamento:', error);
      return null;
    }
  }

  async cleanupOldData(daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      // Limpar entradas antigas do diário
      const journal = await this.getJournal();
      const filteredJournal = journal.filter(entry => 
        new Date(entry.date) > cutoffDate
      );
      
      if (filteredJournal.length !== journal.length) {
        await this.saveJournal(filteredJournal);
      }

      // Limpar dados de conclusão antigos dos hábitos
      const habits = await this.getHabits();
      const updatedHabits = habits.map(habit => ({
        ...habit,
        completions: habit.completions?.filter(completion =>
          new Date(completion.date) > cutoffDate
        ) || [],
      }));

      await this.saveHabits(updatedHabits);

      return {
        success: true,
        message: `Dados anteriores a ${daysToKeep} dias foram limpos`,
      };
    } catch (error) {
      console.error('Erro ao limpar dados antigos:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Operações de migração de dados
  async migrateData(fromVersion, toVersion) {
    try {
      console.log(`Migrando dados da versão ${fromVersion} para ${toVersion}`);
      
      // Implementar lógica de migração conforme necessário
      // Por enquanto, apenas registar a migração
      
      const migrationInfo = {
        fromVersion,
        toVersion,
        date: new Date().toISOString(),
        success: true,
      };

      await this.setItem('@metaflow_migration_info', migrationInfo);

      return {
        success: true,
        message: 'Migração concluída com sucesso',
      };
    } catch (error) {
      console.error('Erro na migração de dados:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Instância singleton do gestor de armazenamento
const storageManager = new StorageManager();

export default storageManager;

// Funções de conveniência para uso direto
export const saveData = (key, data) => storageManager.setItem(key, data);
export const loadData = (key, defaultValue) => storageManager.getItem(key, defaultValue);
export const removeData = (key) => storageManager.removeItem(key);
export const clearAllData = () => storageManager.clear();
export const exportData = () => storageManager.exportAllData();
export const importData = (data) => storageManager.importAllData(data);
export const getStorageInfo = () => storageManager.getStorageInfo();
export const cleanupData = (days) => storageManager.cleanupOldData(days);

