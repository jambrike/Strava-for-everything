import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { MapPin, Clock, TrendingUp, Mountain, Play, Pause } from 'lucide-react-native';
import { theme, PILLARS } from '@/constants/theme';
import { PathData } from '@/store/activityStore';

interface PathFormProps {
  data: Partial<PathData>;
  onChange: (data: Partial<PathData>) => void;
}

export function PathForm({ data, onChange }: PathFormProps) {
  const pillarColor = PILLARS.path.color;

  // Simple run timer (start/pause)
  const [started, setStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start the timer
  const startTimer = () => {
    setStarted(true);
    setIsPaused(false);
    setSeconds(0);
  };

  // Pause/resume
  const togglePause = () => setIsPaused((prev) => !prev);

  // Format HH:MM:SS
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const hh = h > 0 ? `${h}:` : '';
    const mm = h > 0 ? m.toString().padStart(2, '0') : m.toString();
    const ss = sec.toString().padStart(2, '0');
    return `${hh}${mm}:${ss}`;
  };

  // Tick timer when running
  useEffect(() => {
    if (started && !isPaused) {
      timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, isPaused]);

  // Push formatted duration up to parent
  useEffect(() => {
    if (started) {
      onChange({ duration: formatTime(seconds) });
    }
  }, [seconds]);

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Timer */}
      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>Run Timer</Text>
        <View style={styles.timerRow}>
          <Text style={styles.timerValue}>{started ? formatTime(seconds) : '00:00'}</Text>
          {started ? (
            <Pressable onPress={togglePause} style={styles.timerButton}>
              {isPaused ? <Play size={20} color="#000" fill="#000" /> : <Pause size={20} color="#000" />}
            </Pressable>
          ) : (
            <Pressable onPress={startTimer} style={styles.timerButton}>
              <Play size={20} color="#000" fill="#000" />
            </Pressable>
          )}
        </View>
        <Text style={styles.timerHint}>Start timer before logging distance</Text>
      </View>

      {/* Distance */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <MapPin size={16} color={pillarColor} />
          <Text style={styles.sectionLabel}>Distance</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.mainInput}
            value={data.distance}
            onChangeText={(text) => onChange({ distance: text })}
            placeholder="0.00"
            placeholderTextColor={theme.colors.text.muted}
            keyboardType="decimal-pad"
          />
          <View style={styles.unitToggle}>
            <Pressable
              onPress={() => onChange({ distanceUnit: 'mi' })}
              style={[
                styles.unitButton,
                data.distanceUnit === 'mi' && styles.unitButtonActive,
              ]}
            >
              <Text style={[
                styles.unitText,
                data.distanceUnit === 'mi' && { color: pillarColor },
              ]}>mi</Text>
            </Pressable>
            <Pressable
              onPress={() => onChange({ distanceUnit: 'km' })}
              style={[
                styles.unitButton,
                data.distanceUnit === 'km' && styles.unitButtonActive,
              ]}
            >
              <Text style={[
                styles.unitText,
                data.distanceUnit === 'km' && { color: pillarColor },
              ]}>km</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Duration */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Clock size={16} color={pillarColor} />
          <Text style={styles.sectionLabel}>Duration</Text>
        </View>
        <TextInput
          style={styles.input}
          value={data.duration}
          onChangeText={(text) => onChange({ duration: text })}
          placeholder="00:00:00"
          placeholderTextColor={theme.colors.text.muted}
        />
      </View>

      {/* Pace */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <TrendingUp size={16} color={pillarColor} />
          <Text style={styles.sectionLabel}>Pace</Text>
        </View>
        <TextInput
          style={styles.input}
          value={data.pace}
          onChangeText={(text) => onChange({ pace: text })}
          placeholder="0:00 /mi"
          placeholderTextColor={theme.colors.text.muted}
        />
      </View>

      {/* Elevation */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Mountain size={16} color={pillarColor} />
          <Text style={styles.sectionLabel}>Elevation Gain (optional)</Text>
        </View>
        <TextInput
          style={styles.input}
          value={data.elevation}
          onChangeText={(text) => onChange({ elevation: text })}
          placeholder="0 ft"
          placeholderTextColor={theme.colors.text.muted}
          keyboardType="numeric"
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
  timerCard: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    padding: 16,
    marginBottom: 24,
  },
  timerLabel: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  timerButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerHint: {
    color: theme.colors.text.muted,
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionLabel: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mainInput: {
    flex: 1,
    height: 64,
    backgroundColor: theme.colors.background.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    color: theme.colors.text.primary,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    height: 56,
    backgroundColor: theme.colors.background.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    color: theme.colors.text.primary,
    fontSize: 18,
    paddingHorizontal: 16,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  unitButtonActive: {
    backgroundColor: theme.colors.background.elevated,
  },
  unitText: {
    color: theme.colors.text.muted,
    fontSize: 16,
    fontWeight: '600',
  },
});
