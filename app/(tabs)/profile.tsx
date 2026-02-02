import { View, Text, ScrollView, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useCallback } from "react";
import { 
  Settings, 
  ChevronRight, 
  Flame, 
  Trophy, 
  Calendar,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit3,
  Users
} from "lucide-react-native";
import { theme } from "@/constants/theme";
import { useAuthContext } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { 
  getPostCount, 
  getFollowerCount, 
  getFollowingCount,
  getMyPosts,
} from "@/lib/database";

/**
 * Profile Screen - User profile and settings access
 */

const MenuButton = ({ 
  icon: Icon, 
  label, 
  value, 
  onPress 
}: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
}) => (
  <Pressable 
    onPress={onPress}
    className="flex-row items-center py-4 border-b border-gemini-border"
  >
    <View className="w-10 h-10 bg-gemini-surface rounded-xl items-center justify-center mr-4">
      <Icon size={20} color={theme.colors.text.secondary} />
    </View>
    <View className="flex-1">
      <Text className="text-text-primary font-medium">{label}</Text>
    </View>
    {value && (
      <Text className="text-text-muted mr-2">{value}</Text>
    )}
    <ChevronRight size={20} color={theme.colors.text.muted} />
  </Pressable>
);

export default function ProfileScreen() {
  const { profile, user, signOut } = useAuthContext();
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    
    try {
      const [posts, followers, following] = await Promise.all([
        getPostCount(user.id),
        getFollowerCount(user.id),
        getFollowingCount(user.id),
      ]);
      
      setStats({ posts, followers, following });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        },
      ]
    );
  };

  // Use profile data or fallbacks
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const username = profile?.username || 'user';
  const avatarUrl = profile?.avatar_url || `https://i.pravatar.cc/200?u=${user?.id}`;
  const bio = profile?.bio || 'No bio yet. Tap to add one!';

  return (
    <SafeAreaView className="flex-1 bg-gemini-bg" edges={['top']}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Settings */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <Text className="text-text-primary text-2xl font-bold">Profile</Text>
          <Pressable 
            onPress={() => router.push('/profile/edit')}
            className="w-10 h-10 bg-gemini-card rounded-xl items-center justify-center border border-gemini-border"
          >
            <Settings size={20} color={theme.colors.text.secondary} />
          </Pressable>
        </View>
        
        {/* Profile Card */}
        <View className="mx-5 mb-6">
          <View className="bg-gemini-card rounded-[24px] border border-gemini-border overflow-hidden">
            {/* Banner Gradient */}
            <LinearGradient
              colors={[theme.colors.pillars.deep.primary, theme.colors.pillars.path.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ height: 80 }}
            />
            
            {/* Profile Info */}
            <View className="px-5 pb-5">
              <View className="flex-row items-end -mt-10">
                <View className="relative">
                  <Image
                    source={{ uri: avatarUrl }}
                    className="w-24 h-24 rounded-3xl border-4"
                    style={{ borderColor: theme.colors.background.card }}
                  />
                  <Pressable 
                    className="absolute bottom-0 right-0 w-8 h-8 bg-gemini-surface rounded-full items-center justify-center border-2"
                    style={{ borderColor: theme.colors.background.card }}
                  >
                    <Edit3 size={14} color={theme.colors.text.primary} />
                  </Pressable>
                </View>
                
                <View className="flex-1 ml-4 mb-2">
                  <Text className="text-text-primary text-xl font-bold">
                    {displayName}
                  </Text>
                  <Text className="text-text-secondary">
                    @{username}
                  </Text>
                </View>
              </View>
              
              {/* Bio */}
              <Text className="text-text-secondary mt-4 leading-5">
                {bio}
              </Text>
              
              {/* Stats Row */}
              <View className="flex-row mt-5 pt-5 border-t border-gemini-border">
                <View className="flex-1 items-center">
                  <View className="flex-row items-center">
                    <Trophy size={16} color={theme.colors.pillars.snap.primary} />
                    <Text className="text-text-primary text-xl font-bold ml-1">
                      {isLoading ? '-' : stats.posts}
                    </Text>
                  </View>
                  <Text className="text-text-muted text-sm">Posts</Text>
                </View>
                <View className="flex-1 items-center border-x border-gemini-border">
                  <View className="flex-row items-center">
                    <Users size={16} color={theme.colors.pillars.path.primary} />
                    <Text className="text-text-primary text-xl font-bold ml-1">
                      {isLoading ? '-' : stats.followers}
                    </Text>
                  </View>
                  <Text className="text-text-muted text-sm">Followers</Text>
                </View>
                <View className="flex-1 items-center">
                  <View className="flex-row items-center">
                    <Users size={16} color={theme.colors.pillars.deep.primary} />
                    <Text className="text-text-primary text-xl font-bold ml-1">
                      {isLoading ? '-' : stats.following}
                    </Text>
                  </View>
                  <Text className="text-text-muted text-sm">Following</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Menu Sections */}
        <View className="mx-5">
          <Text className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2">
            Settings
          </Text>
          
          <View className="bg-gemini-card rounded-[16px] border border-gemini-border px-4">
            <MenuButton icon={Bell} label="Notifications" value="On" />
            <MenuButton icon={Shield} label="Privacy" />
            <MenuButton icon={HelpCircle} label="Help & Support" />
            <Pressable onPress={handleSignOut} className="flex-row items-center py-4">
              <View className="w-10 h-10 bg-status-error/10 rounded-xl items-center justify-center mr-4">
                <LogOut size={20} color={theme.colors.status.error} />
              </View>
              <Text className="text-status-error font-medium">Sign Out</Text>
            </Pressable>
          </View>
        </View>
        
        {/* App Version */}
        <View className="items-center mt-8">
          <Text className="text-text-muted text-sm">ProofIt v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
