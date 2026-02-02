import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'filled';
  disabled?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  size = 'md',
  variant = 'default',
  disabled = false,
  style,
}: IconButtonProps) {
  const sizes = { sm: 36, md: 44, lg: 56 };
  const dimension = sizes[size];

  const getBackgroundColor = () => {
    if (variant === 'ghost') return 'transparent';
    if (variant === 'filled') return theme.colors.background.surface;
    return 'rgba(0,0,0,0.5)';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: getBackgroundColor(),
          opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
        },
        variant === 'default' && styles.bordered,
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
});
