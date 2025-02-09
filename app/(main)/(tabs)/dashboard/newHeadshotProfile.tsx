import { ImageGrid } from '@/components/elements/ImageGrid';
import { ImageModal } from '@/components/elements/ImageModal';
import { ProfileNameBottomSheet } from '@/components/elements/ProfileNameBottomSheet';
import { ProgressBar } from '@/components/elements/ProgressBar';
import { profileService } from '@/services/profileService';
import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ProfileDetail() {
  const [images, setImages] = useState<string[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [profileName, setProfileName] = useState('');

  console.log('images', images);
  console.log('selectedImage', selectedImage);
  console.log('modalVisible', modalVisible);

  const handleImagePick = async () => {
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
          return updatedImages.slice(0, 30);
        });
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const handleImageSelect = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const handleImageRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSavePress = () => {
    if (images.length < 10) {
      Alert.alert('Not Enough Images', 'Please select at least 10 images to continue.');
      return;
    }
    setIsBottomSheetOpen(true);
  };

  const handleProfileSave = async (name: string) => {
    try {
      setProfileLoading(true);

      // Convert image URIs to base64
      const base64Images = await Promise.all(
        images.map(async uri => {
          const response = await fetch(uri);
          const blob = await response.blob();
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
      );

      // TODO: Create profile in Supabase and get the ID
      const tempProfileId = 'temp-id'; // This will come from Supabase later

      // Save images locally
      await profileService.saveProfileImages(tempProfileId, base64Images);

      // Close bottom sheet and clear form
      setIsBottomSheetOpen(false);
      setImages([]);
      setProfileName('');

      // Show success message
      Alert.alert('Success', 'Images saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // TODO: Navigate to profile detail or list
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving images:', error);
      Alert.alert('Error', 'Failed to save images. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ProgressBar imagesCount={images.length} onClearImages={() => setImages([])} />

      <ImageGrid
        images={images}
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
      />

      {images.length < 30 && (
        <TouchableOpacity
          style={[styles.addButton, images.length >= 30 && styles.addButtonDisabled]}
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

      {images.length >= 10 && (
        <TouchableOpacity style={[styles.saveButton]} onPress={handleSavePress}>
          <LinearGradient
            colors={[colors.accent1, colors.accent3]}
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: 0 }}
            style={styles.gradientButton}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <ImageModal visible={modalVisible} imageUri={selectedImage} onClose={handleModalClose} />

      <ProfileNameBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onSave={handleProfileSave}
        imagesCount={images.length}
      />
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
    color: colors.text,
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
  saveButton: {
    position: 'absolute',
    bottom: 100,
    right: 100,
    height: 56,
    width: 120,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
