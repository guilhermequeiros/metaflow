import AsyncStorage from '@react-native-async-storage/async-storage';

const JOURNAL_STORAGE_KEY = '@metaflow_journal';

class JournalService {
  // Obter todas as entradas do diário
  async getEntries() {
    try {
      const entriesJson = await AsyncStorage.getItem(JOURNAL_STORAGE_KEY);
      const entries = entriesJson ? JSON.parse(entriesJson) : [];
      
      // Ordenar por data (mais recente primeiro)
      return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Erro ao carregar entradas do diário:', error);
      return [];
    }
  }

  // Guardar entrada (criar ou atualizar)
  async saveEntry(entry) {
    try {
      const entries = await this.getEntries();
      const existingIndex = entries.findIndex(e => e.id === entry.id);
      
      if (existingIndex >= 0) {
        // Atualizar entrada existente
        entries[existingIndex] = { ...entries[existingIndex], ...entry };
      } else {
        // Adicionar nova entrada
        entries.push(entry);
      }
      
      await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
      return entry;
    } catch (error) {
      console.error('Erro ao guardar entrada do diário:', error);
      throw error;
    }
  }

  // Eliminar entrada
  async deleteEntry(entryId) {
    try {
      const entries = await this.getEntries();
      const filteredEntries = entries.filter(e => e.id !== entryId);
      await AsyncStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(filteredEntries));
      return true;
    } catch (error) {
      console.error('Erro ao eliminar entrada do diário:', error);
      throw error;
    }
  }

  // Obter entrada por data específica
  async getEntryByDate(date) {
    try {
      const entries = await this.getEntries();
      const targetDate = new Date(date).toDateString();
      
      return entries.find(entry => {
        const entryDate = new Date(entry.date).toDateString();
        return entryDate === targetDate;
      });
    } catch (error) {
      console.error('Erro ao buscar entrada por data:', error);
      return null;
    }
  }

  // Obter entradas por período
  async getEntriesByDateRange(startDate, endDate) {
    try {
      const entries = await this.getEntries();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      });
    } catch (error) {
      console.error('Erro ao buscar entradas por período:', error);
      return [];
    }
  }

  // Pesquisar entradas
  async searchEntries(query) {
    try {
      const entries = await this.getEntries();
      
      if (!query || query.trim() === '') {
        return entries;
      }

      const searchTerm = query.toLowerCase().trim();
      
      return entries.filter(entry => {
        // Pesquisar no título
        if (entry.title && entry.title.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Pesquisar no conteúdo
        if (entry.content && entry.content.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Pesquisar nas etiquetas
        if (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
          return true;
        }
        
        // Pesquisar na gratidão
        if (entry.gratitude && entry.gratitude.some(item => item.toLowerCase().includes(searchTerm))) {
          return true;
        }
        
        return false;
      });
    } catch (error) {
      console.error('Erro ao pesquisar entradas:', error);
      return [];
    }
  }

  // Obter entradas por humor
  async getEntriesByMood(mood) {
    try {
      const entries = await this.getEntries();
      return entries.filter(entry => entry.mood === mood);
    } catch (error) {
      console.error('Erro ao carregar entradas por humor:', error);
      return [];
    }
  }

  // Obter entradas por etiqueta
  async getEntriesByTag(tag) {
    try {
      const entries = await this.getEntries();
      return entries.filter(entry => entry.tags && entry.tags.includes(tag));
    } catch (error) {
      console.error('Erro ao carregar entradas por etiqueta:', error);
      return [];
    }
  }

  // Obter todas as etiquetas únicas
  async getAllTags() {
    try {
      const entries = await this.getEntries();
      const allTags = entries.reduce((tags, entry) => {
        if (entry.tags) {
          tags.push(...entry.tags);
        }
        return tags;
      }, []);
      
      // Remover duplicatas e ordenar
      return [...new Set(allTags)].sort();
    } catch (error) {
      console.error('Erro ao carregar etiquetas:', error);
      return [];
    }
  }

  // Obter estatísticas do diário
  async getJournalStats() {
    try {
      const entries = await this.getEntries();
      
      const totalEntries = entries.length;
      
      // Entradas por humor
      const moodCounts = {};
      const moods = ['very_happy', 'happy', 'excited', 'calm', 'grateful', 'neutral', 'anxious', 'sad', 'angry', 'very_sad'];
      moods.forEach(mood => {
        moodCounts[mood] = entries.filter(e => e.mood === mood).length;
      });

      // Humor mais comum
      const mostCommonMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0];

      // Entradas recentes (últimos 7 dias)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekAgo;
      }).length;

      // Sequência atual (dias consecutivos com entradas)
      let currentStreak = 0;
      const today = new Date();
      let checkDate = new Date(today);
      
      while (currentStreak < 365) { // Limite de verificação
        const hasEntry = entries.some(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.toDateString() === checkDate.toDateString();
        });
        
        if (hasEntry) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Contagem de palavras total
      const totalWords = entries.reduce((total, entry) => {
        return total + (entry.content ? entry.content.split(' ').length : 0);
      }, 0);

      // Etiquetas mais usadas
      const tagCounts = {};
      entries.forEach(entry => {
        if (entry.tags) {
          entry.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      const topTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

      // Entradas por mês (últimos 12 meses)
      const monthlyEntries = {};
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      
      entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= twelveMonthsAgo) {
          const monthKey = entryDate.toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' });
          monthlyEntries[monthKey] = (monthlyEntries[monthKey] || 0) + 1;
        }
      });

      return {
        totalEntries,
        moodCounts,
        mostCommonMood: mostCommonMood ? { mood: mostCommonMood[0], count: mostCommonMood[1] } : null,
        recentEntries,
        currentStreak,
        totalWords,
        averageWordsPerEntry: totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0,
        topTags,
        monthlyEntries,
        totalTags: Object.keys(tagCounts).length,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas do diário:', error);
      return {
        totalEntries: 0,
        moodCounts: {},
        mostCommonMood: null,
        recentEntries: 0,
        currentStreak: 0,
        totalWords: 0,
        averageWordsPerEntry: 0,
        topTags: [],
        monthlyEntries: {},
        totalTags: 0,
      };
    }
  }

  // Obter entradas recentes (últimas 5)
  async getRecentEntries(limit = 5) {
    try {
      const entries = await this.getEntries();
      return entries.slice(0, limit);
    } catch (error) {
      console.error('Erro ao carregar entradas recentes:', error);
      return [];
    }
  }

  // Verificar se existe entrada para hoje
  async hasTodayEntry() {
    try {
      const today = new Date().toDateString();
      const entries = await this.getEntries();
      
      return entries.some(entry => {
        const entryDate = new Date(entry.date).toDateString();
        return entryDate === today;
      });
    } catch (error) {
      console.error('Erro ao verificar entrada de hoje:', error);
      return false;
    }
  }

  // Obter entrada de hoje
  async getTodayEntry() {
    try {
      const today = new Date().toDateString();
      const entries = await this.getEntries();
      
      return entries.find(entry => {
        const entryDate = new Date(entry.date).toDateString();
        return entryDate === today;
      });
    } catch (error) {
      console.error('Erro ao obter entrada de hoje:', error);
      return null;
    }
  }

  // Exportar entradas para texto
  async exportEntriesToText() {
    try {
      const entries = await this.getEntries();
      
      let exportText = '=== DIÁRIO METAFLOW ===\n\n';
      
      entries.forEach((entry, index) => {
        const date = new Date(entry.date);
        exportText += `${index + 1}. ${date.toLocaleDateString('pt-PT', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })}\n`;
        
        if (entry.title) {
          exportText += `Título: ${entry.title}\n`;
        }
        
        exportText += `Humor: ${entry.mood}\n`;
        
        if (entry.weather) {
          exportText += `Tempo: ${entry.weather}\n`;
        }
        
        if (entry.tags && entry.tags.length > 0) {
          exportText += `Etiquetas: ${entry.tags.join(', ')}\n`;
        }
        
        if (entry.gratitude && entry.gratitude.length > 0) {
          exportText += `Gratidão: ${entry.gratitude.join(', ')}\n`;
        }
        
        exportText += `\n${entry.content}\n`;
        exportText += '\n' + '='.repeat(50) + '\n\n';
      });
      
      return exportText;
    } catch (error) {
      console.error('Erro ao exportar entradas:', error);
      throw error;
    }
  }

  // Obter calendário de entradas (para visualização de calendário)
  async getEntriesCalendar(year, month) {
    try {
      const entries = await this.getEntries();
      const calendar = {};
      
      entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
          const day = entryDate.getDate();
          calendar[day] = {
            hasEntry: true,
            mood: entry.mood,
            title: entry.title,
            id: entry.id,
          };
        }
      });
      
      return calendar;
    } catch (error) {
      console.error('Erro ao obter calendário de entradas:', error);
      return {};
    }
  }
}

export default new JournalService();

