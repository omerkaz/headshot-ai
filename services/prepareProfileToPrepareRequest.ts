import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { profileImageService } from './profileImageLocalStorage';

interface PreparedProfileResponse {
  success: boolean;
  error?: string;
}

const prepareProfileToPrepareRequest = async (profileId: string, triggerPhrase: string, onProgress: (progress: number) => void) => {
  try {
    const formData = new FormData();
    formData.append('profileId', profileId);
    formData.append('triggerPhrase', triggerPhrase);
    
    // Get profile images
    const images = await profileImageService.getProfileImages(profileId);
    console.log(`Found ${images.length} images for profile ${profileId}`);
    let progress = 0;
    // Add each image to the form data with a unique name
    for (let i = 0; i < images.length; i++) {
      const image = images[i].image_url;
      
      // Get file info to extract the file name and extension
      const fileInfo = await FileSystem.getInfoAsync(image);
      if(i === 0) console.log('fileInfo', fileInfo);
      const fileName = image.split('/').pop() || `image_${i + 1}.jpg`;
      if(i === 0) console.log('fileName', fileName);
      
      // Create a Blob-like object that FormData can handle
      // Note: React Native's FormData handles File/Blob differently than web
      const fileData = {
        uri: image,
        name: fileName,
        type: `image/${fileName.split('.').pop() || 'jpeg'}`,
      };
      // Append to form with a name that includes the index for proper ordering
      formData.append('images', fileData as any);
      console.log(`Added image ${i + 1}: ${fileName}`);
      progress++;
      onProgress(progress / images.length);
    }

    // Call the backend API to prepare the profile
    const API_URL = process.env.API_URL || 'http://localhost:3000';
    
    console.log(`Calling backend API to prepare profile ${profileId} with ${images.length} images`);
    console.log('formData', formData);
    // Pass the FormData in the request, with appropriate headers
    const response = await axios.post<PreparedProfileResponse>(
      `${API_URL}/api/profiles/${profileId}/prepare`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('response', response);
    if (response.status !== 200) {
      throw new Error(`Failed to prepare profile: ${response.statusText}`);
    }
    
    const result = response.data;
    
    if (!result.success) {
      throw new Error('Invalid response from server');
    }
    
    console.log('Profile prepared successfully:', result);
    
    return result;
  } catch (error) {
    console.error('Error in prepareProfileToLora:', error);
    throw new Error(`Failed to prepare profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default prepareProfileToPrepareRequest;
