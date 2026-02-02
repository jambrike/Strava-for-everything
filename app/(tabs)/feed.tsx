import { View, Text, ScrollView, Image, Pressable, Dimensions, RefreshControl, ActivityIndicator, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Dumbbell, 
  Route, 
  Brain, 
  Sparkles,
  MoreHorizontal,
  Flame,
  X,
  Send,
  Search
} from "lucide-react-native";
import { theme, PILLARS, PillarType } from "@/constants/theme";
import { useActivityStore, Post, ActivityData, IronData, PathData, DeepData, SnapData } from "@/store/activityStore";
import { getFeedPosts, likePost, unlikePost, getLikeStatuses, getComments, addComment, PostWithProfile, CommentWithProfile } from "@/lib/database";
import { useAuthContext } from "@/contexts/AuthContext";

const { width } = Dimensions.get("window");

/**
 * Feed Screen - Social feed combining proof photos with data overlays
 * Fetches posts from Supabase database
 */

// Keep mock data as fallback for demo
const MOCK_POSTS = [
  {
    id: "mock-1",
    user: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/100?img=1",
      username: "@alexfitness",
    },
    pillar: "iron" as PillarType,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    caption: "Morning grind 💪 Hit a new PR on deadlifts!",
    data: {
      exercise: "Deadlift",
      weight: "315",
      weightUnit: "lbs",
      sets: 4,
      reps: 6,
    } as Partial<IronData>,
    likes: 234,
    comments: 18,
    timestamp: "2h ago",
    isLiked: false,
  },
  {
    id: "mock-2",
    user: {
      name: "Maya Chen",
      avatar: "https://i.pravatar.cc/100?img=5",
      username: "@mayaruns",
    },
    pillar: "path" as PillarType,
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
    caption: "Sunrise run through the city 🌅",
    data: {
      distance: "5.2",
      distanceUnit: "mi",
      pace: "7:42 /mi",
      duration: "40:12",
      elevation: "+124 ft",
    } as Partial<PathData>,
    likes: 456,
    comments: 32,
    timestamp: "4h ago",
    isLiked: false,
  },
];

const PillarIcon = ({ pillar }: { pillar: string }) => {
  const size = 14;
  const color = PILLARS[pillar as keyof typeof PILLARS]?.color || "#fff";
  
  switch (pillar) {
    case "iron":
      return <Dumbbell size={size} color={color} />;
    case "path":
      return <Route size={size} color={color} />;
    case "deep":
      return <Brain size={size} color={color} />;
    case "snap":
      return <Sparkles size={size} color={color} />;
    default:
      return null;
  }
};

// Format data for overlay display
const formatDataForDisplay = (pillar: PillarType, data: Partial<ActivityData>): Record<string, string> => {
  switch (pillar) {
    case 'iron': {
      const d = data as Partial<IronData>;
      return {
        exercise: d.exercise || '—',
        weight: d.weight ? `${d.weight} ${d.weightUnit}` : '—',
        'sets × reps': `${d.sets || 0} × ${d.reps || 0}`,
      };
    }
    case 'path': {
      const d = data as Partial<PathData>;
      return {
        distance: d.distance ? `${d.distance} ${d.distanceUnit}` : '—',
        duration: d.duration || '—',
        pace: d.pace || '—',
      };
    }
    case 'deep': {
      const d = data as Partial<DeepData>;
      return {
        duration: d.duration || '—',
        sessions: `${d.sessions || 0}`,
        focus: d.focusScore ? `${d.focusScore}/5` : '—',
      };
    }
    case 'snap': {
      const d = data as Partial<SnapData>;
      const moodEmojis: Record<string, string> = { great: '🔥', good: '😊', okay: '😐', meh: '😕', rough: '😞' };
      return {
        mood: d.mood ? moodEmojis[d.mood] : '—',
        energy: d.energy ? `${d.energy}/5` : '—',
      };
    }
    default:
      return {};
  }
};

interface FeedPost {
  id: string;
  user?: {
    name: string;
    avatar: string;
    username: string;
  };
  pillar: PillarType;
  image: string;
  caption: string;
  data: Partial<ActivityData>;
  likes?: number;
  comments?: number;
  timestamp: string;
  isLiked?: boolean;
}

const FeedCard = ({ post, onLike, onComment }: { post: FeedPost; onLike?: (id: string, liked: boolean) => void; onComment?: (id: string) => void }) => {
  const pillarData = PILLARS[post.pillar as keyof typeof PILLARS];
  const displayData = formatDataForDisplay(post.pillar, post.data);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    
    // Update in database
    if (newLiked) {
      await likePost(post.id);
    } else {
      await unlikePost(post.id);
    }
    
    onLike?.(post.id, newLiked);
  };
  
  return (
    <View className="mb-4 mx-4">
      <View 
        className="bg-gemini-card rounded-[20px] border border-gemini-border overflow-hidden"
        style={{
          shadowColor: pillarData?.color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
        }}
      >
        {/* User Header */}
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            {post.user ? (
              <Image
                source={{ uri: post.user.avatar }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View 
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: `${pillarData?.color}20` }}
              >
                <PillarIcon pillar={post.pillar} />
              </View>
            )}
            <View className="ml-3">
              <View className="flex-row items-center">
                <Text className="text-text-primary font-semibold">
                  {post.user?.name || 'You'}
                </Text>
                <View 
                  className="ml-2 px-2 py-0.5 rounded-full flex-row items-center"
                  style={{ backgroundColor: `${pillarData?.color}20` }}
                >
                  <PillarIcon pillar={post.pillar} />
                  <Text 
                    className="text-xs font-medium ml-1"
                    style={{ color: pillarData?.color }}
                  >
                    {pillarData?.name}
                  </Text>
                </View>
              </View>
              <Text className="text-text-muted text-sm">
                {post.timestamp}
              </Text>
            </View>
          </View>
          <Pressable className="p-2">
            <MoreHorizontal size={20} color={theme.colors.text.muted} />
          </Pressable>
        </View>
        
        {/* Proof Photo with Data Overlay */}
        <View className="relative">
          <Image
            source={{ uri: post.image }}
            className="w-full aspect-[4/5]"
            resizeMode="cover"
          />
          
          {/* Gradient overlay at bottom */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 160,
            }}
          />
          
          {/* Data Overlay */}
          <View className="absolute bottom-0 left-0 right-0 p-4">
            <View 
              className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border"
              style={{ borderColor: `${pillarData?.color}30` }}
            >
              <View className="flex-row flex-wrap">
                {Object.entries(displayData).map(([key, value]) => (
                  <View key={key} className="w-1/2 mb-2">
                    <Text className="text-text-muted text-xs uppercase tracking-wider">
                      {key}
                    </Text>
                    <Text 
                      className="text-lg font-bold"
                      style={{ color: pillarData?.color }}
                    >
                      {String(value)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        
        {/* Caption & Actions */}
        <View className="p-4">
          {post.caption && (
            <Text className="text-text-primary mb-4">
              {post.caption}
            </Text>
          )}
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-5">
              <Pressable className="flex-row items-center" onPress={handleLike}>
                <Heart 
                  size={22} 
                  color={liked ? '#ef4444' : theme.colors.text.secondary}
                  fill={liked ? '#ef4444' : 'transparent'}
                />
                <Text className="text-text-secondary ml-2">{likeCount}</Text>
              </Pressable>
              <Pressable className="flex-row items-center" onPress={() => onComment?.(post.id)}>
                <MessageCircle size={22} color={theme.colors.text.secondary} />
                <Text className="text-text-secondary ml-2">{post.comments || 0}</Text>
              </Pressable>
              <Pressable>
                <Share2 size={22} color={theme.colors.text.secondary} />
              </Pressable>
            </View>
            
            <View className="flex-row items-center bg-gemini-surface px-3 py-1.5 rounded-full">
              <Flame size={14} color={theme.colors.pillars.iron.primary} />
              <Text className="text-text-primary text-sm font-medium ml-1">
                Fire
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function FeedScreen() {
  const { user } = useAuthContext();
  const { posts: localPosts } = useActivityStore();
  
  const [dbPosts, setDbPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [likeStatuses, setLikeStatuses] = useState<Record<string, boolean>>({});
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  // Fetch posts from database
  const fetchPosts = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const posts = await getFeedPosts({ limit: 30 });
      
      // Get like statuses for all posts
      if (user && posts.length > 0) {
        const postIds = posts.map(p => p.id);
        const statuses = await getLikeStatuses(postIds);
        setLikeStatuses(statuses);
      }
      
      // Convert to FeedPost format
      const feedPosts: FeedPost[] = posts.map(post => ({
        id: post.id,
        user: post.profiles ? {
          name: post.profiles.display_name || post.profiles.username,
          avatar: post.profiles.avatar_url || `https://i.pravatar.cc/100?u=${post.user_id}`,
          username: `@${post.profiles.username}`,
        } : undefined,
        pillar: post.activity_type as PillarType,
        image: post.image_url,
        caption: post.caption || '',
        data: (post.activity_data || {}) as Partial<ActivityData>,
        likes: post.likes_count,
        comments: post.comments_count,
        timestamp: getRelativeTime(new Date(post.created_at)),
        isLiked: likeStatuses[post.id] || false,
      }));
      
      setDbPosts(feedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user, likeStatuses]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  const openComments = async (postId: string) => {
    setActivePostId(postId);
    setCommentsVisible(true);
    setIsCommentsLoading(true);
    const fetched = await getComments(postId);
    setComments(fetched || []);
    setIsCommentsLoading(false);
  };

  const handleAddComment = async () => {
    if (!commentInput.trim() || !activePostId) return;
    const created = await addComment(activePostId, commentInput.trim());
    if (created) {
      setComments((prev) => [...prev, created]);
      setCommentInput('');
      // bump local count
      setDbPosts((prev) => prev.map((p) => p.id === activePostId ? { ...p, comments: (p.comments || 0) + 1 } : p));
    }
  };

  // Convert local posts to FeedPost format (for posts not yet synced)
  const localFeedPosts: FeedPost[] = localPosts.map((post) => ({
    id: post.id,
    pillar: post.pillar,
    image: post.photoUri,
    caption: post.caption,
    data: post.data,
    timestamp: getRelativeTime(post.createdAt),
    likes: 0,
    comments: 0,
    isLiked: false,
  }));
  
  // Combine database posts with mock posts (and filter out local duplicates)
  const dbIds = new Set(dbPosts.map(p => p.id));
  const filteredLocal = localFeedPosts.filter(p => !dbIds.has(p.id));
  const allPosts = [...filteredLocal, ...dbPosts, ...MOCK_POSTS];
  
  return (
    <SafeAreaView className="flex-1 bg-gemini-bg" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 border-b border-gemini-border flex-row items-center justify-between">
        <Text className="text-text-primary text-2xl font-bold">Feed</Text>
        <Pressable onPress={() => router.push('/search')} className="p-2">
          <Search size={22} color={theme.colors.text.secondary} />
        </Pressable>
      </View>
      
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.colors.text.secondary} />
          <Text className="text-text-muted mt-4">Loading feed...</Text>
        </View>
      ) : (
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.text.secondary}
            />
          }
        >
          {allPosts.length === 0 ? (
            <View className="items-center justify-center py-20 px-8">
              <Text className="text-text-secondary text-lg text-center">
                No posts yet. Start an activity and prove it! 💪
              </Text>
            </View>
          ) : (
            allPosts.map((post) => (
              <FeedCard key={post.id} post={post} onComment={openComments} />
            ))
          )}
        </ScrollView>
      )}

      <CommentsModal
        visible={commentsVisible}
        onClose={() => { setCommentsVisible(false); setCommentInput(''); }}
        comments={comments}
        loading={isCommentsLoading}
        input={commentInput}
        setInput={setCommentInput}
        onSend={handleAddComment}
      />
    </SafeAreaView>
  );
}

// Comments Modal
function CommentsModal({
  visible,
  onClose,
  comments,
  loading,
  input,
  setInput,
  onSend,
}: {
  visible: boolean;
  onClose: () => void;
  comments: CommentWithProfile[];
  loading: boolean;
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-gemini-bg" edges={['top']}>
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gemini-border">
          <Text className="text-text-primary text-xl font-bold">Comments</Text>
          <Pressable onPress={onClose} className="p-2">
            <X size={22} color={theme.colors.text.secondary} />
          </Pressable>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={theme.colors.text.secondary} />
          </View>
        ) : (
          <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
            {comments.length === 0 ? (
              <Text className="text-text-secondary text-center mt-8">No comments yet. Be the first!</Text>
            ) : (
              comments.map((c) => (
                <View key={c.id} className="mb-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-text-primary font-semibold">{c.profiles?.display_name || c.profiles?.username || 'User'}</Text>
                    <Text className="text-text-muted text-xs">{new Date(c.created_at).toLocaleString()}</Text>
                  </View>
                  <Text className="text-text-secondary mt-1">{c.text}</Text>
                </View>
              ))
            )}
          </ScrollView>
        )}

        <View className="border-t border-gemini-border px-4 py-3 flex-row items-center gap-8">
          <TextInput
            style={{
              flex: 1,
              backgroundColor: theme.colors.background.surface,
              color: theme.colors.text.primary,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: theme.colors.border.default,
            }}
            placeholder="Add a comment..."
            placeholderTextColor={theme.colors.text.muted}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Pressable onPress={onSend} className="p-3" disabled={!input.trim()}>
            <Send size={22} color={input.trim() ? theme.colors.text.primary : theme.colors.text.muted} />
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}
