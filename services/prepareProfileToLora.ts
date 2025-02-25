import { HeadshotProfile } from '@/types/database.types';
import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import { profileImageService } from './profileImageLocalStorage';

// Function to get profile data
const getProfile = async (profileId: string): Promise<HeadshotProfile> => {
  // This is a placeholder - implement actual profile fetching logic
  // For example, you might fetch this from a database or API
  throw new Error('getProfile function not implemented');
};

// Function to create a zip archive from local images
const createImagesZip = async (profileId: string, triggerPhrase: string): Promise<string> => {
  try {
    // Get profile images from local storage
    const images = await profileImageService.getProfileImages(profileId);

    if (images.length === 0) {
      throw new Error('No images found for this profile');
    }

    console.log(`Creating zip with ${images.length} images for profile ${profileId}`);

    // Create a new JSZip instance
    const zip = new JSZip();

    // Add each image to the zip
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageUri = image.image_url;

      // Validate the image
      const isValid = await profileImageService.validateImage(imageUri);
      if (!isValid) {
        console.warn(`Skipping invalid image: ${imageUri}`);
        continue;
      }

      // Read the image file
      const imageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Add image to zip
      const fileName = `${triggerPhrase}_${i + 1}.jpg`;
      zip.file(fileName, imageData, { base64: true });
    }

    // Generate the zip file
    const zipContent = await zip.generateAsync({ type: 'base64' });

    // Save the zip file temporarily
    const zipPath = `${FileSystem.cacheDirectory}profile_${profileId}_images.zip`;
    await FileSystem.writeAsStringAsync(zipPath, zipContent, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert to data URL
    const dataUrl = `data:application/zip;base64,${zipContent}`;

    console.log(`Created zip archive for profile ${profileId}`);
    return dataUrl;
  } catch (error) {
    console.error('Error creating images zip:', error);
    throw new Error('Failed to create images zip');
  }
};

const prepareProfileToLora = async (profileId: string) => {
  try {
    const profile = await getProfile(profileId);

    // Ensure we have a trigger phrase
    if (!profile.trigger_phrase) {
      console.warn('No trigger phrase found for profile, using default');
    }

    const triggerPhrase = profile.trigger_phrase;

    // Create zip archive with images
    const imagesDataUrl = await createImagesZip(profileId, triggerPhrase);

    // Create a custom prompt for the headshot generation
    const customPrompt =
      'A professional headshot photo, high quality, detailed features, studio lighting';

    const prompt = `
      ${triggerPhrase}
      ${customPrompt}
    `;

    console.log(`Generating headshot with trigger phrase: ${triggerPhrase}`);

    const inputsForLora = {
      images_data_url: imagesDataUrl,
      trigger_phrase: triggerPhrase,
      steps: 1500,
      resume_from_checkpoint: 'latest',
      prompt: prompt,
      num_images: 1,
    };
    // const headshot = await generateHeadshot({
    //   images_data_url: imagesDataUrl,
    //   trigger_phrase: triggerPhrase,
    //   steps: 1500,
    //   resume_from_checkpoint: 'latest',
    //   prompt: prompt,
    //   num_images: 1,
    // });

    return inputsForLora;
  } catch (error) {
    console.error('Error preparing profile for Lora:', error);
    throw error;
  }
};

export default prepareProfileToLora;
