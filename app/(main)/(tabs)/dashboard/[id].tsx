import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileDetail() {
  const { id } = useLocalSearchParams();
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages(prev => [...prev, ...newImages].slice(0, 10));
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
      
      {/* Upload Area */}
      <View style={styles.uploadArea}>
        <Ionicons 
          name="camera-outline" 
          size={48} 
          color={colors.primary.main}
          style={styles.uploadIcon}
        />
        <Text style={styles.uploadText}>Tap to upload</Text>
        <TouchableOpacity style={styles.selectButton} onPress={pickImages}>
          <Text style={styles.selectButtonText}>Select Photos</Text>
        </TouchableOpacity>
      </View>

      {/* Preview Section */}
      <View style={styles.previewSection}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Preview</Text>
          <Text style={styles.imageCount}>{images.length} images</Text>
        </View>
        <View style={styles.imageGrid}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close" size={20} color={colors.common.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setImages([])}
        >
          <Ionicons name="trash" size={20} color={colors.primary.main} />
          <Text style={styles.actionButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity 
        style={[styles.saveButton, { opacity: images.length < 10 ? 0.5 : 1 }]} 
        disabled={images.length < 10 || isLoading}
        onPress={handleSave}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.common.white} />
        ) : (
          <Text style={styles.saveButtonText}>Save Images</Text>
        )}
      </TouchableOpacity>
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
  uploadArea: {
    height: 180,
    margin: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary.main,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main + '10',
  },
  uploadIcon: {
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  selectButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '500',
  },
  previewSection: {
    margin: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.common.black,
  },
  imageCount: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageContainer: {
    width: Platform.OS === 'web' ? 150 : '30%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  actionButtonText: {
    marginLeft: 8,
    color: colors.primary.main,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
