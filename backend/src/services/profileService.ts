import { HeadshotProfile, ProfileImage } from '../types';
import { supabaseAdmin } from './supabase';

export const getProfile = async (profileId: string): Promise<HeadshotProfile> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('headshot_profiles')
      .select('*')
      .eq('id', profileId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    if (!data) {
      const notFoundError = new Error(`Profile with ID ${profileId} not found`);
      notFoundError.name = 'ProfileNotFoundError';
      throw notFoundError;
    }

    return data as HeadshotProfile;
  } catch (error) {
    if (error instanceof Error && error.name === 'ProfileNotFoundError') {
      throw error;
    }
    console.error('Error in getProfile:', error);
    throw new Error(
      `Failed to fetch profile: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const getProfileImages = async (profileId: string): Promise<ProfileImage[]> => {
  const { data, error } = await supabaseAdmin
    .from('headshot_profile_images')
    .select('*')
    .eq('profile_id', profileId);

  if (error) {
    console.error('Error fetching profile images:', error);
    throw new Error(`Failed to fetch profile images: ${error.message}`);
  }

  return data as ProfileImage[];
};

export const getImagesGroupedByProfile = async (profileIds: string[]): Promise<Record<string, ProfileImage[]>> => {
  // If no profile IDs provided, return empty object
  if (!profileIds.length) {
    return {};
  }

  const { data, error } = await supabaseAdmin
    .from('headshot_profile_images')
    .select('*')
    .in('profile_id', profileIds);

  if (error) {
    console.error('Error fetching grouped profile images:', error);
    throw new Error(`Failed to fetch grouped profile images: ${error.message}`);
  }

  // Group the images by profile_id
  const groupedImages: Record<string, ProfileImage[]> = {};
  
  for (const image of data as ProfileImage[]) {
    if (!groupedImages[image.profile_id]) {
      groupedImages[image.profile_id] = [];
    }
    groupedImages[image.profile_id].push(image);
  }

  return groupedImages;
};

export const getImagesGroupedByProfileDB = async (profileIds: string[]): Promise<Record<string, ProfileImage[]>> => {
  // If no profile IDs provided, return empty object
  if (!profileIds.length) {
    return {};
  }

  // Temporarily use the JS implementation instead of the RPC function
  const { data, error } = await supabaseAdmin
    .from('headshot_profile_images')
    .select('*')
    .in('profile_id', profileIds);

  if (error) {
    console.error('Error fetching grouped profile images:', error);
    throw new Error(`Failed to fetch grouped profile images: ${error.message}`);
  }

  // Group the images by profile_id
  const groupedImages: Record<string, ProfileImage[]> = {};
  
  for (const image of data as ProfileImage[]) {
    if (!groupedImages[image.profile_id]) {
      groupedImages[image.profile_id] = [];
    }
    groupedImages[image.profile_id].push(image);
  }

  return groupedImages;
};

export const updateProfileStatus = async (profileId: string, status: string): Promise<void> => {
  const { error } = await supabaseAdmin   
    .from('headshot_profiles')
    .update({ status: status })
    .eq('id', profileId);

  if (error) {
    console.error('Error updating profile status:', error);
    throw new Error(`Failed to update profile status: ${error.message}`);
  }
}; 