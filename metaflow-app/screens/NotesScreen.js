import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { 
  Text, 
  Title, 
  FAB, 
  Snackbar, 
  Searchbar, 
  Menu, 
  IconButton,
  Chip
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import NoteCard from '../components/notes/NoteCard';
import NoteForm from '../components/notes/NoteForm';
import noteService from '../services/noteService';

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [allTags, setAllTags] = useState([]);

  // Carregar notas quando o ecrã ganha foco
  useFocusEffect(
    useCallback(() => {
      loadNotes();
      loadTags();
    }, [])
  );

  // Filtrar notas quando a pesquisa, cor ou etiqueta muda
  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery, selectedColor, selectedTag]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const loadedNotes = await noteService.getNotes();
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      showSnackbar('Erro ao carregar notas');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tags = await noteService.getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error('Erro ao carregar etiquetas:', error);
    }
  };

  const filterNotes = async () => {
    try {
      let filtered = [...notes];
      
      // Filtrar por pesquisa
      if (searchQuery.trim()) {
        filtered = await noteService.searchNotes(searchQuery);
      }
      
      // Filtrar por cor
      if (selectedColor) {
        filtered = filtered.filter(note => note.color === selectedColor);
      }
      
      // Filtrar por etiqueta
      if (selectedTag) {
        filtered = filtered.filter(note => note.tags && note.tags.includes(selectedTag));
      }
      
      setFilteredNotes(filtered);
    } catch (error) {
      console.error('Erro ao filtrar notas:', error);
      setFilteredNotes(notes);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setShowForm(true);
    setMenuVisible(false);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      await noteService.saveNote(noteData);
      await loadNotes();
      await loadTags();
      
      const message = editingNote 
        ? 'Nota atualizada com sucesso!' 
        : 'Nota criada com sucesso!';
      showSnackbar(message);
    } catch (error) {
      console.error('Erro ao guardar nota:', error);
      showSnackbar('Erro ao guardar nota');
    }
  };

  const handleDeleteNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    
    Alert.alert(
      'Eliminar Nota',
      `Tem a certeza que deseja eliminar a nota "${note?.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await noteService.deleteNote(noteId);
              await loadNotes();
              await loadTags();
              showSnackbar('Nota eliminada com sucesso!');
            } catch (error) {
              console.error('Erro ao eliminar nota:', error);
              showSnackbar('Erro ao eliminar nota');
            }
          },
        },
      ]
    );
  };

  const handleNotePress = (note) => {
    // Abrir nota para edição quando pressionada
    handleEditNote(note);
  };

  const handleTogglePin = async (noteId) => {
    try {
      await noteService.togglePinNote(noteId);
      await loadNotes();
      showSnackbar('Estado de fixação alterado!');
    } catch (error) {
      console.error('Erro ao alternar fixação:', error);
      showSnackbar('Erro ao alterar fixação');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedColor(null);
    setSelectedTag(null);
    setMenuVisible(false);
  };

  const renderNoteItem = ({ item }) => (
    <NoteCard
      note={item}
      onEdit={handleEditNote}
      onDelete={handleDeleteNote}
      onPress={handleNotePress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery || selectedColor || selectedTag
          ? 'Nenhuma nota encontrada para os filtros aplicados.'
          : 'Ainda não tem notas criadas.\nToque no botão + para criar a sua primeira nota.'
        }
      </Text>
    </View>
  );

  const getColorOptions = () => [
    { value: 'yellow', label: 'Amarelo', color: '#FFC107' },
    { value: 'blue', label: 'Azul', color: '#2196F3' },
    { value: 'green', label: 'Verde', color: '#4CAF50' },
    { value: 'pink', label: 'Rosa', color: '#E91E63' },
    { value: 'purple', label: 'Roxo', color: '#9C27B0' },
    { value: 'orange', label: 'Laranja', color: '#FF9800' },
    { value: 'red', label: 'Vermelho', color: '#F44336' },
    { value: 'gray', label: 'Cinza', color: '#9E9E9E' },
  ];

  const getStatsText = () => {
    const total = notes.length;
    const pinned = notes.filter(n => n.isPinned).length;
    
    if (total === 0) return '';
    
    let text = `${total} ${total === 1 ? 'nota' : 'notas'}`;
    if (pinned > 0) {
      text += `, ${pinned} ${pinned === 1 ? 'fixada' : 'fixadas'}`;
    }
    
    return text;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>Notas</Title>
          {notes.length > 0 && (
            <Text style={styles.subtitle}>{getStatsText()}</Text>
          )}
        </View>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
              iconColor="#666"
            />
          }
        >
          <Menu.Item onPress={handleAddNote} title="Nova Nota" leadingIcon="plus" />
          <Menu.Item onPress={clearFilters} title="Limpar Filtros" leadingIcon="filter-off" />
        </Menu>
      </View>

      {notes.length > 0 && (
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Pesquisar notas..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>
      )}

      {(selectedColor || selectedTag || allTags.length > 0) && (
        <View style={styles.filtersContainer}>
          {/* Filtros de cor */}
          <View style={styles.colorFilters}>
            {getColorOptions().map((color) => (
              <Chip
                key={color.value}
                selected={selectedColor === color.value}
                onPress={() => setSelectedColor(selectedColor === color.value ? null : color.value)}
                style={[
                  styles.colorChip,
                  { backgroundColor: selectedColor === color.value ? color.color + '40' : 'transparent' }
                ]}
                textStyle={{ color: color.color }}
                compact
              >
                {color.label}
              </Chip>
            ))}
          </View>
          
          {/* Filtros de etiquetas */}
          {allTags.length > 0 && (
            <View style={styles.tagFilters}>
              {allTags.slice(0, 5).map((tag) => (
                <Chip
                  key={tag}
                  selected={selectedTag === tag}
                  onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  style={styles.tagChip}
                  compact
                >
                  {tag}
                </Chip>
              ))}
            </View>
          )}
        </View>
      )}
      
      <View style={styles.content}>
        <FlatList
          data={filteredNotes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={filteredNotes.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadNotes}
          numColumns={2}
          columnWrapperStyle={filteredNotes.length > 0 ? styles.row : null}
        />
      </View>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddNote}
        label="Nova Nota"
      />

      <NoteForm
        visible={showForm}
        onDismiss={() => setShowForm(false)}
        onSave={handleSaveNote}
        note={editingNote}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchbar: {
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  colorFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  colorChip: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tagChip: {
    backgroundColor: '#e0e0e0',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 20,
    paddingBottom: 100, // Espaço para o FAB
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.6,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  snackbar: {
    marginBottom: 80, // Espaço para a barra de navegação
  },
});

export default NotesScreen;

