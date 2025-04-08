import { supabase } from '@/services/initSupabase';
import { colors } from '@/theme/colors';
import { GenerateImageInput, HeadshotProfile, ProfileValues } from '@/types/database.types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  size: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  style: 'realistic' | 'artistic' | 'anime' | 'portrait';
}

export default function GenerateImage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentProfile, setCurrentProfile] = useState<HeadshotProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileImages = async () => {
      const { data, error } = await supabase
        .from('headshot_profiles')
        .select('*')
        .eq('id', id as string);
      if (error) {
        console.error('Error loading profile:', error);
      } else {
        console.log('Current Profile', data);
        setCurrentProfile(data[0]);
      }
    };
    loadProfileImages();
    setIsLoading(false);
  }, [id]);

  //   useEffect(() => {
  //     const loadProfileImages = async () => {
  //       const { data, error } = await supabase
  //         .from('headshot_profiles_generated_images')
  //         .select('*')
  //         .eq('profile_id', profileId as string);
  //       console.log('data', data);
  //       if (error) {
  //         console.error('Error loading profile:', error);
  //       } else {
  //         console.log('data', data);
  //         setCurrentProfile(data[0]);
  //       }
  //     };
  //     loadProfileImages();
  //     setIsLoading(false);
  //   }, [profileId]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [params, setParams] = useState<GenerationParams>({
    prompt: '',
    negativePrompt: 'bad quality, blur, distortion',
    size: '1:1',
    style: 'realistic',
  });

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      if (!currentProfile) {
        console.error('Current profile not found');
        return;
      }
      const profileValues: ProfileValues = {
        triggerPhrase: currentProfile.trigger_phrase,
        profileId: currentProfile.id,
      };
      const generateImageInput: GenerateImageInput = {
        profileValues,
        weightUrl: currentProfile.weight_url!,
      };
      console.log('generateImageInput', generateImageInput);

      const response = await fetch('http://localhost:3000/api/headshot-profiles/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generateImageInput),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('data', data);
        setGeneratedImage(data.image_url);
      } else {
        console.error('Error generating image:', data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const sizeOptions: { label: string; value: GenerationParams['size'] }[] = [
    { label: 'Square', value: '1:1' },
    { label: 'Portrait', value: '3:4' },
    { label: 'Landscape', value: '4:3' },
    { label: 'Story', value: '9:16' },
    { label: 'Wide', value: '16:9' },
  ];

  const styleOptions: { label: string; value: GenerationParams['style'] }[] = [
    { label: 'Realistic', value: 'realistic' },
    { label: 'Artistic', value: 'artistic' },
    { label: 'Anime', value: 'anime' },
    { label: 'Portrait', value: 'portrait' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        {currentProfile && (
          <View style={styles.profileInfoContainer}>
            <View style={styles.profileIconContainer}>
              <Ionicons name="person-circle-outline" size={36} color={colors.text} />
            </View>
            <View>
              <Text style={styles.profileName}>{currentProfile.name}</Text>
              <Text style={styles.profileStatus}>Ready to generate</Text>
            </View>
          </View>
        )}

        {/* Image Preview */}
        <View style={styles.previewContainer}>
          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent2} />
              <Text style={styles.loadingText}>Generating your image...</Text>
            </View>
          ) : generatedImage ? (
            <Image source={{ uri: generatedImage }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={64} color={colors.grey[300]} />
              <Text style={styles.placeholderText}>Your image will appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Pressable
          style={styles.generateButton}
          onPress={handleGenerate}
          disabled={isGenerating}
          android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}>
          <LinearGradient
            colors={['#6366f1', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBackground}>
            {isGenerating ? (
              <ActivityIndicator size="small" color={colors.common.white} />
            ) : (
              <Text style={styles.generateButtonText}>Generate Image</Text>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileIconContainer: {
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  profileStatus: {
    fontSize: 14,
    color: colors.status.success,
    marginTop: 4,
  },
  previewContainer: {
    aspectRatio: 1,
    backgroundColor: colors.common.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: colors.grey[600],
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    marginTop: 16,
    color: colors.grey[500],
    fontSize: 16,
  },
  actionContainer: {
    padding: 16,
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientBackground: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
