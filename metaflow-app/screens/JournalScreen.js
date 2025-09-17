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
  Chip,
  Button
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import JournalEntry from '../components/journal/JournalEntry';
import JournalForm from '../components/journal/JournalForm';
import journalService from '../services/journalService';

const JournalScreen = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [hasTodayEntry, setHasTodayEntry] = useState(false);

  // Carregar entradas quando o ecrã ganha foco
  useFocusEffect(
    useCallback(() => {
      loadEntries();
      loadTags();
      checkTodayEntry();
    }, [])
  );

  // Filtrar entradas quando a pesquisa, humor ou etiqueta muda
  useEffect(() => {
    filterEntries();
  }, [entries, searchQuery, selectedMood, selectedTag]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const loadedEntries = await journalService.getEntries();
      setEntries(loadedEntries);
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
      showSnackbar('Erro ao carregar entradas do diário');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tags = await journalService.getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error('Erro ao carregar etiquetas:', error);
    }
  };

  const checkTodayEntry = async () => {
    try {
      const hasEntry = await journalService.hasTodayEntry();
      setHasTodayEntry(hasEntry);
    } catch (error) {
      console.error('Erro ao verificar entrada de hoje:', error);
    }
  };

  const filterEntries = async () => {
    try {
      let filtered = [...entries];
      
      // Filtrar por pesquisa
      if (searchQuery.trim()) {
        filtered = await journalService.searchEntries(searchQuery);
      }
      
      // Filtrar por humor
      if (selectedMood) {
        filtered = filtered.filter(entry => entry.mood === selectedMood);
      }
      
      // Filtrar por etiqueta
      if (selectedTag) {
        filtered = filtered.filter(entry => entry.tags && entry.tags.includes(selectedTag));
      }
      
      setFilteredEntries(filtered);
    } catch (error) {
      console.error('Erro ao filtrar entradas:', error);
      setFilteredEntries(entries);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleAddEntry = async () => {
    // Verificar se já existe entrada para hoje
    const todayEntry = await journalService.getTodayEntry();
    if (todayEntry) {
      Alert.alert(
        'Entrada de Hoje',
        'Já existe uma entrada para hoje. Deseja editá-la ou criar uma nova?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Editar Existente',
            onPress: () => handleEditEntry(todayEntry),
          },
          {
            text: 'Nova Entrada',
            onPress: () => {
              setEditingEntry(null);
              setShowForm(true);
            },
          },
        ]
      );
    } else {
      setEditingEntry(null);
      setShowForm(true);
    }
    setMenuVisible(false);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleSaveEntry = async (entryData) => {
    try {
      await journalService.saveEntry(entryData);
      await loadEntries();
      await loadTags();
      await checkTodayEntry();
      
      const message = editingEntry 
        ? 'Entrada atualizada com sucesso!' 
        : 'Entrada criada com sucesso!';
      showSnackbar(message);
    } catch (error) {
      console.error('Erro ao guardar entrada:', error);
      showSnackbar('Erro ao guardar entrada');
    }
  };

  const handleDeleteEntry = (entryId) => {
    const entry = entries.find(e => e.id === entryId);
    const entryDate = new Date(entry.date).toLocaleDateString('pt-PT');
    
    Alert.alert(
      'Eliminar Entrada',
      `Tem a certeza que deseja eliminar a entrada de ${entryDate}?`,
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
              await journalService.deleteEntry(entryId);
              await loadEntries();
              await loadTags();
              await checkTodayEntry();
              showSnackbar('Entrada eliminada com sucesso!');
            } catch (error) {
              console.error('Erro ao eliminar entrada:', error);
              showSnackbar('Erro ao eliminar entrada');
            }
          },
        },
      ]
    );
  };

  const handleEntryPress = (entry) => {
    // Abrir entrada para edição quando pressionada
    handleEditEntry(entry);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMood(null);
    setSelectedTag(null);
    setMenuVisible(false);
  };

  const renderEntryItem = ({ item }) => (
    <JournalEntry
      entry={item}
      onEdit={handleEditEntry}
      onDelete={handleDeleteEntry}
      onPress={handleEntryPress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery || selectedMood || selectedTag
          ? 'Nenhuma entrada encontrada para os filtros aplicados.'
          : 'Ainda não tem entradas no diário.\nToque no botão + para criar a sua primeira entrada.'
        }
      </Text>
      
      {!hasTodayEntry && !searchQuery && !selectedMood && !selectedTag && (
        <Button
          mode="contained"
          onPress={handleAddEntry}
          style={styles.emptyButton}
        >
          Escrever sobre hoje
        </Button>
      )}
    </View>
  );

  const getMoodOptions = () => [
    { value: 'very_happy', label: 'Muito Feliz', emoji: '😄', color: '#4CAF50' },
    { value: 'happy', label: 'Feliz', emoji: '😊', color: '#8BC34A' },
    { value: 'excited', label: 'Animado', emoji: '🤩', color: '#E91E63' },
    { value: 'calm', label: 'Calmo', emoji: '😌', color: '#2196F3' },
    { value: 'grateful', label: 'Grato', emoji: '🙏', color: '#9C27B0' },
    { value: 'neutral', label: 'Neutro', emoji: '😐', color: '#9E9E9E' },
    { value: 'anxious', label: 'Ansioso', emoji: '😰', color: '#FF5722' },
    { value: 'sad', label: 'Triste', emoji: '😔', color: '#FF9800' },
    { value: 'angry', label: 'Irritado', emoji: '😠', color: '#D32F2F' },
    { value: 'very_sad', label: 'Muito Triste', emoji: '😢', color: '#F44336' },
  ];

  const getStatsText = () => {
    const total = entries.length;
    
    if (total === 0) return '';
    
    let text = `${total} ${total === 1 ? 'entrada' : 'entradas'}`;
    
    if (hasTodayEntry) {
      text += ' • Hoje escrito';
    }
    
    return text;
  };

  const getFabLabel = () => {
    return hasTodayEntry ? 'Nova Entrada' : 'Escrever Hoje';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Title style={styles.title}>Diário</Title>
          {entries.length > 0 && (
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
          <Menu.Item onPress={handleAddEntry} title="Nova Entrada" leadingIcon="plus" />
          <Menu.Item onPress={clearFilters} title="Limpar Filtros" leadingIcon="filter-off" />
        </Menu>
      </View>

      {entries.length > 0 && (
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Pesquisar no diário..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>
      )}

      {(selectedMood || selectedTag || allTags.length > 0) && (
        <View style={styles.filtersContainer}>
          {/* Filtros de humor */}
          <View style={styles.moodFilters}>
            {getMoodOptions().slice(0, 6).map((mood) => (
              <Chip
                key={mood.value}
                selected={selectedMood === mood.value}
                onPress={() => setSelectedMood(selectedMood === mood.value ? null : mood.value)}
                style={[
                  styles.moodChip,
                  { backgroundColor: selectedMood === mood.value ? mood.color + '40' : 'transparent' }
                ]}
                textStyle={{ color: mood.color }}
                compact
              >
                {mood.emoji} {mood.label}
              </Chip>
            ))}
          </View>
          
          {/* Filtros de etiquetas */}
          {allTags.length > 0 && (
            <View style={styles.tagFilters}>
              {allTags.slice(0, 4).map((tag) => (
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
          data={filteredEntries}
          renderItem={renderEntryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={filteredEntries.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadEntries}
        />
      </View>

      <FAB
        style={[styles.fab, { backgroundColor: hasTodayEntry ? '#6200EE' : '#4CAF50' }]}
        icon="plus"
        onPress={handleAddEntry}
        label={getFabLabel()}
      />

      <JournalForm
        visible={showForm}
        onDismiss={() => setShowForm(false)}
        onSave={handleSaveEntry}
        entry={editingEntry}
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
  moodFilters: {
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
  moodChip: {
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
    marginBottom: 20,
  },
  emptyButton: {
    marginTop: 16,
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

export default JournalScreen;

