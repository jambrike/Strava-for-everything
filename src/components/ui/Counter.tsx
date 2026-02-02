import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
}

export function Counter({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  color = theme.colors.text.primary,
}: CounterProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.counterRow}>
        <Pressable
          onPress={decrement}
          style={[styles.button, value <= min && styles.buttonDisabled]}
          disabled={value <= min}
        >
          <Minus size={20} color={value <= min ? theme.colors.text.muted : color} />
        </Pressable>
        
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color }]}>{value}</Text>
        </View>
        
        <Pressable
          onPress={increment}
          style={[styles.button, value >= max && styles.buttonDisabled]}
          disabled={value >= max}
        >
          <Plus size={20} color={value >= max ? theme.colors.text.muted : color} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  valueContainer: {
    minWidth: 60,
    alignItems: 'center',
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
  },
});
