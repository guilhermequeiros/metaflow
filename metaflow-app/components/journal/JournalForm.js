import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Modal, 
  Portal, 
  Title, 
  TextInput, 
  Button, 
  Text,
  Divider,
  Chip
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const JournalForm = ({ visible, onDismiss, onSave, entry = null }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [weather, setWeather] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [date, setDate] = useState(new Date().toISOString());

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content || '');
      setMood(entry.mood || 'neutral');
      setWeather(entry.weather || '');
      setTags(entry.tags || []);
      setGratitude(entry.gratitude || ['', '', '']);
      setDate(entry.date || new Date().toISOString());
    } else {
      resetForm();
    }
  }, [entry, visible]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('neutral');
    setWeather('');
    setTags([]);
    setNewTag('');
    setGratitude(['', '', '']);
    setDate(new Date().toISOString());
  };

  const handleSave = () => {
    if (!content.trim()) return;

    const entryData = {
      id: entry?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      mood,
      weather,
      tags: tags.filter(tag => tag.trim() !== ''),
      gratitude: gratitude.filter(item => item.trim() !== ''),
      date: entry?.date || date,
      updatedAt: new Date().toISOString(),
    };

    onSave(entryData);
    onDismiss();
  };

  const handleCancel = () => {
    resetForm();
    onDismiss();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputSubmit = () => {
    addTag();
  };

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

  const getWeatherOptions = () => [
    { value: '', label: 'Não especificar', emoji: '' },
    { value: 'sunny', label: 'Ensolarado', emoji: '☀️' },
    { value: 'cloudy', label: 'Nublado', emoji: '☁️' },
    { value: 'rainy', label: 'Chuvoso', emoji: '🌧️' },
    { value: 'stormy', label: 'Tempestuoso', emoji: '⛈️' },
    { value: 'snowy', label: 'Nevando', emoji: '❄️' },
    { value: 'windy', label: 'Ventoso', emoji: '💨' },
    { value: 'foggy', label: 'Nevoeiro', emoji: '🌫️' },
  ];

  const updateGratitude = (index, value) => {
    const newGratitude = [...gratitude];
    newGratitude[index] = value;
    setGratitude(newGratitude);
  };

  const formatDate = () => {
    const entryDate = new Date(date);
    return entryDate.toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modal}
      >
        <ScrollView style={styles.scrollView}>
          <Title style={styles.title}>
            {entry ? 'Editar Entrada' : 'Nova Entrada do Diário'}
          </Title>

          <Text style={styles.dateText}>{formatDate()}</Text>

          <TextInput
            label="Título (opcional)"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            placeholder="Ex: Um dia especial"
          />

          <TextInput
            label="Como foi o seu dia? *"
            value={content}
            onChangeText={setContent}
            style={styles.contentInput}
            mode="outlined"
            multiline
            numberOfLines={10}
            placeholder="Escreva sobre o seu dia, pensamentos, experiências..."
          />

          <View style={styles.moodContainer}>
            <Text style={styles.sectionTitle}>Como se sente hoje?</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.moodGrid}>
              {getMoodOptions().map((option) => (
                <Button
                  key={option.value}
                  mode={mood === option.value ? 'contained' : 'outlined'}
                  onPress={() => setMood(option.value)}
                  style={[
                    styles.moodButton,
                    { 
                      backgroundColor: mood === option.value ? option.color : 'transparent',
                      borderColor: option.color 
                    }
                  ]}
                  labelStyle={[
                    styles.moodButtonText,
                    { color: mood === option.value ? 'white' : option.color }
                  ]}
                  compact
                >
                  {option.emoji} {option.label}
                </Button>
              ))}
            </View>
          </View>

          <View style={styles.weatherContainer}>
            <Text style={styles.sectionTitle}>Como está o tempo?</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.weatherGrid}>
              {getWeatherOptions().map((option) => (
                <Button
                  key={option.value}
                  mode={weather === option.value ? 'contained' : 'outlined'}
                  onPress={() => setWeather(option.value)}
                  style={[
                    styles.weatherButton,
                    { 
                      backgroundColor: weather === option.value ? Colors.light.primary : 'transparent',
                      borderColor: Colors.light.primary 
                    }
                  ]}
                  labelStyle={[
                    styles.weatherButtonText,
                    { color: weather === option.value ? 'white' : Colors.light.primary }
                  ]}
                  compact
                >
                  {option.emoji} {option.label}
                </Button>
              ))}
            </View>
          </View>

          <View style={styles.gratitudeContainer}>
            <Text style={styles.sectionTitle}>Pelo que é grato hoje?</Text>
            <Divider style={styles.divider} />
            
            {gratitude.map((item, index) => (
              <TextInput
                key={index}
                label={`Gratidão ${index + 1} (opcional)`}
                value={item}
                onChangeText={(value) => updateGratitude(index, value)}
                style={styles.gratitudeInput}
                mode="outlined"
                placeholder={`Ex: ${index === 0 ? 'Família' : index === 1 ? 'Saúde' : 'Amigos'}`}
              />
            ))}
          </View>

          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>Etiquetas</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.tagInputContainer}>
              <TextInput
                label="Nova etiqueta"
                value={newTag}
                onChangeText={setNewTag}
                style={styles.tagInput}
                mode="outlined"
                placeholder="Ex: trabalho, família, viagem"
                onSubmitEditing={handleTagInputSubmit}
                returnKeyType="done"
              />
              <Button
                mode="contained"
                onPress={addTag}
                style={styles.addTagButton}
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
              >
                Adicionar
              </Button>
            </View>
            
            {tags.length > 0 && (
              <View style={styles.tagsDisplay}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    style={styles.tagChip}
                    onClose={() => removeTag(tag)}
                    closeIcon="close"
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={[styles.button, styles.cancelButton]}
              labelStyle={styles.cancelButtonText}
            >
              Cancelar
            </Button>
            
            <Button
              mode="contained"
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              disabled={!content.trim()}
            >
              {entry ? 'Atualizar' : 'Guardar'}
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.textSecondary,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  input: {
    marginBottom: 16,
  },
  contentInput: {
    marginBottom: 24,
    minHeight: 150,
  },
  moodContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  divider: {
    marginBottom: 12,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodButton: {
    minWidth: 100,
    marginBottom: 8,
  },
  moodButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  weatherContainer: {
    marginBottom: 24,
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weatherButton: {
    minWidth: 110,
    marginBottom: 8,
  },
  weatherButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  gratitudeContainer: {
    marginBottom: 24,
  },
  gratitudeInput: {
    marginBottom: 12,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    height: 40,
    justifyContent: 'center',
  },
  tagsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    color: Colors.light.textSecondary,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
});

export default JournalForm;

