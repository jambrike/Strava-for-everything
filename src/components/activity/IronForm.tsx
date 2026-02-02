import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { 
  Play, 
  Pause, 
  Plus, 
  X, 
  Search, 
  Trash2,
  Check,
} from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { 
  EXERCISES, 
  MUSCLE_GROUP_LABELS, 
  searchExercises,
  type Exercise,
  type MuscleGroup 
} from '@/constants/exercises';
import { IronData } from '@/store/activityStore';

interface IronFormProps {
  data: Partial<IronData>;
  onChange: (data: Partial<IronData>) => void;
}

type ExerciseSet = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: string;
  weightUnit: 'lbs' | 'kg';
  reps: number;
  completed: boolean;
};

type SessionExercise = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  sets: ExerciseSet[];
};

export function IronForm({ data, onChange }: IronFormProps) {
  // Session state
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  
  // Exercise picker modal
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customExerciseName, setCustomExerciseName] = useState('');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer logic
  useEffect(() => {
    if (sessionStarted && !isPaused) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionStarted, isPaused]);

  // Update parent data when exercises change
  useEffect(() => {
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 
      0
    );
    
    onChange({
      exercises: exercises.map(ex => ({
        name: ex.exerciseName,
        sets: ex.sets.map(s => ({
          weight: s.weight,
          weightUnit: s.weightUnit,
          reps: s.reps,
          completed: s.completed,
        })),
      })),
      duration: sessionTime,
      totalSets,
      completedSets,
    });
  }, [exercises, sessionTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setSessionStarted(true);
    setIsPaused(false);
    setSessionTime(0);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const addExercise = (exercise: Exercise | { id: string; name: string; muscleGroup: MuscleGroup }) => {
    const newExercise: SessionExercise = {
      id: `${Date.now()}-${Math.random()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup || 'full_body',
      sets: [{
        id: `set-${Date.now()}`,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        weight: '',
        weightUnit: 'lbs',
        reps: 10,
        completed: false,
      }],
    };
    setExercises([...exercises, newExercise]);
    setShowExercisePicker(false);
    setSearchQuery('');
    setCustomExerciseName('');
  };

  const addCustomExercise = () => {
    if (!customExerciseName.trim()) return;
    addExercise({
      id: `custom-${Date.now()}`,
      name: customExerciseName.trim(),
      muscleGroup: 'full_body',
    });
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      return {
        ...ex,
        sets: [...ex.sets, {
          id: `set-${Date.now()}`,
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          weight: lastSet?.weight || '',
          weightUnit: lastSet?.weightUnit || 'lbs',
          reps: lastSet?.reps || 10,
          completed: false,
        }],
      };
    }));
  };

  const updateSet = (exerciseId: string, setId: string, updates: Partial<ExerciseSet>) => {
    setExercises(exercises.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s),
      };
    }));
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    const set = exercise?.sets.find(s => s.id === setId);
    if (set) {
      updateSet(exerciseId, setId, { completed: !set.completed });
    }
  };

  const filteredExercises = searchExercises(searchQuery);

  // Not started yet - show start button
  if (!sessionStarted) {
    return (
      <View style={styles.startContainer}>
        <Text style={styles.startTitle}>Gym Session</Text>
        <Text style={styles.startSubtitle}>
          Start your timer, then add exercises as you go
        </Text>
        
        <Pressable onPress={startSession} style={styles.startButton}>
          <Play size={32} color="#000" fill="#000" />
          <Text style={styles.startButtonText}>Start Session</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Timer Header */}
      <View style={styles.timerHeader}>
        <View style={styles.timerDisplay}>
          <Text style={styles.timerText}>{formatTime(sessionTime)}</Text>
          <Text style={styles.timerLabel}>Session Time</Text>
        </View>
        <Pressable onPress={togglePause} style={styles.pauseButton}>
          {isPaused ? (
            <Play size={24} color="#fff" fill="#fff" />
          ) : (
            <Pause size={24} color="#fff" />
          )}
        </Pressable>
      </View>

      {/* Exercise List */}
      <ScrollView 
        style={styles.exerciseList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View>
                <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                <Text style={styles.exerciseMuscle}>
                  {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
                </Text>
              </View>
              <Pressable 
                onPress={() => removeExercise(exercise.id)}
                style={styles.removeExerciseButton}
              >
                <Trash2 size={18} color={theme.colors.text.muted} />
              </Pressable>
            </View>

            {/* Sets Table Header */}
            <View style={styles.setsHeader}>
              <Text style={[styles.setHeaderText, { flex: 0.5 }]}>Set</Text>
              <Text style={[styles.setHeaderText, { flex: 1.5 }]}>Weight</Text>
              <Text style={[styles.setHeaderText, { flex: 1 }]}>Reps</Text>
              <Text style={[styles.setHeaderText, { flex: 0.5 }]}>✓</Text>
            </View>

            {/* Sets */}
            {exercise.sets.map((set, setIndex) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={[styles.setNumber, { flex: 0.5 }]}>{setIndex + 1}</Text>
                
                <View style={[styles.weightInputContainer, { flex: 1.5 }]}>
                  <TextInput
                    style={styles.setWeightInput}
                    value={set.weight}
                    onChangeText={(text) => updateSet(exercise.id, set.id, { weight: text })}
                    placeholder="0"
                    placeholderTextColor={theme.colors.text.muted}
                    keyboardType="numeric"
                  />
                  <Pressable 
                    onPress={() => updateSet(exercise.id, set.id, { 
                      weightUnit: set.weightUnit === 'lbs' ? 'kg' : 'lbs' 
                    })}
                    style={styles.unitBadge}
                  >
                    <Text style={styles.unitBadgeText}>{set.weightUnit}</Text>
                  </Pressable>
                </View>

                <View style={[styles.repsContainer, { flex: 1 }]}>
                  <Pressable 
                    onPress={() => updateSet(exercise.id, set.id, { reps: Math.max(1, set.reps - 1) })}
                    style={styles.repButton}
                  >
                    <Text style={styles.repButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.repsText}>{set.reps}</Text>
                  <Pressable 
                    onPress={() => updateSet(exercise.id, set.id, { reps: set.reps + 1 })}
                    style={styles.repButton}
                  >
                    <Text style={styles.repButtonText}>+</Text>
                  </Pressable>
                </View>

                <Pressable 
                  onPress={() => toggleSetComplete(exercise.id, set.id)}
                  style={[
                    styles.completeButton,
                    { flex: 0.5 },
                    set.completed && styles.completeButtonActive,
                  ]}
                >
                  {set.completed && <Check size={16} color="#000" />}
                </Pressable>
              </View>
            ))}

            {/* Add Set Button */}
            <Pressable onPress={() => addSet(exercise.id)} style={styles.addSetButton}>
              <Plus size={16} color={theme.colors.text.secondary} />
              <Text style={styles.addSetText}>Add Set</Text>
            </Pressable>
          </View>
        ))}

        {/* Add Exercise Button */}
        <Pressable 
          onPress={() => setShowExercisePicker(true)} 
          style={styles.addExerciseButton}
        >
          <Plus size={24} color="#fff" />
          <Text style={styles.addExerciseText}>Add Exercise</Text>
        </Pressable>
      </ScrollView>

      {/* Exercise Picker Modal */}
      <Modal
        visible={showExercisePicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <Pressable onPress={() => setShowExercisePicker(false)}>
              <X size={24} color={theme.colors.text.primary} />
            </Pressable>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search size={20} color={theme.colors.text.muted} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search exercises..."
              placeholderTextColor={theme.colors.text.muted}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={20} color={theme.colors.text.muted} />
              </Pressable>
            )}
          </View>

          {/* Exercise List */}
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable 
                onPress={() => addExercise(item)}
                style={styles.exerciseListItem}
              >
                <View>
                  <Text style={styles.exerciseListName}>{item.name}</Text>
                  <Text style={styles.exerciseListMeta}>
                    {MUSCLE_GROUP_LABELS[item.muscleGroup]} • {item.equipment}
                  </Text>
                </View>
                <Plus size={20} color={theme.colors.text.muted} />
              </Pressable>
            )}
            ListFooterComponent={() => (
              <View style={styles.customExerciseSection}>
                <Text style={styles.customLabel}>Can't find your exercise?</Text>
                <View style={styles.customInputRow}>
                  <TextInput
                    style={styles.customInput}
                    value={customExerciseName}
                    onChangeText={setCustomExerciseName}
                    placeholder="Enter exercise name..."
                    placeholderTextColor={theme.colors.text.muted}
                  />
                  <Pressable 
                    onPress={addCustomExercise}
                    style={[
                      styles.customAddButton,
                      !customExerciseName.trim() && styles.customAddButtonDisabled,
                    ]}
                    disabled={!customExerciseName.trim()}
                  >
                    <Text style={styles.customAddButtonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Start screen
  startContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  startSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  // Timer header
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  timerDisplay: {
    alignItems: 'flex-start',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pauseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Exercise list
  exerciseList: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  exerciseMuscle: {
    fontSize: 13,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  removeExerciseButton: {
    padding: 8,
  },
  // Sets table
  setsHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
    marginBottom: 8,
  },
  setHeaderText: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  setNumber: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  setWeightInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingVertical: 8,
    textAlign: 'center',
  },
  unitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 4,
  },
  unitBadgeText: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  repsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  repButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repButtonText: {
    fontSize: 18,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  repsText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  completeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  completeButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    gap: 6,
  },
  addSetText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  // Add exercise button
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    borderStyle: 'dashed',
    gap: 8,
  },
  addExerciseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingVertical: 14,
    marginLeft: 12,
  },
  exerciseListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  exerciseListName: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  exerciseListMeta: {
    fontSize: 13,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  // Custom exercise
  customExerciseSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    marginTop: 16,
  },
  customLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 12,
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  customInput: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  customAddButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customAddButtonDisabled: {
    opacity: 0.3,
  },
  customAddButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
