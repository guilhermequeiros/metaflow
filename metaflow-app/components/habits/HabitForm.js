import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Modal, 
  Portal, 
  Title, 
  TextInput, 
  Button, 
  RadioButton, 
  Text,
  Divider 
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const HabitForm = ({ visible, onDismiss, onSave, habit = null }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');

  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setDescription(habit.description || '');
      setFrequency(habit.frequency || 'daily');
    } else {
      setName('');
      setDescription('');
      setFrequency('daily');
    }
  }, [habit, visible]);

  const handleSave = () => {
    if (!name.trim()) return;

    const habitData = {
      id: habit?.id || Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      frequency,
      completedDates: habit?.completedDates || [],
      createdAt: habit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(habitData);
    onDismiss();
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setFrequency('daily');
    onDismiss();
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
            {habit ? 'Editar Hábito' : 'Novo Hábito'}
          </Title>

          <TextInput
            label="Nome do hábito *"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            placeholder="Ex: Beber 2L de água"
          />

          <TextInput
            label="Descrição (opcional)"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Adicione uma descrição para o seu hábito..."
          />

          <View style={styles.frequencyContainer}>
            <Text style={styles.frequencyTitle}>Frequência</Text>
            <Divider style={styles.divider} />
            
            <RadioButton.Group
              onValueChange={setFrequency}
              value={frequency}
            >
              <View style={styles.radioItem}>
                <RadioButton value="daily" color={Colors.light.primary} />
                <Text style={styles.radioLabel}>Diário</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="weekly" color={Colors.light.primary} />
                <Text style={styles.radioLabel}>Semanal</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="custom" color={Colors.light.primary} />
                <Text style={styles.radioLabel}>Personalizado</Text>
              </View>
            </RadioButton.Group>
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
              disabled={!name.trim()}
            >
              {habit ? 'Atualizar' : 'Criar'}
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
    maxHeight: '80%',
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
  frequencyContainer: {
    marginBottom: 24,
  },
  frequencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  divider: {
    marginBottom: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
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

export default HabitForm;

