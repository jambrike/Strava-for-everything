import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

type Mood = 'great' | 'good' | 'okay' | 'meh' | 'rough';

interface MoodPickerProps {
  value: Mood;
  onChange: (mood: Mood) => void;
}

const MOODS: { key: Mood; emoji: string; label: string; color: string }[] = [
  { key: 'great', emoji: '🔥', label: 'Great', color: '#00D26A' },
  { key: 'good', emoji: '😊', label: 'Good', color: '#4ECDC4' },
  { key: 'okay', emoji: '😐', label: 'Okay', color: '#F7DC6F' },
  { key: 'meh', emoji: '😕', label: 'Meh', color: '#FF8C5A' },
  { key: 'rough', emoji: '😞', label: 'Rough', color: '#FF4757' },
];

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How are you feeling?</Text>
      <View style={styles.moodRow}>
        {MOODS.map((mood) => (
          <Pressable
            key={mood.key}
            onPress={() => onChange(mood.key)}
            style={[
              styles.moodButton,
              value === mood.key && {
                backgroundColor: `${mood.color}20`,
                borderColor: mood.color,
              },
            ]}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text
              style={[
                styles.moodLabel,
                value === mood.key && { color: mood.color },
              ]}
            >
              {mood.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.surface,
    minWidth: 60,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    color: theme.colors.text.muted,
    fontSize: 10,
    textTransform: 'uppercase',
  },
});
