import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { 
  Dumbbell, 
  Route, 
  Brain, 
  Sparkles, 
  Camera,
  Play
} from "lucide-react-native";
import { theme, PILLARS } from "@/constants/theme";

/**
 * Capture Screen - Quick access to start activities
 * Alternative entry point with a focus on "proving" activities
 */

const PillarButton = ({ 
  pillar, 
  icon: Icon,
  onPress 
}: { 
  pillar: typeof PILLARS[keyof typeof PILLARS];
  icon: any;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} className="mb-4">
      <View 
        className="rounded-[20px] overflow-hidden border"
        style={{ 
          borderColor: `${pillar.color}40`,
          shadowColor: pillar.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
        }}
      >
        <LinearGradient
          colors={[`${pillar.color}20`, theme.colors.background.card]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 24 }}
        >
          <View className="flex-row items-center">
            <View 
              className="w-16 h-16 rounded-2xl items-center justify-center mr-5"
              style={{ backgroundColor: `${pillar.color}25` }}
            >
              <Icon size={32} color={pillar.color} strokeWidth={1.5} />
            </View>
            
            <View className="flex-1">
              <Text 
                className="text-2xl font-bold"
                style={{ color: pillar.color }}
              >
                {pillar.name}
              </Text>
              <Text className="text-text-secondary text-base mt-1">
                {pillar.description}
              </Text>
            </View>
            
            <View 
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: pillar.color }}
            >
              <Camera size={20} color={theme.colors.text.inverse} strokeWidth={2} />
            </View>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
};

export default function CaptureScreen() {
  const handlePillarSelect = (pillarId: string) => {
    // Navigate to activity screen with pillar context
    router.push(`/activity/${pillarId}`);
  };
  
  return (
    <SafeAreaView className="flex-1 bg-gemini-bg" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center justify-between">
        <View>
          <Text className="text-text-primary text-2xl font-bold">
            Quick Capture
          </Text>
          <Text className="text-text-secondary text-base mt-1">
            Choose what you want to log
          </Text>
        </View>
      </View>
      
      <ScrollView 
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <PillarButton 
          pillar={PILLARS.iron} 
          icon={Dumbbell}
          onPress={() => handlePillarSelect('iron')}
        />
        <PillarButton 
          pillar={PILLARS.path} 
          icon={Route}
          onPress={() => handlePillarSelect('path')}
        />
        <PillarButton 
          pillar={PILLARS.deep} 
          icon={Brain}
          onPress={() => handlePillarSelect('deep')}
        />
        <PillarButton 
          pillar={PILLARS.snap} 
          icon={Sparkles}
          onPress={() => handlePillarSelect('snap')}
        />
        
        {/* Tip Card */}
        <View className="mt-4 p-5 bg-gemini-card rounded-[16px] border border-gemini-border">
          <Text className="text-text-secondary text-sm leading-6">
            📸 <Text className="text-text-primary font-medium">Pro tip:</Text> Enter your activity data first, 
            then snap a photo. Your stats will overlay beautifully on your pic.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
