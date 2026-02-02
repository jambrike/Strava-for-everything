import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, ArrowLeft } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { searchProfiles } from '@/lib/database';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const res = await searchProfiles(text.trim());
    setResults(res);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gemini-bg" edges={['top']}>
      <View className="flex-row items-center px-5 py-4 border-b border-gemini-border">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ArrowLeft size={22} color={theme.colors.text.primary} />
        </Pressable>
        <Search size={18} color={theme.colors.text.secondary} />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 8,
            color: theme.colors.text.primary,
            fontSize: 16,
          }}
          placeholder="Search users..."
          placeholderTextColor={theme.colors.text.muted}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.colors.text.secondary} />
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          {results.length === 0 ? (
            <Text className="text-text-secondary text-center mt-10">No results</Text>
          ) : (
            results.map((user) => (
              <Pressable
                key={user.id}
                onPress={() => router.push(`/user/${user.id}`)}
                className="bg-gemini-card border border-gemini-border rounded-2xl p-4 mb-3"
              >
                <Text className="text-text-primary font-semibold">{user.display_name || user.username}</Text>
                <Text className="text-text-muted">@{user.username}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
