/**
 * Activity Store - Manages current activity state
 * Uses Zustand for state management
 */

import { create } from 'zustand';
import { PillarType } from '@/constants/theme';

// Activity data types
export interface IronSetData {
  weight: string;
  weightUnit: 'lbs' | 'kg';
  reps: number;
  completed: boolean;
}

export interface IronExerciseData {
  name: string;
  sets: IronSetData[];
}

export interface IronData {
  exercises: IronExerciseData[];
  duration: number; // seconds
  totalSets: number;
  completedSets: number;
  // Legacy fields for backwards compatibility
  exercise?: string;
  weight?: string;
  weightUnit?: 'lbs' | 'kg';
  sets?: number;
  reps?: number;
  notes?: string;
}

export interface PathData {
  distance: string;
  distanceUnit: 'mi' | 'km';
  duration: string;
  pace: string;
  elevation: string;
}

export interface DeepData {
  duration: string;
  sessions: number;
  task: string;
  focusScore: number;
}

export interface SnapData {
  mood: 'great' | 'good' | 'okay' | 'meh' | 'rough';
  energy: number;
  note: string;
}

export type ActivityData = IronData | PathData | DeepData | SnapData;

export interface Draft {
  id: string;
  pillar: PillarType;
  data: Partial<ActivityData>;
  photoUri: string | null;
  createdAt: Date;
}

export interface Post {
  id: string;
  pillar: PillarType;
  data: Partial<ActivityData>;
  photoUri: string;
  caption: string;
  createdAt: Date;
}

interface ActivityState {
  // Current activity
  activePillar: PillarType | null;
  activityData: Partial<ActivityData>;
  photoUri: string | null;
  isActivityActive: boolean;
  startTime: Date | null;
  
  // Actions
  startActivity: (pillar: PillarType) => void;
  setActivityData: (data: Partial<ActivityData>) => void;
  setPhotoUri: (uri: string | null) => void;
  endActivity: () => void;
  resetActivity: () => void;
  
  // Draft storage (in-memory for demo)
  drafts: Draft[];
  saveToDraft: () => void;
  deleteDraft: (id: string) => void;
  loadDraft: (draft: Draft) => void;
  
  // Posts storage (in-memory for demo)
  posts: Post[];
  createPost: (caption: string) => void;
}

function getDefaultData(pillar: PillarType): Partial<ActivityData> {
  switch (pillar) {
    case 'iron':
      return { 
        exercises: [],
        duration: 0,
        totalSets: 0,
        completedSets: 0,
      };
    case 'path':
      return { 
        distance: '', 
        distanceUnit: 'mi', 
        duration: '', 
        pace: '', 
        elevation: '' 
      };
    case 'deep':
      return { 
        duration: '', 
        sessions: 1, 
        task: '', 
        focusScore: 3 
      };
    case 'snap':
      return { 
        mood: 'good', 
        energy: 3, 
        note: '' 
      };
    default:
      return {};
  }
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activePillar: null,
  activityData: {},
  photoUri: null,
  isActivityActive: false,
  startTime: null,
  drafts: [],
  posts: [],

  startActivity: (pillar) => set({
    activePillar: pillar,
    activityData: getDefaultData(pillar),
    isActivityActive: true,
    startTime: new Date(),
    photoUri: null,
  }),

  setActivityData: (data) => set((state) => ({
    activityData: { ...state.activityData, ...data } as Partial<ActivityData>,
  })),

  setPhotoUri: (uri) => set({ photoUri: uri }),

  endActivity: () => set({
    isActivityActive: false,
  }),

  resetActivity: () => set({
    activePillar: null,
    activityData: {},
    photoUri: null,
    isActivityActive: false,
    startTime: null,
  }),

  saveToDraft: () => {
    const state = get();
    if (!state.activePillar) return;
    
    const draft: Draft = {
      id: Date.now().toString(),
      pillar: state.activePillar,
      data: state.activityData,
      photoUri: state.photoUri,
      createdAt: new Date(),
    };
    
    set((s) => ({
      drafts: [draft, ...s.drafts],
    }));
    
    get().resetActivity();
  },

  deleteDraft: (id) => set((state) => ({
    drafts: state.drafts.filter((d) => d.id !== id),
  })),

  loadDraft: (draft) => set({
    activePillar: draft.pillar,
    activityData: draft.data,
    photoUri: draft.photoUri,
    isActivityActive: false,
    startTime: null,
  }),

  createPost: (caption) => {
    const state = get();
    if (!state.activePillar || !state.photoUri) return;
    
    const post: Post = {
      id: Date.now().toString(),
      pillar: state.activePillar,
      data: state.activityData,
      photoUri: state.photoUri,
      caption,
      createdAt: new Date(),
    };
    
    set((s) => ({
      posts: [post, ...s.posts],
    }));
    
    get().resetActivity();
  },
}));
