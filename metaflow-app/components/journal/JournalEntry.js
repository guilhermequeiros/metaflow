import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip, IconButton, Text } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const JournalEntry = ({ entry, onEdit, onDelete, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Hoje, ${date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Ontem, ${date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-PT', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      very_happy: '😄',
      happy: '😊',
      neutral: '😐',
      sad: '😔',
      very_sad: '😢',
      excited: '🤩',
      calm: '😌',
      anxious: '😰',
      angry: '😠',
      grateful: '🙏',
    };
    return moodMap[mood] || '😐';
  };

  const getMoodLabel = (mood) => {
    const moodLabels = {
      very_happy: 'Muito Feliz',
      happy: 'Feliz',
      neutral: 'Neutro',
      sad: 'Triste',
      very_sad: 'Muito Triste',
      excited: 'Animado',
      calm: 'Calmo',
      anxious: 'Ansioso',
      angry: 'Irritado',
      grateful: 'Grato',
    };
    return moodLabels[mood] || 'Neutro';
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      very_happy: '#4CAF50',
      happy: '#8BC34A',
      neutral: '#9E9E9E',
      sad: '#FF9800',
      very_sad: '#F44336',
      excited: '#E91E63',
      calm: '#2196F3',
      anxious: '#FF5722',
      angry: '#D32F2F',
      grateful: '#9C27B0',
    };
    return moodColors[mood] || '#9E9E9E';
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getWeatherEmoji = (weather) => {
    const weatherMap = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      stormy: '⛈️',
      snowy: '❄️',
      windy: '💨',
      foggy: '🌫️',
    };
    return weatherMap[weather] || '';
  };

  return (
    <TouchableOpacity onPress={() => onPress && onPress(entry)} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={styles.dateContainer}>
              <Title style={styles.date}>{formatDate(entry.date)}</Title>
              <Text style={styles.time}>
                {new Date(entry.date).toLocaleTimeString('pt-PT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
            
            <View style={styles.actions}>
              <IconButton
                icon="pencil"
                size={18}
                onPress={() => onEdit(entry)}
                iconColor={Colors.light.textSecondary}
                style={styles.actionButton}
              />
              <IconButton
                icon="delete"
                size={18}
                onPress={() => onDelete(entry.id)}
                iconColor={Colors.light.error}
                style={styles.actionButton}
              />
            </View>
          </View>

          <View style={styles.moodContainer}>
            <Chip 
              style={[styles.moodChip, { backgroundColor: getMoodColor(entry.mood) + '20' }]}
              textStyle={[styles.moodText, { color: getMoodColor(entry.mood) }]}
              compact
            >
              {getMoodEmoji(entry.mood)} {getMoodLabel(entry.mood)}
            </Chip>
            
            {entry.weather && (
              <Chip 
                style={styles.weatherChip}
                textStyle={styles.weatherText}
                compact
              >
                {getWeatherEmoji(entry.weather)} {entry.weather}
              </Chip>
            )}
          </View>

          {entry.title && (
            <Title style={styles.title} numberOfLines={2}>
              {entry.title}
            </Title>
          )}
          
          <Paragraph style={styles.contentText} numberOfLines={6}>
            {truncateContent(entry.content)}
          </Paragraph>

          {entry.tags && entry.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {entry.tags.slice(0, 3).map((tag, index) => (
                <Chip 
                  key={index}
                  style={styles.tagChip}
                  textStyle={styles.tagText}
                  compact
                >
                  {tag}
                </Chip>
              ))}
              {entry.tags.length > 3 && (
                <Text style={styles.moreTagsText}>
                  +{entry.tags.length - 3} mais
                </Text>
              )}
            </View>
          )}

          {entry.gratitude && entry.gratitude.length > 0 && (
            <View style={styles.gratitudeContainer}>
              <Text style={styles.gratitudeLabel}>Gratidão:</Text>
              <Text style={styles.gratitudeText} numberOfLines={2}>
                {entry.gratitude.join(', ')}
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.wordCount}>
              {entry.content.split(' ').length} palavras
            </Text>
            
            {entry.updatedAt && entry.updatedAt !== entry.date && (
              <Text style={styles.editedText}>
                Editado
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    marginHorizontal: 4,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: 'white',
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
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    margin: 0,
    padding: 0,
    width: 28,
    height: 28,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  moodChip: {
    height: 28,
  },
  moodText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  weatherChip: {
    backgroundColor: '#E3F2FD',
    height: 28,
  },
  weatherText: {
    color: '#1976D2',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  contentText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  tagChip: {
    backgroundColor: '#F5F5F5',
    height: 24,
  },
  tagText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  moreTagsText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  gratitudeContainer: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  gratitudeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  gratitudeText: {
    fontSize: 12,
    color: '#BF360C',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  wordCount: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  editedText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
});

export default JournalEntry;

