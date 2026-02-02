import { View, Text, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Flame, 
  Trophy, 
  Target, 
  TrendingUp,
  Dumbbell,
  Route,
  Brain,
  Sparkles
} from "lucide-react-native";
import { theme, PILLARS } from "@/constants/theme";

const { width } = Dimensions.get("window");

/**
 * Stats Screen - User's overall progress and achievements
 */

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
}) => (
  <View 
    className="bg-gemini-card rounded-[16px] border border-gemini-border p-4 flex-1"
    style={{
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    }}
  >
    <View 
      className="w-10 h-10 rounded-xl items-center justify-center mb-3"
      style={{ backgroundColor: `${color}20` }}
    >
      <Icon size={20} color={color} />
    </View>
    <Text className="text-text-muted text-xs uppercase tracking-wider">{title}</Text>
    <Text className="text-text-primary text-2xl font-bold mt-1">{value}</Text>
    <Text className="text-text-secondary text-sm mt-0.5">{subtitle}</Text>
  </View>
);

const PillarProgress = ({ 
  pillar, 
  icon: Icon, 
  current, 
  goal 
}: {
  pillar: typeof PILLARS[keyof typeof PILLARS];
  icon: any;
  current: number;
  goal: number;
}) => {
  const progress = Math.min((current / goal) * 100, 100);
  
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View 
            className="w-8 h-8 rounded-lg items-center justify-center mr-3"
            style={{ backgroundColor: `${pillar.color}20` }}
          >
            <Icon size={16} color={pillar.color} />
          </View>
          <Text className="text-text-primary font-medium">{pillar.name}</Text>
        </View>
        <Text className="text-text-secondary text-sm">
          {current}/{goal} this week
        </Text>
      </View>
      
      <View className="h-2 bg-gemini-surface rounded-full overflow-hidden">
        <View 
          className="h-full rounded-full"
          style={{ 
            width: `${progress}%`,
            backgroundColor: pillar.color,
          }}
        />
      </View>
    </View>
  );
};

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gemini-bg" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 border-b border-gemini-border">
        <Text className="text-text-primary text-2xl font-bold">Stats</Text>
      </View>
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Cards */}
        <View className="flex-row gap-3 mb-6">
          <StatCard
            title="Current Streak"
            value="12"
            subtitle="days"
            icon={Flame}
            color={theme.colors.pillars.iron.primary}
          />
          <StatCard
            title="Activities"
            value="247"
            subtitle="all time"
            icon={Trophy}
            color={theme.colors.pillars.snap.primary}
          />
        </View>
        
        <View className="flex-row gap-3 mb-8">
          <StatCard
            title="Weekly Goal"
            value="78%"
            subtitle="completed"
            icon={Target}
            color={theme.colors.pillars.path.primary}
          />
          <StatCard
            title="Improvement"
            value="+23%"
            subtitle="vs last week"
            icon={TrendingUp}
            color={theme.colors.pillars.deep.primary}
          />
        </View>
        
        {/* Weekly Progress */}
        <View className="bg-gemini-card rounded-[20px] border border-gemini-border p-5 mb-6">
          <Text className="text-text-primary text-lg font-semibold mb-4">
            Weekly Progress
          </Text>
          
          <PillarProgress pillar={PILLARS.iron} icon={Dumbbell} current={4} goal={5} />
          <PillarProgress pillar={PILLARS.path} icon={Route} current={3} goal={4} />
          <PillarProgress pillar={PILLARS.deep} icon={Brain} current={5} goal={5} />
          <PillarProgress pillar={PILLARS.snap} icon={Sparkles} current={6} goal={7} />
        </View>
        
        {/* Achievement Banner */}
        <View className="rounded-[20px] overflow-hidden">
          <LinearGradient
            colors={[theme.colors.pillars.deep.primary, theme.colors.pillars.path.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20 }}
          >
            <View className="flex-row items-center">
              <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center mr-4">
                <Trophy size={28} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white/70 text-sm">Next Achievement</Text>
                <Text className="text-white text-xl font-bold">
                  The Consistent One
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  3 more days to unlock
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
