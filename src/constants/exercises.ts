/**
 * Exercise Database
 * Comprehensive list of exercises organized by muscle group
 */

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'full_body'
  | 'cardio';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment?: string;
};

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  core: 'Core',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  full_body: 'Full Body',
  cardio: 'Cardio',
};

export const EXERCISES: Exercise[] = [
  // CHEST
  { id: 'bench_press', name: 'Bench Press', muscleGroup: 'chest', equipment: 'Barbell' },
  { id: 'incline_bench_press', name: 'Incline Bench Press', muscleGroup: 'chest', equipment: 'Barbell' },
  { id: 'decline_bench_press', name: 'Decline Bench Press', muscleGroup: 'chest', equipment: 'Barbell' },
  { id: 'dumbbell_bench_press', name: 'Dumbbell Bench Press', muscleGroup: 'chest', equipment: 'Dumbbells' },
  { id: 'incline_dumbbell_press', name: 'Incline Dumbbell Press', muscleGroup: 'chest', equipment: 'Dumbbells' },
  { id: 'dumbbell_flyes', name: 'Dumbbell Flyes', muscleGroup: 'chest', equipment: 'Dumbbells' },
  { id: 'cable_flyes', name: 'Cable Flyes', muscleGroup: 'chest', equipment: 'Cable' },
  { id: 'pec_deck', name: 'Pec Deck', muscleGroup: 'chest', equipment: 'Machine' },
  { id: 'push_ups', name: 'Push Ups', muscleGroup: 'chest', equipment: 'Bodyweight' },
  { id: 'diamond_push_ups', name: 'Diamond Push Ups', muscleGroup: 'chest', equipment: 'Bodyweight' },
  { id: 'chest_dips', name: 'Chest Dips', muscleGroup: 'chest', equipment: 'Bodyweight' },
  { id: 'machine_chest_press', name: 'Machine Chest Press', muscleGroup: 'chest', equipment: 'Machine' },
  { id: 'smith_machine_bench', name: 'Smith Machine Bench Press', muscleGroup: 'chest', equipment: 'Smith Machine' },
  
  // BACK
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back', equipment: 'Barbell' },
  { id: 'pull_ups', name: 'Pull Ups', muscleGroup: 'back', equipment: 'Bodyweight' },
  { id: 'chin_ups', name: 'Chin Ups', muscleGroup: 'back', equipment: 'Bodyweight' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'Cable' },
  { id: 'barbell_row', name: 'Barbell Row', muscleGroup: 'back', equipment: 'Barbell' },
  { id: 'dumbbell_row', name: 'Dumbbell Row', muscleGroup: 'back', equipment: 'Dumbbells' },
  { id: 'seated_cable_row', name: 'Seated Cable Row', muscleGroup: 'back', equipment: 'Cable' },
  { id: 't_bar_row', name: 'T-Bar Row', muscleGroup: 'back', equipment: 'Barbell' },
  { id: 'face_pulls', name: 'Face Pulls', muscleGroup: 'back', equipment: 'Cable' },
  { id: 'straight_arm_pulldown', name: 'Straight Arm Pulldown', muscleGroup: 'back', equipment: 'Cable' },
  { id: 'rack_pulls', name: 'Rack Pulls', muscleGroup: 'back', equipment: 'Barbell' },
  { id: 'machine_row', name: 'Machine Row', muscleGroup: 'back', equipment: 'Machine' },
  { id: 'inverted_row', name: 'Inverted Row', muscleGroup: 'back', equipment: 'Bodyweight' },
  { id: 'back_extension', name: 'Back Extension', muscleGroup: 'back', equipment: 'Machine' },
  
  // SHOULDERS
  { id: 'overhead_press', name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'Barbell' },
  { id: 'dumbbell_shoulder_press', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', equipment: 'Dumbbells' },
  { id: 'arnold_press', name: 'Arnold Press', muscleGroup: 'shoulders', equipment: 'Dumbbells' },
  { id: 'lateral_raises', name: 'Lateral Raises', muscleGroup: 'shoulders', equipment: 'Dumbbells' },
  { id: 'front_raises', name: 'Front Raises', muscleGroup: 'shoulders', equipment: 'Dumbbells' },
  { id: 'rear_delt_flyes', name: 'Rear Delt Flyes', muscleGroup: 'shoulders', equipment: 'Dumbbells' },
  { id: 'cable_lateral_raises', name: 'Cable Lateral Raises', muscleGroup: 'shoulders', equipment: 'Cable' },
  { id: 'upright_rows', name: 'Upright Rows', muscleGroup: 'shoulders', equipment: 'Barbell' },
  { id: 'shrugs', name: 'Shrugs', muscleGroup: 'shoulders', equipment: 'Dumbbells' },
  { id: 'barbell_shrugs', name: 'Barbell Shrugs', muscleGroup: 'shoulders', equipment: 'Barbell' },
  { id: 'machine_shoulder_press', name: 'Machine Shoulder Press', muscleGroup: 'shoulders', equipment: 'Machine' },
  { id: 'pike_push_ups', name: 'Pike Push Ups', muscleGroup: 'shoulders', equipment: 'Bodyweight' },
  
  // BICEPS
  { id: 'barbell_curl', name: 'Barbell Curl', muscleGroup: 'biceps', equipment: 'Barbell' },
  { id: 'dumbbell_curl', name: 'Dumbbell Curl', muscleGroup: 'biceps', equipment: 'Dumbbells' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscleGroup: 'biceps', equipment: 'Dumbbells' },
  { id: 'preacher_curl', name: 'Preacher Curl', muscleGroup: 'biceps', equipment: 'Barbell' },
  { id: 'incline_dumbbell_curl', name: 'Incline Dumbbell Curl', muscleGroup: 'biceps', equipment: 'Dumbbells' },
  { id: 'cable_curl', name: 'Cable Curl', muscleGroup: 'biceps', equipment: 'Cable' },
  { id: 'concentration_curl', name: 'Concentration Curl', muscleGroup: 'biceps', equipment: 'Dumbbells' },
  { id: 'ez_bar_curl', name: 'EZ Bar Curl', muscleGroup: 'biceps', equipment: 'EZ Bar' },
  { id: 'spider_curl', name: 'Spider Curl', muscleGroup: 'biceps', equipment: 'Dumbbells' },
  { id: 'machine_curl', name: 'Machine Curl', muscleGroup: 'biceps', equipment: 'Machine' },
  
  // TRICEPS
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscleGroup: 'triceps', equipment: 'Cable' },
  { id: 'skull_crushers', name: 'Skull Crushers', muscleGroup: 'triceps', equipment: 'Barbell' },
  { id: 'overhead_tricep_extension', name: 'Overhead Tricep Extension', muscleGroup: 'triceps', equipment: 'Dumbbells' },
  { id: 'dips', name: 'Dips', muscleGroup: 'triceps', equipment: 'Bodyweight' },
  { id: 'close_grip_bench', name: 'Close Grip Bench Press', muscleGroup: 'triceps', equipment: 'Barbell' },
  { id: 'tricep_kickbacks', name: 'Tricep Kickbacks', muscleGroup: 'triceps', equipment: 'Dumbbells' },
  { id: 'rope_pushdown', name: 'Rope Pushdown', muscleGroup: 'triceps', equipment: 'Cable' },
  { id: 'diamond_push_ups_tri', name: 'Diamond Push Ups', muscleGroup: 'triceps', equipment: 'Bodyweight' },
  { id: 'bench_dips', name: 'Bench Dips', muscleGroup: 'triceps', equipment: 'Bodyweight' },
  { id: 'machine_tricep_extension', name: 'Machine Tricep Extension', muscleGroup: 'triceps', equipment: 'Machine' },
  
  // FOREARMS
  { id: 'wrist_curls', name: 'Wrist Curls', muscleGroup: 'forearms', equipment: 'Barbell' },
  { id: 'reverse_wrist_curls', name: 'Reverse Wrist Curls', muscleGroup: 'forearms', equipment: 'Barbell' },
  { id: 'farmers_walk', name: "Farmer's Walk", muscleGroup: 'forearms', equipment: 'Dumbbells' },
  { id: 'plate_pinch', name: 'Plate Pinch', muscleGroup: 'forearms', equipment: 'Plates' },
  { id: 'reverse_curl', name: 'Reverse Curl', muscleGroup: 'forearms', equipment: 'Barbell' },
  
  // CORE
  { id: 'plank', name: 'Plank', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'crunches', name: 'Crunches', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'sit_ups', name: 'Sit Ups', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'leg_raises', name: 'Leg Raises', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'hanging_leg_raises', name: 'Hanging Leg Raises', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'russian_twists', name: 'Russian Twists', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'cable_crunches', name: 'Cable Crunches', muscleGroup: 'core', equipment: 'Cable' },
  { id: 'ab_wheel', name: 'Ab Wheel Rollout', muscleGroup: 'core', equipment: 'Ab Wheel' },
  { id: 'mountain_climbers', name: 'Mountain Climbers', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'dead_bug', name: 'Dead Bug', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'bicycle_crunches', name: 'Bicycle Crunches', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'side_plank', name: 'Side Plank', muscleGroup: 'core', equipment: 'Bodyweight' },
  { id: 'woodchoppers', name: 'Woodchoppers', muscleGroup: 'core', equipment: 'Cable' },
  
  // QUADS
  { id: 'squat', name: 'Squat', muscleGroup: 'quads', equipment: 'Barbell' },
  { id: 'front_squat', name: 'Front Squat', muscleGroup: 'quads', equipment: 'Barbell' },
  { id: 'leg_press', name: 'Leg Press', muscleGroup: 'quads', equipment: 'Machine' },
  { id: 'leg_extension', name: 'Leg Extension', muscleGroup: 'quads', equipment: 'Machine' },
  { id: 'lunges', name: 'Lunges', muscleGroup: 'quads', equipment: 'Bodyweight' },
  { id: 'walking_lunges', name: 'Walking Lunges', muscleGroup: 'quads', equipment: 'Bodyweight' },
  { id: 'dumbbell_lunges', name: 'Dumbbell Lunges', muscleGroup: 'quads', equipment: 'Dumbbells' },
  { id: 'goblet_squat', name: 'Goblet Squat', muscleGroup: 'quads', equipment: 'Dumbbells' },
  { id: 'hack_squat', name: 'Hack Squat', muscleGroup: 'quads', equipment: 'Machine' },
  { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', muscleGroup: 'quads', equipment: 'Dumbbells' },
  { id: 'sissy_squat', name: 'Sissy Squat', muscleGroup: 'quads', equipment: 'Bodyweight' },
  { id: 'step_ups', name: 'Step Ups', muscleGroup: 'quads', equipment: 'Bodyweight' },
  { id: 'smith_machine_squat', name: 'Smith Machine Squat', muscleGroup: 'quads', equipment: 'Smith Machine' },
  
  // HAMSTRINGS
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscleGroup: 'hamstrings', equipment: 'Barbell' },
  { id: 'stiff_leg_deadlift', name: 'Stiff Leg Deadlift', muscleGroup: 'hamstrings', equipment: 'Barbell' },
  { id: 'leg_curl', name: 'Leg Curl', muscleGroup: 'hamstrings', equipment: 'Machine' },
  { id: 'seated_leg_curl', name: 'Seated Leg Curl', muscleGroup: 'hamstrings', equipment: 'Machine' },
  { id: 'good_mornings', name: 'Good Mornings', muscleGroup: 'hamstrings', equipment: 'Barbell' },
  { id: 'nordic_curl', name: 'Nordic Curl', muscleGroup: 'hamstrings', equipment: 'Bodyweight' },
  { id: 'dumbbell_rdl', name: 'Dumbbell RDL', muscleGroup: 'hamstrings', equipment: 'Dumbbells' },
  { id: 'single_leg_rdl', name: 'Single Leg RDL', muscleGroup: 'hamstrings', equipment: 'Dumbbells' },
  
  // GLUTES
  { id: 'hip_thrust', name: 'Hip Thrust', muscleGroup: 'glutes', equipment: 'Barbell' },
  { id: 'glute_bridge', name: 'Glute Bridge', muscleGroup: 'glutes', equipment: 'Bodyweight' },
  { id: 'cable_kickbacks', name: 'Cable Kickbacks', muscleGroup: 'glutes', equipment: 'Cable' },
  { id: 'donkey_kicks', name: 'Donkey Kicks', muscleGroup: 'glutes', equipment: 'Bodyweight' },
  { id: 'fire_hydrants', name: 'Fire Hydrants', muscleGroup: 'glutes', equipment: 'Bodyweight' },
  { id: 'sumo_deadlift', name: 'Sumo Deadlift', muscleGroup: 'glutes', equipment: 'Barbell' },
  { id: 'hip_abduction', name: 'Hip Abduction Machine', muscleGroup: 'glutes', equipment: 'Machine' },
  { id: 'banded_walks', name: 'Banded Walks', muscleGroup: 'glutes', equipment: 'Resistance Band' },
  
  // CALVES
  { id: 'standing_calf_raise', name: 'Standing Calf Raise', muscleGroup: 'calves', equipment: 'Machine' },
  { id: 'seated_calf_raise', name: 'Seated Calf Raise', muscleGroup: 'calves', equipment: 'Machine' },
  { id: 'dumbbell_calf_raise', name: 'Dumbbell Calf Raise', muscleGroup: 'calves', equipment: 'Dumbbells' },
  { id: 'leg_press_calf_raise', name: 'Leg Press Calf Raise', muscleGroup: 'calves', equipment: 'Machine' },
  { id: 'single_leg_calf_raise', name: 'Single Leg Calf Raise', muscleGroup: 'calves', equipment: 'Bodyweight' },
  
  // FULL BODY
  { id: 'clean_and_press', name: 'Clean and Press', muscleGroup: 'full_body', equipment: 'Barbell' },
  { id: 'thrusters', name: 'Thrusters', muscleGroup: 'full_body', equipment: 'Barbell' },
  { id: 'burpees', name: 'Burpees', muscleGroup: 'full_body', equipment: 'Bodyweight' },
  { id: 'kettlebell_swings', name: 'Kettlebell Swings', muscleGroup: 'full_body', equipment: 'Kettlebell' },
  { id: 'turkish_getup', name: 'Turkish Get Up', muscleGroup: 'full_body', equipment: 'Kettlebell' },
  { id: 'man_makers', name: 'Man Makers', muscleGroup: 'full_body', equipment: 'Dumbbells' },
  { id: 'battle_ropes', name: 'Battle Ropes', muscleGroup: 'full_body', equipment: 'Battle Ropes' },
  { id: 'box_jumps', name: 'Box Jumps', muscleGroup: 'full_body', equipment: 'Box' },
  { id: 'sled_push', name: 'Sled Push', muscleGroup: 'full_body', equipment: 'Sled' },
  
  // CARDIO
  { id: 'treadmill', name: 'Treadmill', muscleGroup: 'cardio', equipment: 'Machine' },
  { id: 'elliptical', name: 'Elliptical', muscleGroup: 'cardio', equipment: 'Machine' },
  { id: 'stationary_bike', name: 'Stationary Bike', muscleGroup: 'cardio', equipment: 'Machine' },
  { id: 'rowing_machine', name: 'Rowing Machine', muscleGroup: 'cardio', equipment: 'Machine' },
  { id: 'stair_climber', name: 'Stair Climber', muscleGroup: 'cardio', equipment: 'Machine' },
  { id: 'jump_rope', name: 'Jump Rope', muscleGroup: 'cardio', equipment: 'Jump Rope' },
  { id: 'swimming', name: 'Swimming', muscleGroup: 'cardio', equipment: 'Pool' },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'cardio', equipment: 'Bike' },
  { id: 'sprints', name: 'Sprints', muscleGroup: 'cardio', equipment: 'None' },
];

// Search exercises by name
export function searchExercises(query: string): Exercise[] {
  if (!query.trim()) return EXERCISES;
  
  const lowerQuery = query.toLowerCase();
  return EXERCISES.filter(
    exercise => 
      exercise.name.toLowerCase().includes(lowerQuery) ||
      exercise.muscleGroup.toLowerCase().includes(lowerQuery) ||
      (exercise.equipment?.toLowerCase().includes(lowerQuery))
  );
}

// Get exercises by muscle group
export function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
  return EXERCISES.filter(ex => ex.muscleGroup === muscleGroup);
}

// Get all muscle groups with their exercises
export function getGroupedExercises(): Record<MuscleGroup, Exercise[]> {
  return EXERCISES.reduce((acc, exercise) => {
    if (!acc[exercise.muscleGroup]) {
      acc[exercise.muscleGroup] = [];
    }
    acc[exercise.muscleGroup].push(exercise);
    return acc;
  }, {} as Record<MuscleGroup, Exercise[]>);
}
