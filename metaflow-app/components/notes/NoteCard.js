import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip, IconButton } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const NoteCard = ({ note, onEdit, onDelete, onPress }) => {
  const getColorStyle = (color) => {
    const colorMap = {
      yellow: '#FFF9C4',
      blue: '#E3F2FD',
      green: '#E8F5E8',
      pink: '#FCE4EC',
      purple: '#F3E5F5',
      orange: '#FFF3E0',
      red: '#FFEBEE',
      gray: '#F5F5F5',
    };
    
    return {
      backgroundColor: colorMap[color] || colorMap.yellow,
      borderLeftColor: getColorAccent(color),
    };
  };

  const getColorAccent = (color) => {
    const accentMap = {
      yellow: '#FFC107',
      blue: '#2196F3',
      green: '#4CAF50',
      pink: '#E91E63',
      purple: '#9C27B0',
      orange: '#FF9800',
      red: '#F44336',
      gray: '#9E9E9E',
    };
    
    return accentMap[color] || accentMap.yellow;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity onPress={() => onPress && onPress(note)} activeOpacity={0.7}>
      <Card style={[styles.card, getColorStyle(note.color)]}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.title} numberOfLines={2}>
              {note.title}
            </Title>
            <View style={styles.actions}>
              <IconButton
                icon="pencil"
                size={16}
                onPress={() => onEdit(note)}
                iconColor={Colors.light.textSecondary}
                style={styles.actionButton}
              />
              <IconButton
                icon="delete"
                size={16}
                onPress={() => onDelete(note.id)}
                iconColor={Colors.light.error}
                style={styles.actionButton}
              />
            </View>
          </View>
          
          <Paragraph style={styles.content_text} numberOfLines={6}>
            {truncateContent(note.content)}
          </Paragraph>
          
          <View style={styles.footer}>
            <View style={styles.tags}>
              {note.tags && note.tags.map((tag, index) => (
                <Chip 
                  key={index}
                  style={[styles.tagChip, { backgroundColor: getColorAccent(note.color) + '20' }]}
                  textStyle={[styles.tagText, { color: getColorAccent(note.color) }]}
                  compact
                >
                  {tag}
                </Chip>
              ))}
            </View>
            
            <View style={styles.metadata}>
              <Paragraph style={styles.date}>
                {formatDate(note.updatedAt || note.createdAt)}
              </Paragraph>
              {note.isPinned && (
                <Chip 
                  style={styles.pinnedChip}
                  textStyle={styles.pinnedText}
                  compact
                  icon="pin"
                >
                  Fixada
                </Chip>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 4,
    elevation: 2,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    color: Colors.light.text,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    margin: 0,
    padding: 0,
    width: 24,
    height: 24,
  },
  content_text: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    marginTop: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagChip: {
    height: 24,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  pinnedChip: {
    backgroundColor: Colors.light.accent + '20',
    height: 24,
  },
  pinnedText: {
    color: Colors.light.accent,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NoteCard;

