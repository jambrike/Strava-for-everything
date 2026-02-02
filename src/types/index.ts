/**
 * ProofIt - Type Definitions
 */

import { PillarType } from "@/constants/theme";

// User Types
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  stats: {
    streak: number;
    totalProofs: number;
    daysActive: number;
  };
  createdAt: Date;
}

// Post/Proof Types
export interface ProofPost {
  id: string;
  userId: string;
  user: Pick<User, 'username' | 'displayName' | 'avatar'>;
  pillar: PillarType;
  imageUri: string;
  caption: string;
  data: ProofData;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

// Pillar-specific data types
export type ProofData = IronData | PathData | DeepData | SnapData;

export interface IronData {
  type: 'iron';
  exercise: string;
  weight: string;
  sets: number;
  reps: number;
  notes?: string;
}

export interface PathData {
  type: 'path';
  distance: string;
  pace: string;
  duration: string;
  elevation?: string;
  route?: Array<{ lat: number; lng: number }>;
}

export interface DeepData {
  type: 'deep';
  duration: string;
  sessions: number;
  focusScore: number;
  task?: string;
  breaks?: number;
}

export interface SnapData {
  type: 'snap';
  mood: 'great' | 'good' | 'okay' | 'meh' | 'rough';
  energy: number; // 1-5
  note?: string;
  tags?: string[];
}

// Navigation Types
export type RootStackParamList = {
  '(tabs)': undefined;
  'capture/[pillar]': { pillar: PillarType };
  'post/[id]': { id: string };
};

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
}
