import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { 
  Dumbbell, 
  Route, 
  Brain, 
  Sparkles, 
  Flame,
  Play,
  Heart,
  MessageCircle,
  Plus
} from "lucide-react-native";
import { theme, PILLARS } from "@/constants/theme";
import { useActivityStore } from "@/store/activityStore";

/**
 * Home Screen - Activity Feed + Quick Start
 * Shows recent activities from others, then quick-start buttons
 */

// Recent activities from "other users" (mock data for demo)
const RECENT_ACTIVITIES = [
  {
    id: '1',
    user: { name: 'Alex', avatar: 'https://i.pravatar.cc/100?img=1' },
    type: 'iron',
    title: 'Chest & Triceps',
    subtitle: '225 lbs bench press • 45 min',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    likes: 24,
    time: '2h ago',
  },
  {
    id: '2',
    user: { name: 'Maya', avatar: 'https://i.pravatar.cc/100?img=5' },
    type: 'path',
    title: 'Morning Run',
    subtitle: '5.2 mi • 42:30',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400',
    likes: 18,
    time: '3h ago',
  },
  {
    id: '3',
    user: { name: 'Jordan', avatar: 'https://i.pravatar.cc/100?img=3' },
    type: 'deep',
    title: 'Deep Work Session',
    subtitle: '3 hours • CS homework',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
    likes: 12,
    time: '5h ago',
  },
];

const ActivityPreview = ({ activity }: { activity: typeof RECENT_ACTIVITIES[0] }) => {
  const pillar = PILLARS[activity.type as keyof typeof PILLARS];
  
  return (
    <View 
      className="mr-4 w-72 bg-gemini-card rounded-2xl border border-gemini-border overflow-hidden"
      style={{
        shadowColor: pillar.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      {/* Image */}
      <Image 
        source={{ uri: activity.image }} 
        className="w-full h-36"
        resizeMode="cover"
      />
      
      {/* Content */}
      <View className="p-3">
        <View className="flex-row items-center mb-2">
          <Image 
            source={{ uri: activity.user.avatar }}
            className="w-6 h-6 rounded-full mr-2"
          />
          <Text className="text-text-secondary text-sm flex-1">{activity.user.name}</Text>
          <Text className="text-text-muted text-xs">{activity.time}</Text>
        </View>
        
        <Text className="text-text-primary font-semibold">{activity.title}</Text>
        <Text className="text-text-muted text-sm mt-0.5">{activity.subtitle}</Text>
        
        <View className="flex-row items-center mt-3 pt-3 border-t border-gemini-border">
          <Pressable className="flex-row items-center mr-4">
            <Heart size={16} color={theme.colors.text.muted} />
            <Text className="text-text-muted text-sm ml-1">{activity.likes}</Text>
          </Pressable>
          <Pressable className="flex-row items-center">
            <MessageCircle size={16} color={theme.colors.text.muted} />
          </Pressable>
          <View 
            className="ml-auto px-2 py-1 rounded-full"
            style={{ backgroundColor: `${pillar.color}20` }}
          >
            <Text style={{ color: pillar.color, fontSize: 11, fontWeight: '600' }}>
              {pillar.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const QuickStartButton = ({ 
  type,
  icon: Icon,
}: { 
  type: keyof typeof PILLARS;
  icon: any;
}) => {
  const pillar = PILLARS[type];
  
  const handlePress = () => {
    router.push(`/activity/${type}`);
  };

  return (
    <Pressable onPress={handlePress} className="flex-1">
      <View 
        className="bg-gemini-card rounded-2xl border border-gemini-border p-4 items-center"
        style={{
          shadowColor: pillar.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        <View 
          className="w-12 h-12 rounded-xl items-center justify-center mb-3"
          style={{ backgroundColor: `${pillar.color}20` }}
        >
          <Icon size={24} color={pillar.color} strokeWidth={1.5} />
        </View>
        <Text className="text-text-primary font-semibold text-sm">{pillar.name}</Text>
        <View 
          className="mt-2 px-3 py-1 rounded-full flex-row items-center"
          style={{ backgroundColor: pillar.color }}
        >
          <Play size={10} color="#000" fill="#000" />
          <Text className="text-black text-xs font-semibold ml-1">Start</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default function HomeScreen() {
  const { drafts } = useActivityStore();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView className="flex-1 bg-gemini-bg" edges={['top']}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-text-secondary text-base">{getGreeting()}</Text>
          <Text className="text-text-primary text-2xl font-bold mt-1">
            What's happening
          </Text>
        </View>
        
        {/* Recent Activities - Horizontal Scroll */}
        <View className="mt-4">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <Text className="text-text-primary font-semibold text-lg">
              Recent Activity
            </Text>
            <Pressable>
              <Text className="text-text-secondary text-sm">See all</Text>
            </Pressable>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
          >
            {RECENT_ACTIVITIES.map((activity) => (
              <ActivityPreview key={activity.id} activity={activity} />
            ))}
          </ScrollView>
        </View>
        
        {/* Quick Start Section */}
        <View className="px-5 mt-8">
          <Text className="text-text-primary font-semibold text-lg mb-4">
            Start a Workout
          </Text>
          
          <View className="flex-row gap-3">
            <QuickStartButton type="iron" icon={Dumbbell} />
            <QuickStartButton type="path" icon={Route} />
          </View>
          
          <View className="flex-row gap-3 mt-3">
            <QuickStartButton type="deep" icon={Brain} />
            <QuickStartButton type="snap" icon={Sparkles} />
          </View>
        </View>
        
        {/* Today's Stats */}
        <View className="px-5 mt-8">
          <View className="bg-gemini-card rounded-2xl border border-gemini-border p-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-text-primary font-semibold text-lg">
                Today
              </Text>
              <View className="flex-row items-center">
                <Flame size={18} color={theme.colors.pillars.iron.primary} />
                <Text className="text-text-primary font-bold ml-1">7</Text>
                <Text className="text-text-muted text-sm ml-1">day streak</Text>
              </View>
            </View>
            
            <View className="flex-row">
              {Object.values(PILLARS).map((pillar, index) => (
                <View 
                  key={pillar.id}
                  className="flex-1 h-1.5 rounded-full mr-1"
                  style={{ 
                    backgroundColor: index < 1 ? pillar.color : theme.colors.background.surface 
                  }}
                />
              ))}
            </View>
            <Text className="text-text-muted text-sm mt-2">1 of 4 completed</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
