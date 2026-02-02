/**
 * Database Service Layer
 * Handles all Supabase database operations for posts, profiles, likes, etc.
 */

import { supabase, Profile, Post } from './supabase';
import { PillarType } from '@/constants/theme';

// ============================================
// PROFILE FUNCTIONS
// ============================================

/**
 * Get current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Get a profile by user ID
 */
export async function getProfileById(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Get a profile by username
 */
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Update current user's profile
 */
export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .neq('id', user?.id || '')
    .single();

  // If no data found, username is available
  return !data && error?.code === 'PGRST116';
}

/**
 * Search profiles by username or display name
 */
export async function searchProfiles(query: string, limit = 20) {
  const q = query.trim();
  if (!q) return [] as Profile[];

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching profiles:', error);
    return [];
  }

  return data as Profile[];
}

// ============================================
// POST FUNCTIONS
// ============================================

export type PostWithProfile = Post & {
  profiles: Profile;
};

/**
 * Create a new post
 */
export async function createPost({
  activityType,
  imageUrl,
  caption,
  activityData,
  locationName,
}: {
  activityType: PillarType;
  imageUrl: string;
  caption?: string;
  activityData?: Record<string, any>;
  locationName?: string;
}): Promise<Post | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('No user logged in');
    return null;
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      activity_type: activityType,
      image_url: imageUrl,
      caption: caption || null,
      activity_data: activityData || null,
      location_name: locationName || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }

  return data;
}

/**
 * Get feed posts (all posts, newest first)
 */
export async function getFeedPosts(options?: {
  limit?: number;
  offset?: number;
  activityType?: PillarType;
}): Promise<PostWithProfile[]> {
  const { limit = 20, offset = 0, activityType } = options || {};

  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles (*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (activityType) {
    query = query.eq('activity_type', activityType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching feed:', error);
    return [];
  }

  return data as PostWithProfile[];
}

/**
 * Get posts by a specific user
 */
export async function getUserPosts(userId: string, options?: {
  limit?: number;
  offset?: number;
}): Promise<PostWithProfile[]> {
  const { limit = 20, offset = 0 } = options || {};

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }

  return data as PostWithProfile[];
}

/**
 * Get current user's posts
 */
export async function getMyPosts(options?: {
  limit?: number;
  offset?: number;
}): Promise<PostWithProfile[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return getUserPosts(user.id, options);
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string): Promise<PostWithProfile | null> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (*)
    `)
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data as PostWithProfile;
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }

  return true;
}

// ============================================
// LIKES FUNCTIONS
// ============================================

/**
 * Like a post
 */
export async function likePost(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('likes')
    .insert({
      user_id: user.id,
      post_id: postId,
    });

  if (error) {
    // Might already be liked
    if (error.code === '23505') return true;
    console.error('Error liking post:', error);
    return false;
  }

  return true;
}

/**
 * Unlike a post
 */
export async function unlikePost(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', user.id)
    .eq('post_id', postId);

  if (error) {
    console.error('Error unliking post:', error);
    return false;
  }

  return true;
}

/**
 * Check if current user has liked a post
 */
export async function hasLikedPost(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('likes')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single();

  return !!data && !error;
}

/**
 * Get like status for multiple posts
 */
export async function getLikeStatuses(postIds: string[]): Promise<Record<string, boolean>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data, error } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', user.id)
    .in('post_id', postIds);

  if (error) {
    console.error('Error fetching like statuses:', error);
    return {};
  }

  const statuses: Record<string, boolean> = {};
  postIds.forEach(id => statuses[id] = false);
  data?.forEach(like => statuses[like.post_id] = true);

  return statuses;
}

// ============================================
// FOLLOW FUNCTIONS
// ============================================

/**
 * Follow a user
 */
export async function followUser(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === userId) return false;

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      following_id: userId,
    });

  if (error) {
    if (error.code === '23505') return true;
    console.error('Error following user:', error);
    return false;
  }

  return true;
}

/**
 * Unfollow a user
 */
export async function unfollowUser(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', userId);

  if (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }

  return true;
}

/**
 * Check if following a user
 */
export async function isFollowing(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', user.id)
    .eq('following_id', userId)
    .single();

  return !!data && !error;
}

/**
 * Get follower count
 */
export async function getFollowerCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  if (error) {
    console.error('Error getting follower count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Get following count
 */
export async function getFollowingCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  if (error) {
    console.error('Error getting following count:', error);
    return 0;
  }

  return count || 0;
}

// ============================================
// COMMENTS FUNCTIONS
// ============================================

export type CommentWithProfile = {
  id: string;
  user_id: string;
  post_id: string;
  text: string;
  created_at: string;
  profiles: Profile;
};

/**
 * Get comments for a post
 */
export async function getComments(postId: string): Promise<CommentWithProfile[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (*)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data as CommentWithProfile[];
}

/**
 * Add a comment
 */
export async function addComment(postId: string, text: string): Promise<CommentWithProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: user.id,
      post_id: postId,
      text,
    })
    .select(`
      *,
      profiles (*)
    `)
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }

  return data as CommentWithProfile;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    return false;
  }

  return true;
}

// ============================================
// STATS FUNCTIONS
// ============================================

/**
 * Get user's post count by activity type
 */
export async function getActivityCounts(userId: string): Promise<Record<PillarType, number>> {
  const counts: Record<PillarType, number> = {
    iron: 0,
    path: 0,
    deep: 0,
    snap: 0,
  };

  const { data, error } = await supabase
    .from('posts')
    .select('activity_type')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching activity counts:', error);
    return counts;
  }

  data?.forEach(post => {
    const type = post.activity_type as PillarType;
    if (counts.hasOwnProperty(type)) {
      counts[type]++;
    }
  });

  return counts;
}

/**
 * Get total post count for a user
 */
export async function getPostCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error getting post count:', error);
    return 0;
  }

  return count || 0;
}
