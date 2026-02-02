import { Tabs } from "expo-router";
import { View, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import {
  Home,
  Newspaper,
  Camera,
  Trophy,
  User,
} from "lucide-react-native";
import { theme } from "@/constants/theme";

/**
 * Custom Tab Bar Component
 * Features the Gemini dark aesthetic with a floating glass effect
 * and a prominent center capture button
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarWrapper}>
        {/* Glass effect background */}
        <View style={styles.tabBarBackground} />
        
        <View style={styles.tabBarContent}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const isCapture = route.name === "capture";

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            // Center capture button with special styling
            if (isCapture) {
              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  style={styles.captureButtonWrapper}
                >
                  <View style={styles.captureButtonOuter}>
                    <View style={styles.captureButtonInner}>
                      <Camera
                        size={28}
                        color={theme.colors.text.primary}
                        strokeWidth={2}
                      />
                    </View>
                  </View>
                </Pressable>
              );
            }

            // Get icon for each tab
            const getIcon = () => {
              const iconColor = isFocused
                ? theme.colors.text.primary
                : theme.colors.text.muted;
              const iconSize = 24;
              const strokeWidth = isFocused ? 2 : 1.5;

              switch (route.name) {
                case "index":
                  return <Home size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
                case "feed":
                  return <Newspaper size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
                case "stats":
                  return <Trophy size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
                case "profile":
                  return <User size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
                default:
                  return <Home size={iconSize} color={iconColor} strokeWidth={strokeWidth} />;
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tabButton}
              >
                <View style={[
                  styles.tabIconWrapper,
                  isFocused && styles.tabIconWrapperActive
                ]}>
                  {getIcon()}
                </View>
                
                {/* Active indicator dot */}
                {isFocused && <View style={styles.activeIndicator} />}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: "Capture",
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  tabBarWrapper: {
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: 36,
    // Subtle inner glow
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabIconWrapper: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  tabIconWrapperActive: {
    backgroundColor: theme.colors.overlay.medium,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.text.primary,
  },
  captureButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  captureButtonOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.background.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    // Glow effect
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  captureButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
});
