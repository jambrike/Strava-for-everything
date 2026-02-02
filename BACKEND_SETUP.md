# Backend & Auth Setup Guide

This guide walks through setting up Supabase as the backend for ProofIt, including authentication, database schema, and image storage.

---

## Table of Contents

1. [Supabase Project Setup](#1-supabase-project-setup)
2. [Authentication Setup](#2-authentication-setup)
3. [Database Schema](#3-database-schema)
4. [Image Storage](#4-image-storage)
5. [React Native Integration](#5-react-native-integration)
6. [Environment Variables](#6-environment-variables)

---

## 1. Supabase Project Setup

### Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub (recommended) or email
3. Create a new organization (or use personal)

### Create a New Project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `proofit` (or your preferred name)
   - **Database Password:** Generate a strong password and **save it somewhere safe**
   - **Region:** Choose closest to your users (e.g., `us-east-1` for US)
3. Click **"Create new project"**
4. Wait 2-3 minutes for provisioning

### Get Your API Keys

Once the project is ready, go to **Settings → API** and note down:

- **Project URL:** `https://xxxxxxxxxxxx.supabase.co`
- **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role key:** (Keep this secret - only for server-side use)

---

## 2. Authentication Setup

### Enable Auth Providers

Go to **Authentication → Providers** in your Supabase dashboard.

#### Email/Password (Required)

1. Email provider is enabled by default
2. Configure settings:
   - **Enable email confirmations:** ON (recommended for production)
   - **Enable email change confirmations:** ON
   - **Secure password change:** ON

#### Apple Sign In (Required for App Store)

1. Toggle **Apple** provider ON
2. You'll need:
   - Apple Developer Account ($99/year)
   - Services ID from Apple Developer Portal
   - Secret Key (.p8 file)

**Apple Developer Setup:**

```
1. Go to developer.apple.com → Certificates, Identifiers & Profiles
2. Create a new Services ID:
   - Description: "ProofIt Sign In"
   - Identifier: com.yourcompany.proofit.signin
3. Enable "Sign In with Apple" for this Services ID
4. Configure domains:
   - Domain: xxxxxxxxxxxx.supabase.co
   - Return URL: https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
5. Create a new Key:
   - Enable "Sign In with Apple"
   - Download the .p8 file
6. Enter these in Supabase:
   - Secret Key: (paste contents of .p8 file)
   - Services ID: com.yourcompany.proofit.signin
   - Team ID: (from Apple Developer account)
   - Key ID: (from the key you created)
```

#### Google Sign In (Optional but Recommended)

1. Toggle **Google** provider ON
2. Go to [Google Cloud Console](https://console.cloud.google.com)
3. Create a new project or select existing
4. Go to **APIs & Services → Credentials**
5. Create **OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized redirect URIs: `https://xxxxxxxxxxxx.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

### Configure Auth Settings

Go to **Authentication → URL Configuration**:

- **Site URL:** `proofit://` (for deep linking back to app)
- **Redirect URLs:** Add:
  - `proofit://`
  - `exp://localhost:8081` (for Expo development)
  - `exp://192.168.x.x:8081` (your local IP for testing)

### Email Templates

Go to **Authentication → Email Templates** and customize:

- **Confirm signup** - Welcome email with verification link
- **Reset password** - Password reset email
- **Change email** - Email change confirmation

---

## 3. Database Schema

Go to **SQL Editor** in Supabase and run these queries to create your tables.

### Users Profile Table

```sql
-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    LOWER(SPLIT_PART(NEW.email, '@', 1)) || '_' || SUBSTRING(NEW.id::TEXT, 1, 4),
    SPLIT_PART(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Posts Table

```sql
-- Create posts table
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('iron', 'path', 'deep', 'snap')),
  image_url TEXT NOT NULL,
  caption TEXT,
  activity_data JSONB,
  location_name TEXT,
  location_coords POINT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster feed queries
CREATE INDEX posts_created_at_idx ON public.posts(created_at DESC);
CREATE INDEX posts_user_id_idx ON public.posts(user_id);
CREATE INDEX posts_activity_type_idx ON public.posts(activity_type);
```

### Follows Table

```sql
-- Create follows table
CREATE TABLE public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Indexes
CREATE INDEX follows_follower_idx ON public.follows(follower_id);
CREATE INDEX follows_following_idx ON public.follows(following_id);
```

### Likes Table

```sql
-- Create likes table
CREATE TABLE public.likes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- Enable RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update likes_count
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();
```

### Comments Table

```sql
-- Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for comments_count
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comments_count();

-- Index
CREATE INDEX comments_post_id_idx ON public.comments(post_id);
```

### Streaks Table

```sql
-- Create streaks table
CREATE TABLE public.streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('iron', 'path', 'deep', 'snap', 'overall')),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_type)
);

-- Enable RLS
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own streaks"
  ON public.streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.streaks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert streaks"
  ON public.streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 4. Image Storage

### Create Storage Bucket

Go to **Storage** in Supabase dashboard:

1. Click **"New bucket"**
2. Name: `post-images`
3. Public bucket: **ON** (so images can be viewed without auth)
4. Click **"Create bucket"**

### Storage Policies

Go to **Storage → Policies** for the `post-images` bucket:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 5. React Native Integration

### Install Supabase Client

```bash
npm install @supabase/supabase-js --legacy-peer-deps
```

For React Native, also install async storage:

```bash
npx expo install @react-native-async-storage/async-storage
```

### Create Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import 'react-native-url-polyfill/dist/polyfill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

Also install the URL polyfill:

```bash
npm install react-native-url-polyfill --legacy-peer-deps
```

### Auth Hook

Create `src/hooks/useAuth.ts`:

```typescript
import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'proofit://reset-password',
    });
    return { data, error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}
```

### Apple Sign In

Install the Apple auth package:

```bash
npx expo install expo-apple-authentication
```

Add to your sign-in screen:

```typescript
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '@/lib/supabase';

const signInWithApple = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    
    if (credential.identityToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });
      
      if (error) throw error;
      return data;
    }
  } catch (e) {
    console.error('Apple sign in error:', e);
  }
};
```

### Image Upload Helper

Create `src/lib/storage.ts`:

```typescript
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export async function uploadPostImage(
  userId: string,
  imageUri: string
): Promise<string | null> {
  try {
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Generate unique filename
    const fileName = `${userId}/${Date.now()}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, decode(base64), {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    return null;
  }
}
```

Install expo-file-system and base64-arraybuffer:

```bash
npx expo install expo-file-system
npm install base64-arraybuffer --legacy-peer-deps
```

---

## 6. Environment Variables

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** 
- Never commit `.env` to git - add it to `.gitignore`
- The `EXPO_PUBLIC_` prefix makes these available in the client
- Never expose your `service_role` key in the client app

Add to `.gitignore`:

```
.env
.env.local
.env.*.local
```

---

## Checklist

### Auth Setup
- [ ] Create Supabase project
- [ ] Enable Email/Password auth
- [ ] Set up Apple Sign In (required for App Store)
- [ ] Set up Google Sign In (optional)
- [ ] Configure redirect URLs
- [ ] Customize email templates

### Database Setup
- [ ] Create profiles table with trigger
- [ ] Create posts table
- [ ] Create follows table
- [ ] Create likes table with trigger
- [ ] Create comments table with trigger
- [ ] Create streaks table

### Storage Setup
- [ ] Create `post-images` bucket
- [ ] Configure storage policies

### App Integration
- [ ] Install `@supabase/supabase-js`
- [ ] Install `@react-native-async-storage/async-storage`
- [ ] Install `react-native-url-polyfill`
- [ ] Create supabase client
- [ ] Create useAuth hook
- [ ] Set up Apple authentication
- [ ] Create image upload helper
- [ ] Add environment variables

---

## Testing Auth

Quick test in your app:

```typescript
// Test signup
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123',
});
console.log('Signup:', data, error);

// Test login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'testpassword123',
});
console.log('Login:', data, error);

// Test get user
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

---

## Next Steps

Once auth and database are set up:

1. Create login/signup screens
2. Add auth state to your navigation (redirect unauthenticated users)
3. Replace mock data with real Supabase queries
4. Implement image upload in post creation flow
5. Add real-time subscriptions for feed updates

---

*Good luck! The backend is the foundation - once this is solid, everything else builds on top.* 🚀
