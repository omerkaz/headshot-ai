import { HeadshotProfileImage } from '@/types/database.types';
import * as FileSystem from 'expo-file-system';
import { nanoid } from 'nanoid/non-secure';

const PROFILE_DIRECTORY = `${FileSystem.documentDirectory}headshot_profiles/`;
const METADATA_FILE = `${PROFILE_DIRECTORY}metadata.json`;

interface ImageMetadata {
  profiles: {
    [profileId: string]: HeadshotProfileImage[];
  };
}

class ProfileImageService {
  private async ensureDirectoryExists() {
    const dirInfo = await FileSystem.getInfoAsync(PROFILE_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(PROFILE_DIRECTORY, { intermediates: true });
      // Initialize metadata file
      await this.saveMetadata({ profiles: {} });
    }
  }

  private async getMetadata(): Promise<ImageMetadata> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(METADATA_FILE);
      if (!fileInfo.exists) {
        return { profiles: {} };
      }
      const content = await FileSystem.readAsStringAsync(METADATA_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading metadata:', error);
      return { profiles: {} };
    }
  }

  private async saveMetadata(metadata: ImageMetadata): Promise<void> {
    try {
      await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error saving metadata:', error);
      throw new Error('Failed to save metadata');
    }
  }

  private getProfileDirectory(profileId: string): string {
    return `${PROFILE_DIRECTORY}${profileId}/`;
  }

  async saveProfileImages(profileId: string, imageUris: string[]): Promise<HeadshotProfileImage[]> {
    try {
      await this.ensureDirectoryExists();

      // Create profile directory
      const profileDir = this.getProfileDirectory(profileId);
      await FileSystem.makeDirectoryAsync(profileDir, { intermediates: true });

      const metadata = await this.getMetadata();
      const now = new Date().toISOString();
      const newImages: HeadshotProfileImage[] = [];
      const createdFiles: string[] = [];

      try {
        // Process images one by one with progress tracking
        for (let i = 0; i < imageUris.length; i++) {
          const uri = imageUris[i];
          const imageId = nanoid();
          const fileName = `${imageId}.jpg`;
          const destinationUri = `${profileDir}${fileName}`;

          // Copy image to profile directory
          await FileSystem.copyAsync({
            from: uri,
            to: destinationUri,
          });

          createdFiles.push(destinationUri);
          newImages.push({
            id: imageId,
            profile_id: profileId,
            image_url: destinationUri,
            created_at: now,
          });
        }

        // Update metadata
        metadata.profiles[profileId] = [...(metadata.profiles[profileId] || []), ...newImages];
        await this.saveMetadata(metadata);

        return newImages;
      } catch (error) {
        // Cleanup on error
        await Promise.all(
          createdFiles.map(file =>
            FileSystem.deleteAsync(file, { idempotent: true }).catch(console.error)
          )
        );
        throw error;
      }
    } catch (error) {
      console.error('Error saving profile images:', error);
      throw new Error('Failed to save profile images');
    }
  }

  async getProfileImages(profileId: string): Promise<HeadshotProfileImage[]> {
    try {
      const metadata = await this.getMetadata();
      console.log('metadata', metadata);
      return metadata.profiles[profileId] || [];
    } catch (error) {
      console.error('Error getting profile images:', error);
      return [];
    }
  }

  async deleteImageOfProfile(profileId: string, imageId: string, imagePath: string): Promise<void> {
    try {
      // Get current metadata
      const metadata = await this.getMetadata();

      if (!imagePath) {
        throw new Error('Image not found in metadata');
      }

      // Remove the image from metadata
      metadata.profiles[profileId] = metadata.profiles[profileId].filter(img => img.id !== imageId);

      // Delete the actual file
      await FileSystem.deleteAsync(imagePath, { idempotent: true });

      // Save updated metadata
      await this.saveMetadata(metadata);
    } catch (error) {
      console.error('Error deleting profile image:', error);
      throw new Error('Failed to delete profile image');
    }
  }

  async deleteProfileImages(profileId: string): Promise<void> {
    try {
      const metadata = await this.getMetadata();
      const profileDir = this.getProfileDirectory(profileId);

      // Delete profile directory with all images
      await FileSystem.deleteAsync(profileDir, { idempotent: true });

      // Update metadata
      delete metadata.profiles[profileId];
      await this.saveMetadata(metadata);
    } catch (error) {
      console.error('Error deleting profile images:', error);
      throw new Error('Failed to delete profile images');
    }
  }

  async validateImage(uri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) return false;

      // Check if file size is less than 10MB
      if (fileInfo.size && fileInfo.size > 10 * 1024 * 1024) return false;

      return true;
    } catch (error) {
      console.error('Error validating image:', error);
      return false;
    }
  }
}

export const profileImageService = new ProfileImageService();
