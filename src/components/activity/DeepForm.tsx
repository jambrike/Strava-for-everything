import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { Clock, Target, Zap, Play, Pause, RefreshCw } from 'lucide-react-native';
import { theme, PILLARS } from '@/constants/theme';
import { Counter } from '@/components/ui/Counter';
import { Slider } from '@/components/ui/Slider';
import { DeepData } from '@/store/activityStore';

interface DeepFormProps {
  data: Partial<DeepData>;
  onChange: (data: Partial<DeepData>) => void;
}

export function DeepForm({ data, onChange }: DeepFormProps) {
  const pillarColor = PILLARS.deep.color;

  // Focus timer (pomodoro style)
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setRunning(true);
    setIsPaused(false);
    setSeconds(0);
  };

  const togglePause = () => setIsPaused((prev) => !prev);

  const resetTimer = () => {
    setRunning(false);
    setIsPaused(false);
    setSeconds(0);
    onChange({ duration: '0h 00m' });
  };

  useEffect(() => {
    if (running && !isPaused) {
      timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, isPaused]);

  // Push formatted duration
  useEffect(() => {
    if (running) {
      const mins = Math.floor(seconds / 60);
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      onChange({ duration: `${hrs}h ${remMins.toString().padStart(2, '0')}m` });
    }
  }, [seconds]);

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Focus Timer */}
      <View style={styles.timerCard}>
        <Text style={styles.sectionLabel}>Focus Timer</Text>
        <View style={styles.timerRow}>
          <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
          <View style={styles.timerActions}>
            {running ? (
              <Pressable onPress={togglePause} style={styles.timerButton}>
                {isPaused ? <Play size={18} color="#000" fill="#000" /> : <Pause size={18} color="#000" />}
              </Pressable>
            ) : (
              <Pressable onPress={startTimer} style={styles.timerButton}>
                <Play size={18} color="#000" fill="#000" />
              </Pressable>
            )}
            <Pressable onPress={resetTimer} style={styles.timerButtonSecondary}>
              <RefreshCw size={16} color={theme.colors.text.primary} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.timerHint}>Use timer to track actual deep work time</Text>
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
          placeholder="0h 00m"
          placeholderTextColor={theme.colors.text.muted}
        />
      </View>

      {/* Sessions */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Target size={16} color={pillarColor} />
          <Text style={styles.sectionLabel}>Sessions Completed</Text>
        </View>
        <View style={styles.counterContainer}>
          <Counter
            value={data.sessions || 1}
            onChange={(val) => onChange({ sessions: val })}
            min={1}
            max={12}
            color={pillarColor}
          />
        </View>
      </View>

      {/* Focus Score */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Zap size={16} color={pillarColor} />
          <Text style={styles.sectionLabel}>Focus Score</Text>
        </View>
        <Slider
          value={data.focusScore || 3}
          onChange={(val) => onChange({ focusScore: val })}
          min={1}
          max={5}
          color={pillarColor}
        />
      </View>

      {/* Task */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>What did you work on?</Text>
        <TextInput
          style={styles.taskInput}
          value={data.task}
          onChangeText={(text) => onChange({ task: text })}
          placeholder="e.g., Built the auth flow..."
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
  input: {
    height: 64,
    backgroundColor: theme.colors.background.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    color: theme.colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  counterContainer: {
    alignItems: 'center',
  },
  taskInput: {
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
  timerCard: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    padding: 16,
    marginBottom: 24,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  timerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  timerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerButtonSecondary: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerHint: {
    color: theme.colors.text.muted,
    fontSize: 12,
  },
});
