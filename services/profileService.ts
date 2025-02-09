import { HeadshotProfileImage } from '@/types/database.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';

const IMAGES_KEY = '@headshot_profile_images';

class ProfileService {
  private async getStoredImages(): Promise<HeadshotProfileImage[]> {
    try {
      const data = await AsyncStorage.getItem(IMAGES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting stored images:', error);
      return [];
    }
  }

  private async saveImages(images: HeadshotProfileImage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(IMAGES_KEY, JSON.stringify(images));
    } catch (error) {
      console.error('Error saving images:', error);
      throw new Error('Failed to save images');
    }
  }

  async saveProfileImages(
    profileId: string,
    imageBase64s: string[]
  ): Promise<HeadshotProfileImage[]> {
    try {
      const storedImages = await this.getStoredImages();
      const now = new Date().toISOString();

      // Create new image entries
      const newImages: HeadshotProfileImage[] = imageBase64s.map(base64 => ({
        id: nanoid(),
        profile_id: profileId,
        image_url: base64,
        created_at: now,
      }));

      // Save images
      await this.saveImages([...storedImages, ...newImages]);
      return newImages;
    } catch (error) {
      console.error('Error saving profile images:', error);
      throw new Error('Failed to save profile images');
    }
  }

  async getProfileImages(profileId: string): Promise<HeadshotProfileImage[]> {
    const images = await this.getStoredImages();
    return images.filter(img => img.profile_id === profileId);
  }

  async deleteProfileImages(profileId: string): Promise<void> {
    const images = await this.getStoredImages();
    await this.saveImages(images.filter(image => image.profile_id !== profileId));
  }
}

export const profileService = new ProfileService();
