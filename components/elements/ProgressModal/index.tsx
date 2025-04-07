import { colors } from '@/theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, View } from 'react-native';
// New Animated Progress Bar Component
interface AnimatedProgressBarProps {
  progress: number; // Value between 0 and 1
  height?: number;
  backgroundColor?: string;
  gradientColors?: string[];
  animationDuration?: number;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  height = 10,
  backgroundColor = colors.grey[200],
  gradientColors = [colors.accent1, colors.accent2],
  animationDuration = 500,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: animationDuration,
      useNativeDriver: false,
      easing: Easing.out(Easing.quad),
    }).start();
  }, [progress, animationDuration, animatedProgress]);

  const widthInterpolated = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[styles.progressBarBackground, { height, backgroundColor, borderRadius: height / 2 }]}>
      <Animated.View style={[styles.progressBarFillContainer, { width: widthInterpolated }]}>
        <LinearGradient
          colors={[colors.text, colors.accent2]}
          style={[styles.progressBarFill, { borderRadius: height / 2 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </View>
  );
};
// End of New Animated Progress Bar Component

interface ProgressModalProps {
  isVisible: boolean;
  progress: number; // Value between 0 and 1
  title?: string;
  message?: string;
  submissionSuccess?: boolean;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  isVisible,
  progress,
  title = 'Processing...',
  message,
  submissionSuccess,
}) => {
  console.log('progress', progress);
  console.log('submissionSuccess', submissionSuccess);
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={() => {}}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          {message && <Text style={styles.modalMessage}>{message}</Text>}
          <View style={styles.progressBarContainer}>
            {/* Use the new AnimatedProgressBar */}
            {submissionSuccess ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="checkmark-circle" size={40} color={colors.status.success} />
              </View>
            ) : (
              <AnimatedProgressBar progress={progress} height={12} />
            )}
          </View>
          <Text style={styles.progressText}>{`${Math.round(progress * 100)}%`}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    color: colors.grey[600],
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey[700],
    marginTop: 8, // Add some space above percentage text
  },
  // Styles for the new AnimatedProgressBar
  progressBarBackground: {
    width: '100%',
    overflow: 'hidden', // Ensures the fill stays within rounded corners
  },
  progressBarFillContainer: {
    height: '100%',
    overflow: 'hidden',
    borderRadius: 50,
  },
  progressBarFill: {
    flex: 1,
  },
});

export default ProgressModal;
