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
  Switch,
  Chip
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const NoteForm = ({ visible, onDismiss, onSave, note = null }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setColor(note.color || 'yellow');
      setTags(note.tags || []);
      setIsPinned(note.isPinned || false);
    } else {
      resetForm();
    }
  }, [note, visible]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setColor('yellow');
    setTags([]);
    setNewTag('');
    setIsPinned(false);
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    const noteData = {
      id: note?.id || Date.now().toString(),
      title: title.trim() || 'Nota sem título',
      content: content.trim(),
      color,
      tags: tags.filter(tag => tag.trim() !== ''),
      isPinned,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(noteData);
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

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modal}
      >
        <ScrollView style={styles.scrollView}>
          <Title style={styles.title}>
            {note ? 'Editar Nota' : 'Nova Nota'}
          </Title>

          <TextInput
            label="Título (opcional)"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            placeholder="Ex: Ideias para o projeto"
          />

          <TextInput
            label="Conteúdo *"
            value={content}
            onChangeText={setContent}
            style={styles.contentInput}
            mode="outlined"
            multiline
            numberOfLines={8}
            placeholder="Escreva aqui o conteúdo da sua nota..."
          />

          <View style={styles.colorContainer}>
            <Text style={styles.sectionTitle}>Cor da Nota</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.colorGrid}>
              {getColorOptions().map((option) => (
                <Button
                  key={option.value}
                  mode={color === option.value ? 'contained' : 'outlined'}
                  onPress={() => setColor(option.value)}
                  style={[
                    styles.colorButton,
                    { 
                      backgroundColor: color === option.value ? option.color : 'transparent',
                      borderColor: option.color 
                    }
                  ]}
                  labelStyle={[
                    styles.colorButtonText,
                    { color: color === option.value ? 'white' : option.color }
                  ]}
                  compact
                >
                  {option.label}
                </Button>
              ))}
            </View>
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
                placeholder="Ex: trabalho, pessoal"
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

          <View style={styles.optionsContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Fixar nota</Text>
              <Switch
                value={isPinned}
                onValueChange={setIsPinned}
                color={Colors.light.primary}
              />
            </View>
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
              disabled={!title.trim() && !content.trim()}
            >
              {note ? 'Atualizar' : 'Criar'}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  contentInput: {
    marginBottom: 24,
    minHeight: 120,
  },
  colorContainer: {
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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    minWidth: 80,
    marginBottom: 8,
  },
  colorButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
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
  optionsContainer: {
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.light.text,
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

export default NoteForm;

