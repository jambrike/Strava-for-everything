import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Users, Plus, Check } from 'lucide-react-native';
import { theme, PILLARS, PillarType } from '@/constants/theme';
import { getProfileById, getUserPosts, followUser, unfollowUser, isFollowing, PostWithProfile } from '@/lib/database';
import { useAuthContext } from '@/contexts/AuthContext';

// Minimal feed card reused
function UserPostCard({ post }: { post: PostWithProfile }) {
  const pillarData = PILLARS[post.activity_type as PillarType];
  return (
    <View className="mb-4 mx-4">
      <View className="bg-gemini-card rounded-[16px] border border-gemini-border overflow-hidden">
        <Image source={{ uri: post.image_url }} className="w-full aspect-[4/5]" resizeMode="cover" />
        <View className="p-4">
          {post.caption ? <Text className="text-text-primary mb-2">{post.caption}</Text> : null}
          <Text className="text-text-muted text-xs">{new Date(post.created_at).toLocaleString()}</Text>
          <Text className="text-text-secondary text-sm mt-1">{pillarData?.name}</Text>
        </View>
      </View>
    </View>
  );
}

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthContext();

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [following, setFollowing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const p = await getProfileById(String(id));
    const userPosts = await getUserPosts(String(id));
    setProfile(p);
    setPosts(userPosts);
    if (user && user.id !== id) {
      const f = await isFollowing(String(id));
      setFollowing(f);
    }
    setLoading(false);
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFollow = async () => {
    if (!user || !id || user.id === id) return;
    setFollowLoading(true);
    if (following) await unfollowUser(String(id));
    else await followUser(String(id));
    const f = await isFollowing(String(id));
    setFollowing(f);
    setFollowLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gemini-bg items-center justify-center">
        <ActivityIndicator size="large" color={theme.colors.text.secondary} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-gemini-bg items-center justify-center">
        <Text className="text-text-secondary">Profile not found</Text>
      </SafeAreaView>
    );
  }

  const isSelf = user?.id === profile.id;

  return (
    <SafeAreaView className="flex-1 bg-gemini-bg" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-5 py-4">
          <Pressable onPress={() => router.back()} className="p-2">
            <ArrowLeft size={22} color={theme.colors.text.primary} />
          </Pressable>
          <Text className="text-text-primary text-xl font-bold">Profile</Text>
          <View style={{ width: 30 }} />
        </View>

        <View className="mx-5 mb-6">
          <View className="bg-gemini-card rounded-[24px] border border-gemini-border overflow-hidden">
            <LinearGradient colors={[theme.colors.pillars.deep.primary, theme.colors.pillars.path.primary]} style={{ height: 80 }} />
            <View className="px-5 pb-5">
              <View className="flex-row items-end -mt-10">
                <Image source={{ uri: profile.avatar_url || `https://i.pravatar.cc/200?u=${profile.id}` }} className="w-24 h-24 rounded-3xl border-4" style={{ borderColor: theme.colors.background.card }} />
                <View className="flex-1 ml-4 mb-2">
                  <Text className="text-text-primary text-xl font-bold">{profile.display_name || profile.username}</Text>
                  <Text className="text-text-secondary">@{profile.username}</Text>
                </View>
                {!isSelf && (
                  <Pressable onPress={handleFollow} disabled={followLoading} className="px-4 py-2 rounded-full" style={{ backgroundColor: '#fff' }}>
                    <View className="flex-row items-center gap-2">
                      {following ? <Check size={16} color="#000" /> : <Plus size={16} color="#000" />}
                      <Text style={{ color: '#000', fontWeight: '600' }}>
                        {following ? 'Following' : 'Follow'}
                      </Text>
                    </View>
                  </Pressable>
                )}
              </View>
              {profile.bio ? (
                <Text className="text-text-secondary mt-3">{profile.bio}</Text>
              ) : null}
            </View>
          </View>
        </View>

        <View className="px-5">
          <Text className="text-text-primary text-lg font-semibold mb-3">Posts</Text>
        </View>
        {posts.length === 0 ? (
          <Text className="text-text-secondary text-center mb-10">No posts yet.</Text>
        ) : (
          posts.map((p) => <UserPostCard key={p.id} post={p} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
