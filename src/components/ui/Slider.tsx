import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/constants/theme';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 5,
  label,
  color = theme.colors.pillars.snap.primary,
}: SliderProps) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.track}>
        {steps.map((step) => (
          <Pressable
            key={step}
            onPress={() => onChange(step)}
            style={[
              styles.step,
              {
                backgroundColor:
                  step <= value ? color : theme.colors.background.surface,
                borderColor:
                  step <= value ? color : theme.colors.border.default,
              },
            ]}
          >
            <Text
              style={[
                styles.stepText,
                { color: step <= value ? theme.colors.text.inverse : theme.colors.text.muted },
              ]}
            >
              {step}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.labels}>
        <Text style={styles.labelText}>Low</Text>
        <Text style={styles.labelText}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    marginBottom: 12,
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  step: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelText: {
    color: theme.colors.text.muted,
    fontSize: 12,
  },
});
