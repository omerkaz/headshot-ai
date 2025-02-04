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

  useEffect(() => {
    Animated.spring(progressWidth, {
      toValue: (imagesCount / 30) * 100,
      useNativeDriver: false,
      tension: 20,
      friction: 7,
    }).start();
  }, [imagesCount, progressWidth]);

  const getProgressStatus = () => {
    if (imagesCount === 0) return '📸 Start adding images (minimum 10)';
    if (imagesCount < 10) return `🌱 Need ${10 - imagesCount} more images...`;
    if (imagesCount < 20) return '🌿 Making progress!';
    if (imagesCount < 30) return '🌳 Almost there!';
    return '✨ Collection complete!';
  };

  const getProgressColor = () => {
    if (imagesCount < 10) return colors.primary.light;
    if (imagesCount < 20) return colors.primary.main;
    if (imagesCount < 30) return colors.secondary.main;
    return colors.secondary.light;
  };

  const handleClear = () => {
    if (imagesCount > 0) {
      Alert.alert(
        'Clear Images',
        'Are you sure you want to clear all images?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: onClearImages },
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Image Collection Progress</Text>
          <View style={styles.minRequirementContainer}>
            <View style={[
              styles.minRequirementDot,
              { backgroundColor: imagesCount >= 10 ? colors.secondary.main : colors.text.disabled }
            ]} />
            <Text style={[
              styles.minRequirementText,
              { color: imagesCount >= 10 ? colors.secondary.main : colors.text.disabled }
            ]}>
              Minimum 10 images required
            </Text>
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Ionicons 
              name="trash-outline" 
              size={16} 
              color={imagesCount > 0 ? colors.secondary.main : colors.text.disabled} 
            />
            <Text style={[
              styles.clearButtonText,
              { color: imagesCount > 0 ? colors.secondary.main : colors.text.disabled }
            ]}>
              Clear all
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.count, { color: getProgressColor() }]}>
          {imagesCount}/30
        </Text>
      </View>
      <View style={styles.progressBackground}>
        <View style={styles.minRequirementLine} />
        <View style={styles.segmentContainer}>
          {Array.from({ length: 30 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                i % 10 === 0 && styles.progressMilestone,
              ]}
            />
          ))}
        </View>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary.light, colors.primary.main, colors.secondary.main, colors.secondary.light]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.status}>{getProgressStatus()}</Text>
        <View style={styles.milestoneContainer}>
          <Text style={[styles.milestone, imagesCount >= 10 && styles.milestoneReached]}>10</Text>
          <Text style={[styles.milestone, imagesCount >= 20 && styles.milestoneReached]}>20</Text>
          <Text style={[styles.milestone, imagesCount >= 30 && styles.milestoneReached]}>30</Text>
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
    backgroundColor: colors.secondary.main + '15',
    shadowColor: colors.secondary.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary.dark,
    letterSpacing: 0.5,
  },
  count: {
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(203, 12, 71, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  segmentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  progressSegment: {
    width: 1,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
  },
  progressMilestone: {
    width: 2,
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    marginTop: 8,
  },
  status: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  milestoneContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  milestone: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  milestoneReached: {
    color: colors.secondary.main,
    fontWeight: '700',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    padding: 4,
  },
  clearButtonText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  minRequirementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  minRequirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  minRequirementText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  minRequirementLine: {
    position: 'absolute',
    left: '33.33%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.secondary.main + '40',
    zIndex: 1,
  },
}); 