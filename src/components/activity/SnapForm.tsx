import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { theme, PILLARS } from '@/constants/theme';
import { MoodPicker } from '@/components/ui/MoodPicker';
import { Slider } from '@/components/ui/Slider';
import { SnapData } from '@/store/activityStore';

interface SnapFormProps {
  data: Partial<SnapData>;
  onChange: (data: Partial<SnapData>) => void;
}

export function SnapForm({ data, onChange }: SnapFormProps) {
  const pillarColor = PILLARS.snap.color;

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Mood Picker */}
      <MoodPicker
        value={data.mood || 'good'}
        onChange={(mood) => onChange({ mood })}
      />

      {/* Energy Level */}
      <Slider
        value={data.energy || 3}
        onChange={(val) => onChange({ energy: val })}
        min={1}
        max={5}
        label="Energy Level"
        color={pillarColor}
      />

      {/* Quick Note */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Quick Note (optional)</Text>
        <TextInput
          style={styles.noteInput}
          value={data.note}
          onChangeText={(text) => onChange({ note: text })}
          placeholder="What's on your mind today?"
          placeholderTextColor={theme.colors.text.muted}
          multiline
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginTop: 8,
  },
  sectionLabel: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  noteInput: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    color: theme.colors.text.primary,
    fontSize: 16,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
