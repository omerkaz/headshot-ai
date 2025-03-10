import { PreparedProfile } from '../types';
import { getProfile, updateProfileStatus } from './profileService';
import { createZip, uploadZipToStorage } from './zipService';

export const prepareProfileToLora = async (profileId: string, imagePaths: string[]): Promise<PreparedProfile > => {
  try {
    // Get profile data
    const profile = await getProfile(profileId);

    if (!profile.trigger_phrase) {
      console.warn('No trigger phrase found for profile, using default');
    }

    const triggerPhrase = profile.trigger_phrase 

    console.log(`Creating and uploading zip with ${imagePaths.length} images for profile ${profileId}`);

    // Create zip and upload to storage
    const zip = await createZip(profileId, imagePaths, triggerPhrase);
    const { publicUrl } = await uploadZipToStorage(zip.zipPath, profileId);
    console.log('publicUrl', publicUrl);
  
    // Update profile status to 'processing'
    await updateProfileStatus(profileId, 'processing');

    return {
      profileId,
      triggerPhrase,
      zipUrl: publicUrl
    };
  } catch (error) {
    console.error('Error in prepareProfileToLora:', error);
    
    // Update profile status to 'error'
    try {
      await updateProfileStatus(profileId, 'error');
    } catch (updateError) {
      console.error('Error updating profile status to error:', updateError);
    }
    
    throw new Error(`Failed to prepare profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 