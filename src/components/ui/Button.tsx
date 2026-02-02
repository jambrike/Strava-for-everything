import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'pillar';
  pillarColor?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  pillarColor,
  size = 'md',
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}: ButtonProps) {
  const heights = {
    sm: 36,
    md: 48,
    lg: 56,
  };

  const fontSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const paddingHorizontal = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.background.surface;
    switch (variant) {
      case 'primary':
        return theme.colors.text.primary;
      case 'secondary':
        return theme.colors.background.surface;
      case 'ghost':
        return 'transparent';
      case 'pillar':
        return pillarColor || theme.colors.pillars.iron.primary;
      default:
        return theme.colors.text.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.text.muted;
    switch (variant) {
      case 'primary':
        return theme.colors.text.inverse;
      case 'secondary':
      case 'ghost':
        return theme.colors.text.primary;
      case 'pillar':
        return theme.colors.text.inverse;
      default:
        return theme.colors.text.inverse;
    }
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.border.default;
    switch (variant) {
      case 'secondary':
        return theme.colors.border.light;
      case 'ghost':
        return 'transparent';
      default:
        return 'transparent';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          height: heights[size],
          paddingHorizontal: paddingHorizontal[size],
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: pressed ? 0.8 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
        style,
      ]}
    >
      {icon && iconPosition === 'left' && (
        <View style={styles.iconLeft}>{icon}</View>
      )}
      <Text
        style={[
          styles.text,
          {
            fontSize: fontSizes[size],
            color: getTextColor(),
          },
        ]}
      >
        {title}
      </Text>
      {icon && iconPosition === 'right' && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.base,
  },
  text: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
