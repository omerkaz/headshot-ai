import { colors } from '@/theme/colors';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Button, { ButtonProps } from '../Button';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

// Predefined gradient color pairs to avoid type errors
const gradientPresets = {
  primary: ['#6366f1', '#3b82f6'] as readonly [string, string],
  secondary: ['#8b5cf6', '#ec4899'] as readonly [string, string],
  accent: ['#f59e0b', '#ef4444'] as readonly [string, string],
  success: ['#10b981', '#059669'] as readonly [string, string],
  cool: ['#06b6d4', '#3b82f6'] as readonly [string, string],
  warm: ['#f97316', '#db2777'] as readonly [string, string],
  elegant: ['#1e293b', '#334155'] as readonly [string, string],
};

export interface GradientButtonProps extends ButtonProps {
  gradientBackgroundProps?: LinearGradientProps;
  gradientBackgroundStyle?: StyleProp<ViewStyle>;
  gradientType?: keyof typeof gradientPresets;
}

function GradientButton({
  gradientBackgroundProps,
  gradientBackgroundStyle,
  gradientType = 'primary',
  style,
  titleStyle,
  loaderColor = colors.common.white,
  ...others
}: GradientButtonProps) {
  // Use predefined gradients to avoid type errors
  const gradientColors = gradientBackgroundProps?.colors || gradientPresets[gradientType];

  return (
    <Button
      {...others}
      loaderColor={loaderColor}
      titleStyle={[{ color: colors.common.white, fontWeight: '600' }, titleStyle]}
      style={[styles.root, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        {...gradientBackgroundProps}
        style={[styles.gradientBackground, gradientBackgroundStyle]}
      />
    </Button>
  );
}

export default GradientButton;
