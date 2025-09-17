import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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

const ColumnForm = ({ visible, onDismiss, onSave, column = null }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('todo');

  useEffect(() => {
    if (column) {
      setName(column.name || '');
      setStatus(column.status || 'todo');
    } else {
      resetForm();
    }
  }, [column, visible]);

  const resetForm = () => {
    setName('');
    setStatus('todo');
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const columnData = {
      id: column?.id || Date.now().toString(),
      name: name.trim(),
      status,
      order: column?.order || 0,
      createdAt: column?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(columnData);
    onDismiss();
  };

  const handleCancel = () => {
    resetForm();
    onDismiss();
  };

  const getStatusOptions = () => [
    { value: 'todo', label: 'A Fazer', color: Colors.light.textSecondary },
    { value: 'in_progress', label: 'Em Progresso', color: Colors.light.accent },
    { value: 'done', label: 'Concluído', color: Colors.light.success },
    { value: 'custom', label: 'Personalizado', color: Colors.light.primary },
  ];

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modal}
      >
        <View style={styles.content}>
          <Title style={styles.title}>
            {column ? 'Editar Coluna' : 'Nova Coluna'}
          </Title>

          <TextInput
            label="Nome da coluna *"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            placeholder="Ex: Em Revisão"
          />

          <View style={styles.statusContainer}>
            <Text style={styles.sectionTitle}>Tipo de Status</Text>
            <Divider style={styles.divider} />
            
            <RadioButton.Group
              onValueChange={setStatus}
              value={status}
            >
              {getStatusOptions().map((option) => (
                <View key={option.value} style={styles.radioItem}>
                  <RadioButton value={option.value} color={option.color} />
                  <Text style={[styles.radioLabel, { color: option.color }]}>
                    {option.label}
                  </Text>
                </View>
              ))}
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
              {column ? 'Atualizar' : 'Criar'}
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
  },
  content: {
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
  statusContainer: {
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
    fontWeight: '500',
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

export default ColumnForm;

