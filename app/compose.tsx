import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { 
  X, 
  Send,
  Save,
  MapPin,
  Clock,
  Dumbbell,
  Route,
  Brain,
  Sparkles
} from "lucide-react-native";
import { theme, PILLARS, PillarType } from "@/constants/theme";
import { DataOverlay } from "@/components/activity";
import { useActivityStore } from "@/store/activityStore";
import { createPost as createDbPost } from "@/lib/database";
import { uploadPostImage } from "@/lib/storage";
import { useAuthContext } from "@/contexts/AuthContext";

/**
 * Compose Screen - Add caption and post your proof
 */

const PillarIcon = ({ pillar, size = 16 }: { pillar: PillarType; size?: number }) => {
  const color = PILLARS[pillar].color;
  switch (pillar) {
    case 'iron': return <Dumbbell size={size} color={color} />;
    case 'path': return <Route size={size} color={color} />;
    case 'deep': return <Brain size={size} color={color} />;
    case 'snap': return <Sparkles size={size} color={color} />;
  }
};

export default function ComposeScreen() {
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuthContext();
  
  const { 
    activePillar, 
    activityData, 
    photoUri, 
    saveToDraft,
    createPost,
    resetActivity 
  } = useActivityStore();
  
  const pillarData = activePillar ? PILLARS[activePillar] : null;
  
  const handleClose = () => {
    Alert.alert(
      'Discard Post?',
      'Save as draft or discard your progress?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save Draft', 
          onPress: () => {
            saveToDraft();
            router.dismissAll();
          }
        },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => {
            resetActivity();
            router.dismissAll();
          }
        },
      ]
    );
  };

  const handleSaveDraft = () => {
    saveToDraft();
    Alert.alert('Saved!', 'Your post has been saved to drafts.');
    router.dismissAll();
  };

  const handlePost = async () => {
    if (isPosting) return;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post');
      return;
    }
    
    setIsPosting(true);
    
    try {
      // Upload image to Supabase Storage
      let imageUrl = photoUri;
      if (photoUri && photoUri.startsWith('file://')) {
        const uploadedUrl = await uploadPostImage(user.id, photoUri);
        if (!uploadedUrl) {
          throw new Error('Failed to upload image');
        }
        imageUrl = uploadedUrl;
      }
      
      // Create post in database
      const post = await createDbPost({
        activityType: activePillar!,
        imageUrl: imageUrl || 'https://placeholder.com/image',
        caption: caption.trim() || undefined,
        activityData: activityData as Record<string, any>,
      });
      
      if (post) {
        // Also save locally for immediate display
        createPost(caption);
        
        Alert.alert(
          '🎉 Posted!', 
          'Your activity has been shared.',
          [
            { 
              text: 'View Feed', 
              onPress: () => {
                router.dismissAll();
                router.push('/(tabs)/feed');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error posting:', error);
      Alert.alert('Error', 'Failed to post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (!activePillar || !photoUri) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <Pressable onPress={() => router.back()} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={theme.colors.text.primary} />
        </Pressable>
        
        <Text style={styles.headerTitle}>New Post</Text>
        
        <Pressable onPress={handleSaveDraft} style={styles.draftButton}>
          <Save size={20} color={theme.colors.text.secondary} />
        </Pressable>
      </SafeAreaView>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Photo Preview with Overlay */}
          <View style={styles.photoContainer}>
            <Image 
              source={{ uri: photoUri }} 
              style={styles.photo}
            />
            
            {/* Gradient overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.photoGradient}
            />
            
            {/* Data Overlay */}
            <View style={styles.overlayContainer}>
              <DataOverlay 
                pillar={activePillar} 
                data={activityData}
              />
            </View>
            
            {/* Pillar Badge */}
            <View style={[styles.pillarBadge, { backgroundColor: `${pillarData?.color}30` }]}>
              <PillarIcon pillar={activePillar} />
              <Text style={[styles.pillarBadgeText, { color: pillarData?.color }]}>
                {pillarData?.name}
              </Text>
            </View>
          </View>
          
          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <Clock size={14} color={theme.colors.text.muted} />
              <Text style={styles.metaText}>{formatDate()}</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={14} color={theme.colors.text.muted} />
              <Text style={styles.metaText}>Location unavailable</Text>
            </View>
          </View>
          
          {/* Caption Input */}
          <View style={styles.captionContainer}>
            <TextInput
              style={styles.captionInput}
              value={caption}
              onChangeText={setCaption}
              placeholder="Write a caption..."
              placeholderTextColor={theme.colors.text.muted}
              multiline
              maxLength={280}
            />
            <Text style={styles.charCount}>{caption.length}/280</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Post Button */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Pressable 
          onPress={handlePost}
          style={[styles.postButton, { backgroundColor: pillarData?.color }]}
        >
          <Text style={styles.postButtonText}>Share Activity</Text>
          <Send size={20} color={theme.colors.text.inverse} />
        </Pressable>
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
    paddingBottom: 12,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  draftButton: {
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
  photoContainer: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.card,
  },
  photo: {
    width: '100%',
    aspectRatio: 4/5,
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  pillarBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pillarBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metadata: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: theme.colors.text.muted,
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  captionInput: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    color: theme.colors.text.primary,
    fontSize: 16,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.card,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  postButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.text.secondary,
    marginBottom: 20,
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.background.surface,
    borderRadius: 12,
  },
  errorButtonText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});
