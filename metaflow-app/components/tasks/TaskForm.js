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
  Divider,
  Switch
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const TaskForm = ({ visible, onDismiss, onSave, task = null, columns = [] }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [columnId, setColumnId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [hasDueDate, setHasDueDate] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'normal');
      setColumnId(task.columnId || '');
      setDueDate(task.dueDate || '');
      setHasDueDate(!!task.dueDate);
    } else {
      resetForm();
    }
  }, [task, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('normal');
    setColumnId(columns.length > 0 ? columns[0].id : '');
    setDueDate('');
    setHasDueDate(false);
  };

  const handleSave = () => {
    if (!title.trim() || !columnId) return;

    const taskData = {
      id: task?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      columnId,
      dueDate: hasDueDate ? dueDate : null,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(taskData);
    onDismiss();
  };

  const handleCancel = () => {
    resetForm();
    onDismiss();
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (text) => {
    setDueDate(text);
  };

  const getPriorityOptions = () => [
    { value: 'low', label: 'Baixa', color: Colors.light.secondary },
    { value: 'normal', label: 'Normal', color: Colors.light.textSecondary },
    { value: 'medium', label: 'Média', color: Colors.light.accent },
    { value: 'high', label: 'Alta', color: Colors.light.error },
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
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Title>

          <TextInput
            label="Título da tarefa *"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            placeholder="Ex: Revisar relatório mensal"
          />

          <TextInput
            label="Descrição (opcional)"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Adicione detalhes sobre a tarefa..."
          />

          <View style={styles.priorityContainer}>
            <Text style={styles.sectionTitle}>Prioridade</Text>
            <Divider style={styles.divider} />
            
            <RadioButton.Group
              onValueChange={setPriority}
              value={priority}
            >
              {getPriorityOptions().map((option) => (
                <View key={option.value} style={styles.radioItem}>
                  <RadioButton value={option.value} color={option.color} />
                  <Text style={[styles.radioLabel, { color: option.color }]}>
                    {option.label}
                  </Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>

          {columns.length > 0 && (
            <View style={styles.columnContainer}>
              <Text style={styles.sectionTitle}>Coluna</Text>
              <Divider style={styles.divider} />
              
              <RadioButton.Group
                onValueChange={setColumnId}
                value={columnId}
              >
                {columns.map((column) => (
                  <View key={column.id} style={styles.radioItem}>
                    <RadioButton value={column.id} color={Colors.light.primary} />
                    <Text style={styles.radioLabel}>{column.name}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </View>
          )}

          <View style={styles.dueDateContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Definir prazo</Text>
              <Switch
                value={hasDueDate}
                onValueChange={setHasDueDate}
                color={Colors.light.primary}
              />
            </View>
            
            {hasDueDate && (
              <TextInput
                label="Data limite"
                value={formatDateForInput(dueDate)}
                onChangeText={handleDateChange}
                style={styles.input}
                mode="outlined"
                placeholder="AAAA-MM-DD"
              />
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
              disabled={!title.trim() || !columnId}
            >
              {task ? 'Atualizar' : 'Criar'}
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
  priorityContainer: {
    marginBottom: 24,
  },
  columnContainer: {
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
  dueDateContainer: {
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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

export default TaskForm;

