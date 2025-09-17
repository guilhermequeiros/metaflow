// Paleta de cores minimalista para a aplicação MetaFlow
export const Colors = {
  light: {
    // Cores primárias - tons suaves e modernos
    primary: '#6366F1', // Indigo moderno
    secondary: '#10B981', // Verde esmeralda
    accent: '#F59E0B', // Âmbar
    
    // Backgrounds - tons neutros e limpos
    background: '#FFFFFF', // Branco puro
    surface: '#F8FAFC', // Cinza muito claro
    surfaceVariant: '#F1F5F9', // Cinza claro alternativo
    
    // Textos - hierarquia clara
    text: '#0F172A', // Cinza escuro principal
    textSecondary: '#64748B', // Cinza médio
    textTertiary: '#94A3B8', // Cinza claro
    
    // Bordas e divisores
    border: '#E2E8F0', // Cinza muito claro
    outline: '#CBD5E1', // Cinza claro para contornos
    
    // Estados e feedback
    success: '#10B981', // Verde
    warning: '#F59E0B', // Âmbar
    error: '#EF4444', // Vermelho
    info: '#3B82F6', // Azul
    
    // Estados de interação
    disabled: '#94A3B8',
    placeholder: '#CBD5E1',
    
    // Cores específicas para módulos
    habits: '#10B981', // Verde para hábitos
    goals: '#3B82F6', // Azul para metas
    tasks: '#F59E0B', // Âmbar para tarefas
    notes: '#8B5CF6', // Roxo para notas
    journal: '#06B6D4', // Ciano para diário
  },
  
  dark: {
    // Cores primárias - adaptadas para dark mode
    primary: '#818CF8', // Indigo mais claro
    secondary: '#34D399', // Verde mais claro
    accent: '#FBBF24', // Âmbar mais claro
    
    // Backgrounds - tons escuros e confortáveis
    background: '#0F172A', // Azul escuro profundo
    surface: '#1E293B', // Cinza azulado escuro
    surfaceVariant: '#334155', // Cinza azulado médio
    
    // Textos - contraste adequado
    text: '#F8FAFC', // Branco suave
    textSecondary: '#CBD5E1', // Cinza claro
    textTertiary: '#94A3B8', // Cinza médio
    
    // Bordas e divisores
    border: '#334155', // Cinza escuro
    outline: '#475569', // Cinza médio escuro
    
    // Estados e feedback
    success: '#34D399', // Verde claro
    warning: '#FBBF24', // Âmbar claro
    error: '#F87171', // Vermelho claro
    info: '#60A5FA', // Azul claro
    
    // Estados de interação
    disabled: '#64748B',
    placeholder: '#64748B',
    
    // Cores específicas para módulos
    habits: '#34D399', // Verde claro para hábitos
    goals: '#60A5FA', // Azul claro para metas
    tasks: '#FBBF24', // Âmbar claro para tarefas
    notes: '#A78BFA', // Roxo claro para notas
    journal: '#22D3EE', // Ciano claro para diário
  },
};

// Cores adicionais para estados específicos
export const StatusColors = {
  light: {
    priority: {
      low: '#10B981',
      normal: '#3B82F6',
      medium: '#F59E0B',
      high: '#EF4444',
    },
    mood: {
      very_happy: '#10B981',
      happy: '#34D399',
      excited: '#F59E0B',
      calm: '#3B82F6',
      grateful: '#8B5CF6',
      neutral: '#6B7280',
      anxious: '#F59E0B',
      sad: '#F97316',
      angry: '#EF4444',
      very_sad: '#DC2626',
    },
  },
  dark: {
    priority: {
      low: '#34D399',
      normal: '#60A5FA',
      medium: '#FBBF24',
      high: '#F87171',
    },
    mood: {
      very_happy: '#34D399',
      happy: '#6EE7B7',
      excited: '#FBBF24',
      calm: '#60A5FA',
      grateful: '#A78BFA',
      neutral: '#9CA3AF',
      anxious: '#FBBF24',
      sad: '#FB923C',
      angry: '#F87171',
      very_sad: '#EF4444',
    },
  },
};

export default Colors;

