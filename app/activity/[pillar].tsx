import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  X, 
  Camera, 
  Check, 
  Dumbbell, 
  Route, 
  Brain, 
  Sparkles,
  Save
} from "lucide-react-native";
import { theme, PILLARS, PillarType } from "@/constants/theme";
import { IronForm, PathForm, DeepForm, SnapForm } from "@/components/activity";
import { useActivityStore, ActivityData } from "@/store/activityStore";

/**
 * Activity Screen - Enter activity data before or after taking photo
 * This is the main data entry flow for each pillar
 */

const PillarIcon = ({ pillar, size = 24 }: { pillar: PillarType; size?: number }) => {
  const color = PILLARS[pillar].color;
  switch (pillar) {
    case 'iron': return <Dumbbell size={size} color={color} />;
    case 'path': return <Route size={size} color={color} />;
    case 'deep': return <Brain size={size} color={color} />;
    case 'snap': return <Sparkles size={size} color={color} />;
  }
};

export default function ActivityScreen() {
  const { pillar } = useLocalSearchParams<{ pillar: string }>();
  const pillarType = pillar as PillarType;
  const pillarData = PILLARS[pillarType];
  
  const { 
    startActivity, 
    activityData, 
    setActivityData,
    saveToDraft,
    photoUri 
  } = useActivityStore();
  
  // Initialize activity if not already started
  React.useEffect(() => {
    startActivity(pillarType);
  }, [pillarType]);

  const handleClose = () => {
    Alert.alert(
      'Discard Activity?',
      'Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => router.back()
        },
      ]
    );
  };

  const handleTakePhoto = () => {
    // Navigate to camera with pillar context
    router.push(`/capture/${pillarType}`);
  };

  const handleSaveDraft = () => {
    saveToDraft();
    Alert.alert('Saved!', 'Your activity has been saved to drafts.');
    router.back();
  };

  const handleContinue = () => {
    if (photoUri) {
      // Go to compose screen
      router.push('/compose');
    } else {
      // Take photo first
      router.push(`/capture/${pillarType}`);
    }
  };

  const renderForm = () => {
    switch (pillarType) {
      case 'iron':
        return <IronForm data={activityData as any} onChange={setActivityData} />;
      case 'path':
        return <PathForm data={activityData as any} onChange={setActivityData} />;
      case 'deep':
        return <DeepForm data={activityData as any} onChange={setActivityData} />;
      case 'snap':
        return <SnapForm data={activityData as any} onChange={setActivityData} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <LinearGradient
          colors={[`${pillarData?.color}15`, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={theme.colors.text.primary} />
        </Pressable>
        
        <View style={styles.titleContainer}>
          <View style={[styles.iconContainer, { backgroundColor: `${pillarData?.color}20` }]}>
            <PillarIcon pillar={pillarType} />
          </View>
          <View>
            <Text style={[styles.pillarName, { color: pillarData?.color }]}>
              {pillarData?.name}
            </Text>
            <Text style={styles.subtitle}>Log your activity</Text>
          </View>
        </View>
        
        <Pressable onPress={handleSaveDraft} style={styles.saveButton}>
          <Save size={22} color={theme.colors.text.secondary} />
        </Pressable>
      </SafeAreaView>
      
      {/* Form Content */}
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderForm()}
      </KeyboardAvoidingView>
      
      {/* Bottom Actions */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <View style={styles.footerContent}>
          {/* Photo Status */}
          {photoUri ? (
            <View style={styles.photoStatus}>
              <Check size={16} color={theme.colors.status.success} />
              <Text style={styles.photoStatusText}>Photo captured</Text>
            </View>
          ) : (
            <View style={styles.photoStatus}>
              <Camera size={16} color={theme.colors.text.muted} />
              <Text style={[styles.photoStatusText, { color: theme.colors.text.muted }]}>
                No photo yet
              </Text>
            </View>
          )}
          
          {/* Action Button */}
          <Pressable 
            onPress={handleContinue}
            style={[styles.continueButton, { backgroundColor: pillarData?.color }]}
          >
            <Text style={styles.continueButtonText}>
              {photoUri ? 'Continue' : 'Take Photo'}
            </Text>
            <Camera size={20} color={theme.colors.text.inverse} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarName: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  footer: {
    backgroundColor: theme.colors.background.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  photoStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoStatusText: {
    fontSize: 14,
    color: theme.colors.status.success,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
});
