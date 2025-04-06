import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProgressBarProps {
  imagesCount: number;
  onClearImages: () => void;
}

export function ProgressBar({ imagesCount, onClearImages }: ProgressBarProps) {
  const progressWidth = React.useRef(new Animated.Value(0)).current;
  const MAX_IMAGES = 30;
  const MIN_IMAGES = 10;

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: (imagesCount / MAX_IMAGES) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [imagesCount, progressWidth]);

  const getProgressStatus = () => {
    if (imagesCount === 0) return `Add images (${MIN_IMAGES} minimum)`;
    if (imagesCount < MIN_IMAGES) return `Need ${MIN_IMAGES - imagesCount} more images`;
    if (imagesCount < MAX_IMAGES) return 'Collecting images...';
    return 'Collection complete';
  };

  const getProgressColor = () => {
    if (imagesCount < MIN_IMAGES) return colors.status.error;
    return colors.status.success;
  };

  const handleClear = () => {
    Alert.alert('Clear Images', 'Are you sure you want to clear all images?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: onClearImages },
    ]);
  };

  const isClearDisabled = imagesCount === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          disabled={isClearDisabled}
          activeOpacity={isClearDisabled ? 1 : 0.7}>
          <Ionicons
            name="trash-outline"
            size={16}
            color={!isClearDisabled ? colors.status.error : colors.grey[500]}
          />
          <Text
            style={[
              styles.clearButtonText,
              { color: !isClearDisabled ? colors.status.error : colors.grey[500] },
            ]}>
            Clear all
          </Text>
        </TouchableOpacity>
        <Text style={[styles.count, { color: getProgressColor() }]}>
          {imagesCount}/{MAX_IMAGES}
        </Text>
      </View>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}>
          <LinearGradient
            colors={[colors.text, colors.accent2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.status}>{getProgressStatus()}</Text>
        <View style={styles.milestoneContainer}>
          <Text style={[styles.milestone, imagesCount >= MIN_IMAGES && styles.milestoneReached]}>
            {MIN_IMAGES}
          </Text>
          <Text style={[styles.milestone, imagesCount >= 20 && styles.milestoneReached]}>20</Text>
          <Text style={[styles.milestone, imagesCount >= MAX_IMAGES && styles.milestoneReached]}>
            {MAX_IMAGES}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.grey[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  count: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressBackground: {
    height: 8,
    backgroundColor: colors.grey[300],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  gradient: {
    flex: 1,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  status: {
    fontSize: 13,
    color: colors.grey[700],
    fontWeight: '400',
    flexShrink: 1,
    marginRight: 8,
  },
  milestoneContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  milestone: {
    fontSize: 12,
    color: colors.grey[500],
    fontWeight: '500',
  },
  milestoneReached: {
    color: colors.accent3,
    fontWeight: '700',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 8,
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
