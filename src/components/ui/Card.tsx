import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  glowColor?: string;
  style?: ViewStyle;
  noPadding?: boolean;
}

export function Card({
  children,
  title,
  subtitle,
  glowColor,
  style,
  noPadding = false,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        glowColor && {
          shadowColor: glowColor,
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        style,
      ]}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={[styles.content, noPadding && { padding: 0 }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: theme.spacing.base,
  },
});

export default Card;
