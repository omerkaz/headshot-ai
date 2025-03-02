import { HeadshotProfile } from '@/types/database.types';
import { fal } from '@fal-ai/client';
import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import { supabase } from './initSupabase';
import { profileImageService } from './profileImageLocalStorage';

// Function to get profile data
const getProfile = async (profileId: string): Promise<HeadshotProfile> => {
  const { data, error } = await supabase
    .from('headshot_profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) throw error;
  return data as HeadshotProfile;
};

// Function to create and upload a zip file
const createAndUploadZip = async (images: { image_url: string }[], triggerPhrase: string): Promise<string> => {
  try {
    const zip = new JSZip();

    console.log(`Starting to create zip with ${images.length} images`);

    // Add each image to the zip
    for (let i = 0; i < images.length; i++) {
      const imageUri = images[i].image_url;
      
      try {
        // Read the image file as base64
        const imageData = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Verify image data
        if (!imageData) {
          throw new Error(`No data received for image ${i + 1}`);
        }

        console.log(`Image ${i + 1} size: ${imageData.length} bytes`);

        // Add to zip with a simple filename
        const fileName = `image_${i + 1}.jpg`;
        zip.file(fileName, imageData, { base64: true });

        console.log(`Added ${fileName} to zip`);
      } catch (error) {
        console.error(`Error processing image ${i + 1}:`, error);
        throw error;
      }
    }

    // Generate zip as base64
    console.log('Generating zip file...');
    const zipContent = await zip.generateAsync({ 
      type: 'base64',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // Verify zip content
    if (!zipContent) {
      throw new Error('Generated zip content is empty');
    }

    // Validate the generated zip file
    const isValidZip = await validateZipFile(zipContent);
    if (!isValidZip) {
      throw new Error('Validation of generated zip file failed');
    }

    console.log(`Generated zip size: ${zipContent.length} bytes`);

    // Create a File object from the blob
    const zipFile = new File([zipContent], `${triggerPhrase}_training_images.zip`, { type: 'application/zip' });

    console.log('Uploading zip file to fal.storage...');
    const zipUrl = await fal.storage.upload(zipFile);
    console.log('Zip file uploaded successfully to:', zipUrl);

    // Verify the uploaded file is accessible
    try {
      const response = await fetch(zipUrl);
      if (!response.ok) {
        throw new Error(`Failed to verify uploaded zip file: ${response.statusText}`);
      }
      console.log('Uploaded zip file verified successfully');
    } catch (error) {
      console.error('Error verifying uploaded zip:', error);
      throw error;
    }

    return zipUrl;
  } catch (error) {
    console.error('Error in createAndUploadZip:', error);
    throw new Error(`Failed to create and upload zip file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const validateZipFile = async (zipBase64: string): Promise<boolean> => {
  try {
    const zip = await JSZip.loadAsync(zipBase64, { base64: true });
    const fileCount = Object.keys(zip.files).length;
    if (fileCount === 0) {
      throw new Error('Zip file is empty.');
    }
    console.log(`Zip file validation successful: contains ${fileCount} files.`);
    return true;
  } catch (error) {
    console.error('Zip file validation failed:', error);
    return false;
  }
};

const prepareProfileToLora = async (profileId: string) => {
  try {
    const profile = await getProfile(profileId);

    if (!profile.trigger_phrase) {
      console.warn('No trigger phrase found for profile, using default');
    }

    const triggerPhrase = profile.trigger_phrase;

    // Get profile images
    const images = await profileImageService.getProfileImages(profileId);

    if (images.length === 0) {
      throw new Error('No images found for this profile');
    }

    console.log(`Creating and uploading zip with ${images.length} images for profile ${profileId}`);

    // Create zip and upload to fal.storage
    const zipUrl = await createAndUploadZip(images, triggerPhrase);

    // Create a custom prompt
    const customPrompt = 'A professional headshot photo, high quality, detailed features, studio lighting';
    const prompt = `${triggerPhrase} ${customPrompt}`.trim();

    console.log(`Generating headshot with trigger phrase: ${triggerPhrase}`);

    const inputsForLora = {
      images_data_url: zipUrl,  // Use the fal.storage URL
      trigger_phrase: triggerPhrase,
      steps: 1500,
      resume_from_checkpoint: '',
      prompt: prompt,
      num_images: 1,
    };

    return inputsForLora;
  } catch (error) {
    console.error('Error preparing profile for Lora:', error);
    throw error;
  }
};

export default prepareProfileToLora;
