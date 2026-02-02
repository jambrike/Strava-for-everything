import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings -> API
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials not found. Create a .env file with:\n' +
    'EXPO_PUBLIC_SUPABASE_URL=your-project-url\n' +
    'EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types (will be expanded as we add more features)
export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  activity_type: 'iron' | 'path' | 'deep' | 'snap';
  image_url: string;
  caption: string | null;
  activity_data: Record<string, any> | null;
  location_name: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  // Joined data
  profiles?: Profile;
};
