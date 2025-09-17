import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Title, 
  Card, 
  List, 
  Switch, 
  Divider,
  Button,
  Paragraph
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/common/ThemeToggle';

const SettingsScreen = () => {
  const { theme, isDarkMode, themeMode } = useTheme();

  const getThemeDescription = () => {
    switch (themeMode) {
      case 'light':
        return 'A aplicação usa sempre o tema claro';
      case 'dark':
        return 'A aplicação usa sempre o tema escuro';
      case 'system':
      default:
        return 'A aplicação segue as configurações do sistema';
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Escuro';
      case 'system':
      default:
        return 'Sistema';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={[styles.title, { color: theme.colors.onBackground }]}>
            Configurações
          </Title>
          <Paragraph style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Personalize a sua experiência MetaFlow
          </Paragraph>
        </View>

        <View style={styles.content}>
          {/* Secção de Aparência */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Aparência
                </Text>
              </View>

              <List.Item
                title="Tema"
                description={getThemeDescription()}
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="palette" 
                    color={theme.colors.primary}
                  />
                )}
                right={() => (
                  <View style={styles.themeToggleContainer}>
                    <Text style={[styles.themeLabel, { color: theme.colors.onSurface }]}>
                      {getThemeLabel()}
                    </Text>
                    <ThemeToggle />
                  </View>
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />

              <Divider style={styles.divider} />

              <List.Item
                title="Modo Escuro Ativo"
                description={isDarkMode ? 'Tema escuro em uso' : 'Tema claro em uso'}
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon={isDarkMode ? 'moon-waning-crescent' : 'white-balance-sunny'} 
                    color={theme.colors.primary}
                  />
                )}
                right={() => (
                  <Switch
                    value={isDarkMode}
                    disabled={true}
                    thumbColor={isDarkMode ? theme.colors.primary : theme.colors.outline}
                  />
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
            </Card.Content>
          </Card>

          {/* Secção de Dados */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Dados e Armazenamento
                </Text>
              </View>

              <List.Item
                title="Armazenamento Local"
                description="Os dados são guardados localmente no dispositivo"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="database" 
                    color={theme.colors.primary}
                  />
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />

              <Divider style={styles.divider} />

              <List.Item
                title="Gestão de Dados"
                description="Backup, exportação e limpeza de dados"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="database-cog" 
                    color={theme.colors.primary}
                  />
                )}
                right={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="chevron-right" 
                    color={theme.colors.onSurfaceVariant}
                  />
                )}
                onPress={() => navigation.navigate('DataManagement')}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />

              <Divider style={styles.divider} />

              <List.Item
                title="Backup Automático"
                description="Funcionalidade em desenvolvimento"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="backup-restore" 
                    color={theme.colors.outline}
                  />
                )}
                right={() => (
                  <Switch
                    value={false}
                    disabled={true}
                    thumbColor={theme.colors.outline}
                  />
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
            </Card.Content>
          </Card>

          {/* Secção de Notificações */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Notificações
                </Text>
              </View>

              <List.Item
                title="Lembretes de Hábitos"
                description="Funcionalidade em desenvolvimento"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="bell" 
                    color={theme.colors.outline}
                  />
                )}
                right={() => (
                  <Switch
                    value={false}
                    disabled={true}
                    thumbColor={theme.colors.outline}
                  />
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />

              <Divider style={styles.divider} />

              <List.Item
                title="Lembrete do Diário"
                description="Funcionalidade em desenvolvimento"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="book-open" 
                    color={theme.colors.outline}
                  />
                )}
                right={() => (
                  <Switch
                    value={false}
                    disabled={true}
                    thumbColor={theme.colors.outline}
                  />
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />
            </Card.Content>
          </Card>

          {/* Secção Sobre */}
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Sobre a MetaFlow
                </Text>
              </View>

              <List.Item
                title="Versão"
                description="1.0.0 (Beta)"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="information" 
                    color={theme.colors.primary}
                  />
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />

              <Divider style={styles.divider} />

              <List.Item
                title="Desenvolvido com"
                description="React Native + Expo"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="react" 
                    color={theme.colors.primary}
                  />
                )}
                titleStyle={{ color: theme.colors.onSurface }}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              />

              <View style={styles.aboutText}>
                <Paragraph style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                  MetaFlow é uma aplicação de produtividade pessoal que combina gestão de hábitos, 
                  definição de metas, organização de tarefas, notas rápidas e diário digital numa 
                  experiência unificada e minimalista.
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  aboutText: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
  },
});

export default SettingsScreen;

