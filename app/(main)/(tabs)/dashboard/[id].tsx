import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileDetail() {
  const { id } = useLocalSearchParams();
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const progressWidth = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Simulate loading profile data
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        // Here you would typically fetch profile data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert(
          'Error',
          'Failed to load profile data',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    };

    loadProfile();
  }, [id]);

  useEffect(() => {
    // Animate progress bar when images count changes
    Animated.spring(progressWidth, {
      toValue: (images.length / 30) * 100,
      useNativeDriver: false,
      tension: 20,
      friction: 7,
    }).start();
  }, [images.length, progressWidth]);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages(prev => {
          const updatedImages = [...prev, ...newImages];
          // Limit to 30 images total
          return updatedImages.slice(0, 30);
        });
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Here you would typically upload images to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert(
        'Success',
        'Images saved successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error saving images:', error);
      Alert.alert('Error', 'Failed to save images');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressSegments = () => {
    return Array.from({ length: 30 }, (_, i) => (
      <View
        key={i}
        style={[
          styles.progressSegment,
          i % 10 === 0 && styles.progressMilestone,
        ]}
      />
    ));
  };

  const getProgressStatus = () => {
    if (images.length === 0) return '📸 Start adding images (minimum 10)';
    if (images.length < 10) return `🌱 Need ${10 - images.length} more images...`;
    if (images.length < 20) return '🌿 Making progress!';
    if (images.length < 30) return '🌳 Almost there!';
    return '✨ Collection complete!';
  };

  const getProgressColor = () => {
    if (images.length < 10) return colors.primary.light;
    if (images.length < 20) return colors.primary.main;
    if (images.length < 30) return colors.secondary.main;
    return colors.secondary.light;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.progressTitle}>Image Collection Progress</Text>
            <View style={styles.minRequirementContainer}>
              <View style={[
                styles.minRequirementDot,
                { backgroundColor: images.length >= 10 ? colors.secondary.main : colors.text.disabled }
              ]} />
              <Text style={[
                styles.minRequirementText,
                { color: images.length >= 10 ? colors.secondary.main : colors.text.disabled }
              ]}>
                Minimum 10 images required
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.clearButtonNew}
              onPress={() => {
                if (images.length > 0) {
                  Alert.alert(
                    'Clear Images',
                    'Are you sure you want to clear all images?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Clear',
                        style: 'destructive',
                        onPress: () => setImages([]),
                      },
                    ],
                  );
                }
              }}
            >
              <Ionicons 
                name="trash-outline" 
                size={16} 
                color={images.length > 0 ? colors.secondary.main : colors.text.disabled} 
              />
              <Text style={[
                styles.clearButtonText,
                { color: images.length > 0 ? colors.secondary.main : colors.text.disabled }
              ]}>
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.progressCount, { color: getProgressColor() }]}>
            {images.length}/30
          </Text>
        </View>
        <View style={styles.progressBackground}>
          <View style={styles.minRequirementLine} />
          <View style={styles.segmentContainer}>
            {renderProgressSegments()}
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
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressStatus}>{getProgressStatus()}</Text>
          <View style={styles.milestoneContainer}>
            <Text style={[styles.milestone, images.length >= 10 && styles.milestoneReached]}>10</Text>
            <Text style={[styles.milestone, images.length >= 20 && styles.milestoneReached]}>20</Text>
            <Text style={[styles.milestone, images.length >= 30 && styles.milestoneReached]}>30</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Image Grid */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageGrid}>
          {images.map((uri, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.imageContainer,
                index % 4 === 0 && styles.largeImage,
                index % 4 === 1 && styles.mediumImage,
                index % 4 === 2 && styles.smallImage,
                index % 4 === 3 && styles.mediumImage,
              ]}
              onPress={() => {
                setSelectedImage(uri);
                setModalVisible(true);
              }}
            >
              <Image source={{ uri }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Button */}
      {images.length < 30 && (
        <TouchableOpacity 
          style={[
            styles.addButton,
            images.length >= 30 && styles.addButtonDisabled
          ]}
          onPress={pickImages}
        >
          <Ionicons name="add" size={32} color={colors.common.white} />
        </TouchableOpacity>
      )}

      {/* Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedImage(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
            setSelectedImage(null);
          }}
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.common.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text.secondary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  scrollContainer: {
    flex: 1,
  },
  imageGrid: {
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  largeImage: {
    width: '48%',
    aspectRatio: 1,
  },
  mediumImage: {
    width: '31%',
    aspectRatio: 1,
  },
  smallImage: {
    width: '23%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonDisabled: {
    backgroundColor: colors.text.disabled,
    shadowOpacity: 0.1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.secondary.main + '15',
    shadowColor: colors.secondary.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary.dark,
    letterSpacing: 0.5,
  },
  progressCount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary.main,
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
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressStatus: {
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
  clearButtonNew: {
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
    left: '33.33%', // Position at 10 images mark (10/30 * 100)
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.secondary.main + '40',
    zIndex: 1,
  },
});
