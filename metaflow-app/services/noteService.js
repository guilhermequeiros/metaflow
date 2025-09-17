import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_STORAGE_KEY = '@metaflow_notes';

class NoteService {
  // Obter todas as notas
  async getNotes() {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      const notes = notesJson ? JSON.parse(notesJson) : [];
      
      // Ordenar: notas fixadas primeiro, depois por data de atualização
      return notes.sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      return [];
    }
  }

  // Guardar nota (criar ou atualizar)
  async saveNote(note) {
    try {
      const notes = await this.getNotes();
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        // Atualizar nota existente
        notes[existingIndex] = { ...notes[existingIndex], ...note };
      } else {
        // Adicionar nova nota
        notes.push(note);
      }
      
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      return note;
    } catch (error) {
      console.error('Erro ao guardar nota:', error);
      throw error;
    }
  }

  // Eliminar nota
  async deleteNote(noteId) {
    try {
      const notes = await this.getNotes();
      const filteredNotes = notes.filter(n => n.id !== noteId);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
      return true;
    } catch (error) {
      console.error('Erro ao eliminar nota:', error);
      throw error;
    }
  }

  // Alternar estado de fixação da nota
  async togglePinNote(noteId) {
    try {
      const notes = await this.getNotes();
      const noteIndex = notes.findIndex(n => n.id === noteId);
      
      if (noteIndex === -1) {
        throw new Error('Nota não encontrada');
      }

      notes[noteIndex].isPinned = !notes[noteIndex].isPinned;
      notes[noteIndex].updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      return notes[noteIndex];
    } catch (error) {
      console.error('Erro ao alternar fixação da nota:', error);
      throw error;
    }
  }

  // Pesquisar notas
  async searchNotes(query) {
    try {
      const notes = await this.getNotes();
      
      if (!query || query.trim() === '') {
        return notes;
      }

      const searchTerm = query.toLowerCase().trim();
      
      return notes.filter(note => {
        // Pesquisar no título
        if (note.title && note.title.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Pesquisar no conteúdo
        if (note.content && note.content.toLowerCase().includes(searchTerm)) {
          return true;
        }
        
        // Pesquisar nas etiquetas
        if (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
          return true;
        }
        
        return false;
      });
    } catch (error) {
      console.error('Erro ao pesquisar notas:', error);
      return [];
    }
  }

  // Obter notas por cor
  async getNotesByColor(color) {
    try {
      const notes = await this.getNotes();
      return notes.filter(note => note.color === color);
    } catch (error) {
      console.error('Erro ao carregar notas por cor:', error);
      return [];
    }
  }

  // Obter notas por etiqueta
  async getNotesByTag(tag) {
    try {
      const notes = await this.getNotes();
      return notes.filter(note => note.tags && note.tags.includes(tag));
    } catch (error) {
      console.error('Erro ao carregar notas por etiqueta:', error);
      return [];
    }
  }

  // Obter todas as etiquetas únicas
  async getAllTags() {
    try {
      const notes = await this.getNotes();
      const allTags = notes.reduce((tags, note) => {
        if (note.tags) {
          tags.push(...note.tags);
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

  // Obter estatísticas das notas
  async getNotesStats() {
    try {
      const notes = await this.getNotes();
      
      const totalNotes = notes.length;
      const pinnedNotes = notes.filter(n => n.isPinned).length;
      
      // Notas por cor
      const notesByColor = {};
      const colors = ['yellow', 'blue', 'green', 'pink', 'purple', 'orange', 'red', 'gray'];
      colors.forEach(color => {
        notesByColor[color] = notes.filter(n => n.color === color).length;
      });

      // Etiquetas mais usadas
      const tagCounts = {};
      notes.forEach(note => {
        if (note.tags) {
          note.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      const topTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

      // Notas criadas recentemente (últimos 7 dias)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentNotes = notes.filter(note => {
        const createdDate = new Date(note.createdAt);
        return createdDate >= weekAgo;
      }).length;

      return {
        totalNotes,
        pinnedNotes,
        notesByColor,
        topTags,
        recentNotes,
        totalTags: Object.keys(tagCounts).length,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas das notas:', error);
      return {
        totalNotes: 0,
        pinnedNotes: 0,
        notesByColor: {},
        topTags: [],
        recentNotes: 0,
        totalTags: 0,
      };
    }
  }

  // Obter notas recentes (últimas 5)
  async getRecentNotes(limit = 5) {
    try {
      const notes = await this.getNotes();
      return notes.slice(0, limit);
    } catch (error) {
      console.error('Erro ao carregar notas recentes:', error);
      return [];
    }
  }

  // Exportar notas para texto
  async exportNotesToText() {
    try {
      const notes = await this.getNotes();
      
      let exportText = '=== NOTAS METAFLOW ===\n\n';
      
      notes.forEach((note, index) => {
        exportText += `${index + 1}. ${note.title}\n`;
        exportText += `Criada em: ${new Date(note.createdAt).toLocaleString('pt-PT')}\n`;
        if (note.tags && note.tags.length > 0) {
          exportText += `Etiquetas: ${note.tags.join(', ')}\n`;
        }
        exportText += `\n${note.content}\n`;
        exportText += '\n' + '='.repeat(50) + '\n\n';
      });
      
      return exportText;
    } catch (error) {
      console.error('Erro ao exportar notas:', error);
      throw error;
    }
  }

  // Importar notas de texto (formato simples)
  async importNotesFromText(text) {
    try {
      // Implementação básica - pode ser expandida
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const notes = [];
      
      let currentNote = null;
      
      lines.forEach(line => {
        if (line.startsWith('Título:')) {
          if (currentNote) {
            notes.push(currentNote);
          }
          currentNote = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: line.replace('Título:', '').trim(),
            content: '',
            color: 'yellow',
            tags: [],
            isPinned: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        } else if (line.startsWith('Etiquetas:') && currentNote) {
          const tags = line.replace('Etiquetas:', '').split(',').map(tag => tag.trim()).filter(tag => tag !== '');
          currentNote.tags = tags;
        } else if (currentNote && !line.startsWith('Criada em:')) {
          currentNote.content += line + '\n';
        }
      });
      
      if (currentNote) {
        notes.push(currentNote);
      }
      
      // Guardar notas importadas
      for (const note of notes) {
        await this.saveNote(note);
      }
      
      return notes.length;
    } catch (error) {
      console.error('Erro ao importar notas:', error);
      throw error;
    }
  }
}

export default new NoteService();

