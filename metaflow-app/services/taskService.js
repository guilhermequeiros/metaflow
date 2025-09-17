import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@metaflow_tasks';
const COLUMNS_STORAGE_KEY = '@metaflow_columns';

class TaskService {
  // === GESTÃO DE COLUNAS ===
  
  // Obter todas as colunas
  async getColumns() {
    try {
      const columnsJson = await AsyncStorage.getItem(COLUMNS_STORAGE_KEY);
      const columns = columnsJson ? JSON.parse(columnsJson) : [];
      
      // Se não há colunas, criar as padrão
      if (columns.length === 0) {
        const defaultColumns = await this.createDefaultColumns();
        return defaultColumns;
      }
      
      // Ordenar por ordem
      return columns.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Erro ao carregar colunas:', error);
      return [];
    }
  }

  // Criar colunas padrão
  async createDefaultColumns() {
    const defaultColumns = [
      {
        id: 'todo',
        name: 'A Fazer',
        status: 'todo',
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'in_progress',
        name: 'Em Progresso',
        status: 'in_progress',
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'done',
        name: 'Concluído',
        status: 'done',
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await AsyncStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(defaultColumns));
    return defaultColumns;
  }

  // Guardar coluna (criar ou atualizar)
  async saveColumn(column) {
    try {
      const columns = await this.getColumns();
      const existingIndex = columns.findIndex(c => c.id === column.id);
      
      if (existingIndex >= 0) {
        // Atualizar coluna existente
        columns[existingIndex] = { ...columns[existingIndex], ...column };
      } else {
        // Adicionar nova coluna com ordem no final
        column.order = columns.length;
        columns.push(column);
      }
      
      await AsyncStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columns));
      return column;
    } catch (error) {
      console.error('Erro ao guardar coluna:', error);
      throw error;
    }
  }

  // Eliminar coluna
  async deleteColumn(columnId) {
    try {
      // Verificar se há tarefas na coluna
      const tasks = await this.getTasks();
      const tasksInColumn = tasks.filter(t => t.columnId === columnId);
      
      if (tasksInColumn.length > 0) {
        throw new Error('Não é possível eliminar uma coluna que contém tarefas');
      }

      const columns = await this.getColumns();
      const filteredColumns = columns.filter(c => c.id !== columnId);
      
      // Reordenar as colunas restantes
      const reorderedColumns = filteredColumns.map((column, index) => ({
        ...column,
        order: index,
      }));
      
      await AsyncStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(reorderedColumns));
      return true;
    } catch (error) {
      console.error('Erro ao eliminar coluna:', error);
      throw error;
    }
  }

  // === GESTÃO DE TAREFAS ===

  // Obter todas as tarefas
  async getTasks() {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  }

  // Obter tarefas por coluna
  async getTasksByColumn(columnId) {
    try {
      const tasks = await this.getTasks();
      return tasks.filter(task => task.columnId === columnId);
    } catch (error) {
      console.error('Erro ao carregar tarefas por coluna:', error);
      return [];
    }
  }

  // Guardar tarefa (criar ou atualizar)
  async saveTask(task) {
    try {
      const tasks = await this.getTasks();
      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex >= 0) {
        // Atualizar tarefa existente
        tasks[existingIndex] = { ...tasks[existingIndex], ...task };
      } else {
        // Adicionar nova tarefa
        tasks.push(task);
      }
      
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      return task;
    } catch (error) {
      console.error('Erro ao guardar tarefa:', error);
      throw error;
    }
  }

  // Eliminar tarefa
  async deleteTask(taskId) {
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filteredTasks));
      return true;
    } catch (error) {
      console.error('Erro ao eliminar tarefa:', error);
      throw error;
    }
  }

  // Mover tarefa para outra coluna
  async moveTask(taskId, newColumnId) {
    try {
      const tasks = await this.getTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Tarefa não encontrada');
      }

      tasks[taskIndex].columnId = newColumnId;
      tasks[taskIndex].updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      return tasks[taskIndex];
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      throw error;
    }
  }

  // === ESTATÍSTICAS ===

  // Obter estatísticas das tarefas
  async getTaskStats() {
    try {
      const tasks = await this.getTasks();
      const columns = await this.getColumns();
      
      const totalTasks = tasks.length;
      const tasksByColumn = {};
      
      // Contar tarefas por coluna
      columns.forEach(column => {
        tasksByColumn[column.id] = tasks.filter(t => t.columnId === column.id).length;
      });

      // Tarefas por prioridade
      const tasksByPriority = {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length,
        normal: tasks.filter(t => t.priority === 'normal' || !t.priority).length,
      };

      // Tarefas atrasadas
      const today = new Date();
      const overdueTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < today && task.columnId !== 'done';
      }).length;

      // Tarefas com prazo próximo (próximos 3 dias)
      const upcomingTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3 && task.columnId !== 'done';
      }).length;

      return {
        totalTasks,
        tasksByColumn,
        tasksByPriority,
        overdueTasks,
        upcomingTasks,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas das tarefas:', error);
      return {
        totalTasks: 0,
        tasksByColumn: {},
        tasksByPriority: { high: 0, medium: 0, low: 0, normal: 0 },
        overdueTasks: 0,
        upcomingTasks: 0,
      };
    }
  }

  // Obter tarefas importantes (alta prioridade ou prazo próximo)
  async getImportantTasks() {
    try {
      const tasks = await this.getTasks();
      const today = new Date();
      
      return tasks.filter(task => {
        // Tarefas já concluídas não são importantes
        if (task.columnId === 'done') return false;
        
        // Alta prioridade
        if (task.priority === 'high') return true;
        
        // Prazo próximo (próximos 2 dias)
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          const diffTime = dueDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays <= 2;
        }
        
        return false;
      }).sort((a, b) => {
        // Ordenar por prioridade e depois por data
        if (a.priority !== b.priority) {
          const priorityOrder = { high: 3, medium: 2, low: 1, normal: 0 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } catch (error) {
      console.error('Erro ao carregar tarefas importantes:', error);
      return [];
    }
  }

  // Obter dados completos do Kanban
  async getKanbanData() {
    try {
      const [columns, tasks] = await Promise.all([
        this.getColumns(),
        this.getTasks()
      ]);

      const kanbanData = columns.map(column => ({
        ...column,
        tasks: tasks.filter(task => task.columnId === column.id)
      }));

      return kanbanData;
    } catch (error) {
      console.error('Erro ao carregar dados do Kanban:', error);
      return [];
    }
  }
}

export default new TaskService();

