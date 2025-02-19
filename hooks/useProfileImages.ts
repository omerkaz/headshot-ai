import { useProfile } from '@/hooks/useProfiles';
import { profileImageService } from '@/services/profileService';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface UseProfileImagesReturn {
  imagePaths: string[];
  profileLoading: boolean;
  selectedImage: string | null;
  modalVisible: boolean;
  handleImagePick: () => Promise<void>;
  handleImageRemove: (index: number) => void;
  handleImageSelect: (uri: string) => void;
  handleModalClose: () => void;
  handleClearImages: () => void;
  handleSave: () => Promise<void>;
}

export function useProfileImages(profileId: string): UseProfileImagesReturn {
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const { data: profile, isLoading: profileLoading } = useProfile(profileId);
  console.log('profile', profile);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileImages = await profileImageService.getProfileImages(profileId);
      console.log(
        'profileImages',
        profileImages.map(image => image)
      );
      setImagePaths(profileImages.map(image => image.image_url));
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        setImagePaths(prev => {
          const updatedImages = [...prev, ...newImages];
          return updatedImages.slice(0, 30);
        });
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const handleImageRemove = (index: number) => {
    setImagePaths(prev => prev.filter((_, i) => i !== index));
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
    setImagePaths([]);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Here you would typically upload images to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Images saved successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error saving images:', error);
      Alert.alert('Error', 'Failed to save images');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    imagePaths,
    profileLoading,
    selectedImage,
    modalVisible,
    handleImagePick,
    handleImageRemove,
    handleImageSelect,
    handleModalClose,
    handleClearImages,
    handleSave,
  };
}
