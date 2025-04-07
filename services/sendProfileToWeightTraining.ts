import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { profileImageService } from './profileImageLocalStorage';

// Define the interface for the successful 202 response body
interface PrepareProfileSuccessResponse {
  success: true; // success is always true for a 202 response
  message: string; // message is always present
  requestId: string; // requestId is always present
}

const sendProfileToWeightTraining = async (profileId: string, triggerPhrase: string, onProgress?: (progress: number) => void) => {
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
      onProgress && onProgress(progress / images.length);
    }

    // Call the backend API to prepare the profile
    const API_URL = process.env.API_URL || 'http://localhost:3000';
    
    console.log(`Calling backend API to prepare profile ${profileId} with ${images.length} images`);
    console.log('formData', formData);
    // Pass the FormData in the request, with appropriate headers
    const response = await axios.post<PrepareProfileSuccessResponse>(
      `${API_URL}/api/headshot-profiles/create-weight`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('response', response.data);
    if (response.status !== 202) {
      throw new Error(`Failed to prepare profile: ${response.data.message}`);
    }
    
    const result = response.data;
    
    if (!result.success) {
      throw new Error('Invalid response from server');
    }
    
    console.log('Profile prepared successfully:', result);
    
    return result;
  } catch (error) {
    console.error('Error preparing profile:', error);

    let errorMessage = 'Unknown error during profile preparation';
    if (axios.isAxiosError(error)) {
        if (error.response) {
            console.error('API Error Response:', error.response.data);
            console.error('API Error Status:', error.response.status);
            errorMessage = error.response.data?.error || `API Error: Status ${error.response.status}`;
        } else if (error.request) {
            console.error('Network Error:', error.request);
            errorMessage = 'Network error: No response received from server.';
        } else {
            errorMessage = `Request setup error: ${error.message}`;
        }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(`Failed to prepare profile: ${errorMessage}`);
  }
};

export default sendProfileToWeightTraining;

export type { PrepareProfileSuccessResponse };
