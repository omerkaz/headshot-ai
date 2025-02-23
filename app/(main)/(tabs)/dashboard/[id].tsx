import { ImageGrid } from '@/components/elements/ImageGrid';
import { ImageModal } from '@/components/elements/ImageModal';
import { ProgressBar } from '@/components/elements/ProgressBar';
import { profileImageService } from '@/services/profileImageLocalStorage';
import { colors } from '@/theme';
import { ImageOfProfile } from '@/types/imageOfProfile';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileDetail() {
  const { id } = useLocalSearchParams();

  const [imagesOfProfile, setImagesOfProfile] = useState<ImageOfProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadProfileImages = async () => {
      const profileImages = await profileImageService.getProfileImages(id as string);
      setImagesOfProfile(profileImages);
    };
    loadProfileImages();
    setIsLoading(false);
  }, [id]);

  console.log('id', id);

  const handleImageRemove = async (profileId: string, imageId: string, imagePath: string) => {
    console.log('imageId', imageId);
    console.log('imagesOfProfile', imagesOfProfile);
    setImagesOfProfile(prev =>
      prev.filter(image => {
        console.log('image', image);
        console.log('image.id', image.id);
        console.log('imageId', imageId);
        return image.id !== imageId;
      })
    );
    await profileImageService.deleteImageOfProfile(profileId, imagePath, imageId);
  };

  const handleImageSelect = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const handleClearImages = () => {
    setImagesOfProfile([]);
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset: any) => asset.uri as string);
        const remainingImages = 30 - imagesOfProfile.length;
        const imagesToSave = newImages.slice(0, remainingImages);
        if (newImages.length > remainingImages) {
          Alert.alert('Error', 'You can only upload 30 images. Some images will not be saved.');
          return;
        }

        const newLocalSavedImages = await profileImageService.saveProfileImages(
          id as string,
          imagesToSave
        );
        setImagesOfProfile(prev => {
          const updatedImages = [...prev, ...newLocalSavedImages];
          return updatedImages.slice(0, 30);
        });
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  console.log('selectedImage', selectedImage);
  console.log('imagesOfProfile', imagesOfProfile);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ProgressBar imagesCount={imagesOfProfile.length} onClearImages={handleClearImages} />

      <ImageGrid
        imagesOfProfile={imagesOfProfile}
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
      />

      {imagesOfProfile.length < 30 && (
        <TouchableOpacity
          style={[styles.addButton, imagesOfProfile.length >= 30 && styles.addButtonDisabled]}
          onPress={handleImagePick}>
          <LinearGradient
            colors={[colors.accent1, colors.accent3]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1.8, y: 1 }}
            style={styles.gradientButton}>
            <Ionicons name="add" size={32} color={colors.accent2} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      <ImageModal visible={modalVisible} imageUri={selectedImage} onClose={handleModalClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
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
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
});
