import { supabase } from '@/services/initSupabase';
import { HeadshotProfile, HeadshotProfileImage } from '@/types/database.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys
export const profileKeys = {
  all: ['headshot_profiles'] as const,
  lists: () => [...profileKeys.all, 'list'] as const,
  list: (filters: string) => [...profileKeys.lists(), { filters }] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
};

// Fetch profiles
export const useProfiles = () => {
  return useQuery({
    queryKey: profileKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('headshot_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HeadshotProfile[];
    },
  });
};

// Fetch single profile
export const useProfile = (id: string) => {
  return useQuery({
    queryKey: profileKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('headshot_profiles')
        .select(`
          *,
          headshot_profile_images (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as HeadshotProfile & { headshot_profile_images: HeadshotProfileImage[] };
    },
    enabled: !!id,
  });
};

// Create profile
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProfile: Omit<HeadshotProfile, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('headshot_profiles')
        .insert(newProfile)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
    },
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<HeadshotProfile> & { id: string }) => {
      const { data, error } = await supabase
        .from('headshot_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
    },
  });
};

// Delete profile
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('headshot_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
    },
  });
};

// Add images to profile
export const useAddProfileImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profileId,
      imageUrls,
    }: {
      profileId: string;
      imageUrls: string[];
    }) => {
      const images = imageUrls.map(url => ({
        profile_id: profileId,
        image_url: url,
      }));

      const { data, error } = await supabase
        .from('headshot_profile_images')
        .insert(images)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(profileId) });
    },
  });
}; 