# MetaFlow - Aplicação de Produtividade Pessoal

Uma aplicação móvel completa para gestão de produtividade pessoal, desenvolvida com React Native e Expo.

## 🌟 Características Principais

### 📊 Dashboard Inteligente
- Resumo personalizado do dia
- Saudação baseada na hora atual
- Visão geral de todos os módulos
- Navegação rápida entre secções

### 🎯 Gestão de Hábitos
- Criação e acompanhamento de hábitos diários
- Sistema de streaks (dias consecutivos)
- Progresso visual com barras de progresso
- Marcação simples com checkbox

### 🏆 Definição de Metas
- Metas anuais, trimestrais e mensais
- Sistema de progresso baseado em valores
- Filtros por estado e tipo
- Cálculo automático de percentagens

### 📋 Tarefas Kanban
- Quadro Kanban com colunas personalizáveis
- Sistema de prioridades (Baixa, Normal, Média, Alta)
- Gestão de prazos com alertas visuais
- Colunas padrão: A Fazer, Em Progresso, Concluído, Em Revisão

### 📝 Notas Rápidas
- Sistema de cores para organização
- Etiquetas personalizáveis
- Pesquisa avançada por conteúdo e etiquetas
- Layout em grelha estilo Pinterest
- Notas fixadas para itens importantes

### 📖 Diário Digital
- Entradas diárias com título e conteúdo
- Sistema de humor com 10 estados emocionais
- Condições meteorológicas
- Sistema de gratidão (3 itens por entrada)
- Etiquetas e pesquisa avançada
- Estatísticas de escrita e streaks

### 🎨 Sistema de Temas
- Tema claro, escuro e automático (sistema)
- Alternância instantânea
- Persistência de preferências
- Design minimalista e moderno

### 💾 Gestão de Dados
- Armazenamento local com AsyncStorage
- Sistema de backup e exportação (JSON)
- Limpeza de dados antigos
- Informações detalhadas de uso
- Operações de importação/exportação

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desenvolvimento
- **React Navigation** - Navegação entre ecrãs
- **React Native Paper** - Componentes UI Material Design
- **AsyncStorage** - Armazenamento local
- **React Native Vector Icons** - Ícones

## 📱 Estrutura da Aplicação

```
metaflow-app/
├── components/           # Componentes reutilizáveis
│   ├── common/          # Componentes comuns
│   ├── habits/          # Componentes de hábitos
│   ├── goals/           # Componentes de metas
│   ├── tasks/           # Componentes de tarefas
│   ├── notes/           # Componentes de notas
│   └── journal/         # Componentes de diário
├── screens/             # Ecrãs da aplicação
├── navigation/          # Configuração de navegação
├── services/            # Serviços de dados
├── utils/               # Utilitários
├── constants/           # Constantes (cores, layout)
└── contexts/            # Contextos React
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI

### Instalação
1. Clone o repositório ou extraia os ficheiros
2. Navegue para a pasta do projeto:
   ```bash
   cd metaflow-app
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

### Execução
1. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   # ou
   npx expo start
   ```

2. Para executar no navegador web:
   ```bash
   npm run web
   ```

3. Para executar em dispositivo móvel:
   - Instale a aplicação Expo Go no seu dispositivo
   - Escaneie o código QR que aparece no terminal

## 📋 Funcionalidades Detalhadas

### Dashboard
- **Hábitos de Hoje**: Mostra progresso diário com percentagem
- **Progresso das Metas**: Exibe metas ativas com barras de progresso
- **Tarefas**: Lista tarefas recentes com indicadores de urgência
- **Notas Recentes**: Últimas notas criadas com etiquetas
- **Diário**: Status de escrita diária e streak atual

### Hábitos
- Criação com nome, descrição e frequência
- Marcação diária simples
- Cálculo automático de streaks
- Progresso baseado nos últimos 7 dias
- Edição e eliminação de hábitos

### Metas
- Tipos: Anual, Trimestral, Mensal
- Valores atual e alvo com unidade personalizada
- Progresso visual com percentagem
- Filtros: Todas, Ativas, Concluídas, por tipo
- Datas limite opcionais

### Tarefas Kanban
- Colunas personalizáveis
- Prioridades com cores distintas
- Prazos com alertas visuais
- Navegação horizontal entre colunas
- Contadores por coluna

### Notas
- 8 cores diferentes para organização
- Sistema de etiquetas flexível
- Pesquisa por título, conteúdo e etiquetas
- Filtros por cor e etiqueta
- Timestamps inteligentes

### Diário
- 10 estados de humor com emojis
- 8 condições meteorológicas
- Sistema de gratidão estruturado
- Pesquisa avançada
- Estatísticas de escrita
- Detecção de entrada do dia

### Configurações
- Gestão de temas
- Acesso à gestão de dados
- Informações da aplicação
- Configurações futuras (notificações, backup)

## 💾 Armazenamento de Dados

A aplicação utiliza AsyncStorage para armazenamento local:
- **Hábitos**: `@metaflow_habits`
- **Metas**: `@metaflow_goals`
- **Tarefas**: `@metaflow_tasks`
- **Notas**: `@metaflow_notes`
- **Diário**: `@metaflow_journal`
- **Tema**: `@metaflow_theme`
- **Preferências**: `@metaflow_preferences`

### Backup e Exportação
- Exportação completa em formato JSON
- Partilha através do sistema nativo
- Importação de dados (em desenvolvimento)
- Limpeza automática de dados antigos

## 🎨 Design e UX

### Paleta de Cores
- **Tema Claro**: Tons suaves com fundo branco
- **Tema Escuro**: Tons azulados escuros confortáveis
- **Cores por Módulo**: Cada secção tem cor identificativa

### Princípios de Design
- Minimalismo e clareza
- Hierarquia visual clara
- Feedback imediato
- Navegação intuitiva
- Consistência em todos os ecrãs

## 📊 Estatísticas e Métricas

A aplicação oferece várias métricas úteis:
- Progresso de hábitos (últimos 7 dias)
- Streaks de hábitos e diário
- Percentagem de conclusão de metas
- Contagem de tarefas por coluna
- Número total de notas e etiquetas
- Frequência de escrita no diário

## 🔮 Funcionalidades Futuras

- Notificações push para lembretes
- Sincronização na nuvem
- Relatórios e análises avançadas
- Partilha de progresso
- Integração com calendário
- Modo offline completo
- Exportação para PDF

## 📝 Notas de Desenvolvimento

### Arquitetura
- Arquitetura modular com separação clara de responsabilidades
- Serviços dedicados para cada módulo de dados
- Contextos React para gestão de estado global
- Componentes reutilizáveis e bem estruturados

### Performance
- Carregamento lazy de dados
- Otimização de re-renders
- Gestão eficiente de memória
- Armazenamento local otimizado

### Manutenibilidade
- Código bem documentado
- Estrutura de pastas organizada
- Convenções de nomenclatura consistentes
- Separação entre lógica e apresentação

## 🐛 Resolução de Problemas

### Problemas Comuns
1. **Aplicação não inicia**: Verifique se todas as dependências estão instaladas
2. **Dados não persistem**: Verifique permissões de armazenamento
3. **Tema não muda**: Limpe o cache da aplicação
4. **Navegação lenta**: Reinicie o servidor de desenvolvimento

### Logs e Debug
- Use `console.log` para debug durante desenvolvimento
- Verifique o console do navegador para erros
- Use React Native Debugger para debug avançado

## 📄 Licença

Este projeto foi desenvolvido como uma aplicação de demonstração. Todos os direitos reservados.

## 👨‍💻 Desenvolvimento

Desenvolvido com React Native e Expo, seguindo as melhores práticas de desenvolvimento móvel e design de interface.

---

**MetaFlow v1.0.0** - Sua jornada de produtividade pessoal começa aqui! 🚀

