import { ImageModal } from '@/components/elements/ImageModal';
import { NewProfileImageGrid } from '@/components/elements/NewProfileImageGrid';
import { ProfileNameBottomSheet } from '@/components/elements/ProfileNameBottomSheet';
import { ProgressBar } from '@/components/elements/ProgressBar';
import { supabase } from '@/services/initSupabase';
import { profileImageService } from '@/services/profileImageLocalStorage';
import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        // Validate images before adding
        const validImages = await Promise.all(
          result.assets.map(async asset => {
            const isValid = await profileImageService.validateImage(asset.uri);
            return isValid ? asset.uri : null;
          })
        );

        const filteredImages = validImages.filter((uri): uri is string => uri !== null);

        setImages(prev => {
          const updatedImages = [...prev, ...filteredImages];
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

      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) {
        throw new Error('User not authenticated');
      }
      const userId = user.data.user.id;

      // Create the profile first (without trigger phrase initially)
      const { data: profile, error: profileError } = await supabase
        .from('headshot_profiles')
        .insert({
          name: name,
          status: 'not_ready', // Or 'training' if training starts immediately
          user_id: userId,
          // trigger_phrase is initially null or omitted
          total_images: images.length,
        })
        .select()
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Profile creation failed, returned null.');

      const profileId = profile.id;

      // Generate the unique trigger phrase
      const generatedTriggerPhrase = `${profileId.slice(0, 8)}`; // Example format

      // Update the profile with the generated trigger phrase
      const { error: updateError } = await supabase
        .from('headshot_profiles')
        .update({ trigger_phrase: generatedTriggerPhrase })
        .eq('id', profileId);

      if (updateError) {
        // Optional: Attempt to clean up if update fails? Or just log error.
        console.error('Failed to update profile with trigger phrase:', updateError);
        throw updateError; // Re-throw to indicate overall failure
      }

      // Save images locally (associating with profileId)
      const savedImages = await profileImageService.saveProfileImages(profileId, images);
      console.log('Saved images:', savedImages);
      console.log(`Profile ${profileId} created with trigger: ${generatedTriggerPhrase}`);

      // Success handling
      setIsBottomSheetOpen(false);
      setImages([]);
      setProfileName('');

      router.push('/dashboard');

      Alert.alert('Success', 'Profile created successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ProgressBar imagesCount={images.length} onClearImages={() => setImages([])} />

      <NewProfileImageGrid
        onAddImage={handleImagePick}
        images={images}
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
      />

      {images.length < 30 && (
        <TouchableOpacity
          style={[styles.addButton, images.length >= 30 && styles.addButtonDisabled]}
          onPress={handleImagePick}>
          <LinearGradient
            colors={[colors.text, colors.accent2]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1.8, y: 1 }}
            style={styles.gradientButton}>
            <Ionicons name="add" size={32} color={colors.common.white} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {images.length >= 10 && (
        <TouchableOpacity style={[styles.saveButton]} onPress={handleSavePress}>
          <LinearGradient
            colors={[colors.text, colors.accent2]}
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
        isLoading={profileLoading}
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
