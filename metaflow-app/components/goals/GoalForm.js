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

const GoalForm = ({ visible, onDismiss, onSave, goal = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('annual');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [unit, setUnit] = useState('');
  const [deadline, setDeadline] = useState('');
  const [hasDeadline, setHasDeadline] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || '');
      setDescription(goal.description || '');
      setType(goal.type || 'annual');
      setTargetValue(goal.targetValue?.toString() || '');
      setCurrentValue(goal.currentValue?.toString() || '');
      setUnit(goal.unit || '');
      setDeadline(goal.deadline || '');
      setHasDeadline(!!goal.deadline);
    } else {
      resetForm();
    }
  }, [goal, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('annual');
    setTargetValue('');
    setCurrentValue('');
    setUnit('');
    setDeadline('');
    setHasDeadline(false);
  };

  const handleSave = () => {
    if (!title.trim() || !targetValue.trim()) return;

    const goalData = {
      id: goal?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      type,
      targetValue: parseFloat(targetValue) || 0,
      currentValue: parseFloat(currentValue) || 0,
      unit: unit.trim(),
      deadline: hasDeadline ? deadline : null,
      completed: goal?.completed || false,
      completedAt: goal?.completedAt || null,
      createdAt: goal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(goalData);
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
    setDeadline(text);
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
            {goal ? 'Editar Meta' : 'Nova Meta'}
          </Title>

          <TextInput
            label="Título da meta *"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            placeholder="Ex: Ler 12 livros"
          />

          <TextInput
            label="Descrição (opcional)"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Adicione uma descrição para a sua meta..."
          />

          <View style={styles.typeContainer}>
            <Text style={styles.sectionTitle}>Tipo de Meta</Text>
            <Divider style={styles.divider} />
            
            <RadioButton.Group
              onValueChange={setType}
              value={type}
            >
              <View style={styles.radioItem}>
                <RadioButton value="annual" color={Colors.light.primary} />
                <Text style={styles.radioLabel}>Anual</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="quarterly" color={Colors.light.secondary} />
                <Text style={styles.radioLabel}>Trimestral</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="monthly" color={Colors.light.accent} />
                <Text style={styles.radioLabel}>Mensal</Text>
              </View>
            </RadioButton.Group>
          </View>

          <View style={styles.row}>
            <TextInput
              label="Valor alvo *"
              value={targetValue}
              onChangeText={setTargetValue}
              style={[styles.input, styles.halfInput]}
              mode="outlined"
              keyboardType="numeric"
              placeholder="Ex: 12"
            />
            
            <TextInput
              label="Valor atual"
              value={currentValue}
              onChangeText={setCurrentValue}
              style={[styles.input, styles.halfInput]}
              mode="outlined"
              keyboardType="numeric"
              placeholder="Ex: 3"
            />
          </View>

          <TextInput
            label="Unidade (opcional)"
            value={unit}
            onChangeText={setUnit}
            style={styles.input}
            mode="outlined"
            placeholder="Ex: livros, kg, horas"
          />

          <View style={styles.deadlineContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Definir prazo</Text>
              <Switch
                value={hasDeadline}
                onValueChange={setHasDeadline}
                color={Colors.light.primary}
              />
            </View>
            
            {hasDeadline && (
              <TextInput
                label="Data limite"
                value={formatDateForInput(deadline)}
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
              disabled={!title.trim() || !targetValue.trim()}
            >
              {goal ? 'Atualizar' : 'Criar'}
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
  typeContainer: {
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  deadlineContainer: {
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

export default GoalForm;

