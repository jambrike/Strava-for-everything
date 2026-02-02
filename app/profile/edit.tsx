import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAuthContext } from '@/contexts/AuthContext';
import { updateProfile } from '@/lib/database';

export default function EditProfileScreen() {
  const { profile, setProfile } = useAuthContext();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const updated = await updateProfile({ display_name: displayName.trim(), bio: bio.trim() });
    if (updated) {
      setProfile?.(updated);
      Alert.alert('Saved', 'Profile updated');
      router.back();
    } else {
      Alert.alert('Error', 'Could not update profile');
    }
    setIsSaving(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gemini-bg" edges={['top']}>
      <View className="flex-row items-center px-5 py-4 border-b border-gemini-border">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ArrowLeft size={22} color={theme.colors.text.primary} />
        </Pressable>
        <Text className="text-text-primary text-xl font-bold flex-1">Edit Profile</Text>
        <Pressable onPress={handleSave} disabled={isSaving} className="p-2">
          {isSaving ? (
            <ActivityIndicator color={theme.colors.text.secondary} />
          ) : (
            <Save size={20} color={theme.colors.text.secondary} />
          )}
        </Pressable>
      </View>

      <View className="p-5">
        <Text className="text-text-secondary text-sm mb-2">Display Name</Text>
        <TextInput
          style={{
            backgroundColor: theme.colors.background.surface,
            color: theme.colors.text.primary,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            paddingHorizontal: 12,
            paddingVertical: 14,
            marginBottom: 16,
          }}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Your name"
          placeholderTextColor={theme.colors.text.muted}
        />

        <Text className="text-text-secondary text-sm mb-2">Bio</Text>
        <TextInput
          style={{
            backgroundColor: theme.colors.background.surface,
            color: theme.colors.text.primary,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border.default,
            paddingHorizontal: 12,
            paddingVertical: 14,
            minHeight: 100,
            textAlignVertical: 'top',
          }}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell people what you're about"
          placeholderTextColor={theme.colors.text.muted}
          multiline
        />
      </View>
    </SafeAreaView>
  );
}
