export { supabase } from './supabase';
export type { Profile, Post } from './supabase';
export { uploadPostImage, uploadAvatar, deleteImage } from './storage';
// Database operations
export {
  // Profile
  getCurrentProfile,
  getProfileById,
  getProfileByUsername,
  updateProfile,
  isUsernameAvailable,
  // Posts
  createPost,
  getFeedPosts,
  getUserPosts,
  getMyPosts,
  getPostById,
  deletePost,
  // Likes
  likePost,
  unlikePost,
  hasLikedPost,
  getLikeStatuses,
  // Follows
  followUser,
  unfollowUser,
  isFollowing,
  getFollowerCount,
  getFollowingCount,
  // Comments
  getComments,
  addComment,
  deleteComment,
  searchProfiles,
  // Stats
  getActivityCounts,
  getPostCount,
} from './database';
export type { PostWithProfile, CommentWithProfile } from './database';