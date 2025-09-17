import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import { 
  Text, 
  Title, 
  Card, 
  List, 
  Button,
  Paragraph,
  ProgressBar,
  Chip,
  Divider,
  IconButton
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import storageManager from '../utils/storage';

const DataManagementScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [storageInfo, setStorageInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    const info = await storageManager.getStorageInfo();
    setStorageInfo(info);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const result = await storageManager.exportAllData();
      
      if (result.success) {
        const dataString = JSON.stringify(result.data, null, 2);
        
        // Tentar partilhar os dados
        try {
          await Share.share({
            message: dataString,
            title: 'Backup MetaFlow',
          });
        } catch (shareError) {
          // Se a partilha falhar, mostrar os dados numa janela de alerta
          Alert.alert(
            'Dados Exportados',
            'Os seus dados foram exportados com sucesso. Copie o conteúdo abaixo para guardar o backup.',
            [
              {
                text: 'OK',
                onPress: () => console.log('Dados exportados:', dataString),
              },
            ]
          );
        }
      } else {
        Alert.alert('Erro', 'Falha ao exportar dados: ' + result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao exportar dados');
      console.error('Erro na exportação:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = () => {
    Alert.alert(
      'Importar Dados',
      'Esta funcionalidade permite importar dados de um backup anterior. Tem a certeza que quer continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: () => {
            Alert.alert(
              'Funcionalidade em Desenvolvimento',
              'A importação de dados será implementada numa versão futura. Por agora, pode exportar os seus dados para backup.'
            );
          },
        },
      ]
    );
  };

  const handleCleanupData = () => {
    Alert.alert(
      'Limpar Dados Antigos',
      'Esta ação irá remover dados com mais de 90 dias. Quer continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const result = await storageManager.cleanupOldData(90);
            setLoading(false);
            
            if (result.success) {
              Alert.alert('Sucesso', result.message);
              loadStorageInfo();
            } else {
              Alert.alert('Erro', result.error);
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'ATENÇÃO: Esta ação irá remover TODOS os dados da aplicação permanentemente. Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'LIMPAR TUDO',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmação Final',
              'Tem ABSOLUTA certeza? Todos os hábitos, metas, tarefas, notas e entradas do diário serão perdidos para sempre.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'SIM, LIMPAR TUDO',
                  style: 'destructive',
                  onPress: async () => {
                    setLoading(true);
                    const success = await storageManager.clear();
                    setLoading(false);
                    
                    if (success) {
                      Alert.alert(
                        'Dados Limpos',
                        'Todos os dados foram removidos. A aplicação será reiniciada.',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              // Recarregar a aplicação
                              navigation.reset({
                                index: 0,
                                routes: [{ name: 'Dashboard' }],
                              });
                            },
                          },
                        ]
                      );
                    } else {
                      Alert.alert('Erro', 'Falha ao limpar dados');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const getStorageUsageColor = () => {
    if (!storageInfo) return theme.colors.primary;
    
    const usagePercentage = (storageInfo.totalSize / (1024 * 1024)) * 100; // Assumindo 1MB como "cheio"
    
    if (usagePercentage > 80) return theme.colors.error;
    if (usagePercentage > 60) return theme.colors.warning;
    return theme.colors.success;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            iconColor={theme.colors.onBackground}
          />
          <View style={styles.headerText}>
            <Title style={[styles.title, { color: theme.colors.onBackground }]}>
              Gestão de Dados
            </Title>
            <Paragraph style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Backup, exportação e limpeza de dados
            </Paragraph>
          </View>
        </View>

        <View style={styles.content}>
          {/* Informações de Armazenamento */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Informações de Armazenamento
                </Text>
              </View>

              {storageInfo ? (
                <>
                  <View style={styles.storageStats}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                        {storageInfo.totalKeys}
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                        Itens guardados
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                        {formatBytes(storageInfo.totalSize)}
                      </Text>
                      <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                        Espaço usado
                      </Text>
                    </View>
                  </View>

                  <ProgressBar
                    progress={Math.min(storageInfo.totalSize / (1024 * 100), 1)} // 100KB como referência
                    color={getStorageUsageColor()}
                    style={styles.progressBar}
                  />

                  <View style={styles.storageBreakdown}>
                    {Object.entries(storageInfo.itemSizes).map(([key, size]) => (
                      <View key={key} style={styles.storageItem}>
                        <Text style={[styles.storageKey, { color: theme.colors.onSurface }]}>
                          {key.replace('@metaflow_', '').toUpperCase()}
                        </Text>
                        <Chip
                          style={styles.sizeChip}
                          textStyle={styles.sizeChipText}
                          compact
                        >
                          {formatBytes(size)}
                        </Chip>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
                  A carregar informações...
                </Text>
              )}
            </Card.Content>
          </Card>

          {/* Backup e Exportação */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Backup e Exportação
                </Text>
              </View>

              <List.Item
                title="Exportar Dados"
                description="Criar backup de todos os dados em formato JSON"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="export" 
                    color={theme.colors.primary}
                  />
                )}
                right={() => (
                  <Button
                    mode="contained"
                    onPress={handleExportData}
                    loading={loading}
                    disabled={loading}
                    compact
                  >
                    Exportar
                  </Button>
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />

              <Divider style={styles.divider} />

              <List.Item
                title="Importar Dados"
                description="Restaurar dados de um backup anterior"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="import" 
                    color={theme.colors.outline}
                  />
                )}
                right={() => (
                  <Button
                    mode="outlined"
                    onPress={handleImportData}
                    disabled={loading}
                    compact
                  >
                    Importar
                  </Button>
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
            </Card.Content>
          </Card>

          {/* Limpeza de Dados */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Limpeza de Dados
                </Text>
              </View>

              <List.Item
                title="Limpar Dados Antigos"
                description="Remove dados com mais de 90 dias"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="broom" 
                    color={theme.colors.warning}
                  />
                )}
                right={() => (
                  <Button
                    mode="outlined"
                    onPress={handleCleanupData}
                    disabled={loading}
                    compact
                  >
                    Limpar
                  </Button>
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />

              <Divider style={styles.divider} />

              <List.Item
                title="Limpar Todos os Dados"
                description="ATENÇÃO: Remove todos os dados permanentemente"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="delete-forever" 
                    color={theme.colors.error}
                  />
                )}
                right={() => (
                  <Button
                    mode="contained"
                    onPress={handleClearAllData}
                    disabled={loading}
                    buttonColor={theme.colors.error}
                    compact
                  >
                    Limpar Tudo
                  </Button>
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.error }}
              />
            </Card.Content>
          </Card>

          {/* Informações Adicionais */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Informações Importantes
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Paragraph style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                  • Os dados são guardados localmente no seu dispositivo usando AsyncStorage
                </Paragraph>
                <Paragraph style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                  • Fazer backup regularmente é recomendado para evitar perda de dados
                </Paragraph>
                <Paragraph style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                  • A exportação cria um ficheiro JSON com todos os seus dados
                </Paragraph>
                <Paragraph style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                  • A limpeza de dados antigos pode melhorar o desempenho da aplicação
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  headerText: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  storageBreakdown: {
    gap: 8,
  },
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  storageKey: {
    fontSize: 14,
    fontWeight: '500',
  },
  sizeChip: {
    backgroundColor: '#f0f0f0',
  },
  sizeChipText: {
    fontSize: 12,
  },
  loadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 8,
  },
  infoSection: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DataManagementScreen;

