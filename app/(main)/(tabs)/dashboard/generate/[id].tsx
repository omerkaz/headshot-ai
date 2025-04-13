import { supabase } from '@/services/initSupabase';
import { colors } from '@/theme/colors';
import { GenerateImageInput, HeadshotProfile, ProfileValues } from '@/types/database.types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  size: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  style: 'realistic' | 'artistic' | 'anime' | 'portrait';
}

export default function GenerateImage() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [currentProfile, setCurrentProfile] = useState<HeadshotProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyImages, setHistoryImages] = useState<string[]>([]);
  const previewScale = useSharedValue(1);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('headshot_profiles')
        .select('*')
        .eq('id', id as string);
      if (error) throw error;

      if (data && data.length > 0) {
        setCurrentProfile(data[0]);
      } else {
        setError('Profile not found');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsGenerating(true);
      setError(null);

      if (!currentProfile) {
        throw new Error('Current profile not found');
      }

      const profileValues: ProfileValues = {
        triggerPhrase: currentProfile.trigger_phrase,
        profileId: currentProfile.id,
      };

      const generateImageInput: GenerateImageInput = {
        profileValues,
        weightUrl: currentProfile.weight_url!,
      };
      const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);
      console.log('token', token);
      const response = await fetch('http://localhost:3000/api/headshot-profiles/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(generateImageInput),
      });
      console.log('response', response);
      const data = await response.json();

      if (response.ok) {
        setGeneratedImage(data.image_url);
        if (data.image_url) {
          setHistoryImages(prev => [data.image_url, ...prev]);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        throw new Error(data.message || 'Error generating image');
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message || 'Failed to generate image');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveImage = async () => {
    if (!generatedImage) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        url: generatedImage,
        message: 'Check out my AI-generated headshot!',
      });
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const handleImagePress = () => {
    previewScale.value = withSpring(previewScale.value === 1 ? 1.05 : 1);
  };

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: previewScale.value }],
    };
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent2} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (error && !currentProfile) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={colors.status.error} />
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Pressable
          style={styles.tryAgainButton}
          onPress={loadProfile}
          android_ripple={{ color: 'rgba(0,0,0,0.1)' }}>
          <Text style={styles.tryAgainText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        {currentProfile && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.profileInfoContainer}>
            <View style={styles.profileIconContainer}>
              <LinearGradient
                colors={['#6366f1', '#3b82f6']}
                style={styles.profileIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Ionicons name="person" size={24} color={colors.common.white} />
              </LinearGradient>
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{currentProfile.name}</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.profileStatus}>Ready to generate</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Image Preview */}
        <View style={[styles.previewContainer, { width: width - 32 }]}>
          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent2} />
              <Text style={styles.loadingText}>Crafting your perfect headshot...</Text>
              <Text style={styles.loadingSubtext}>This may take a moment</Text>
            </View>
          ) : generatedImage ? (
            <Pressable onPress={handleImagePress}>
              <Animated.Image
                source={{ uri: generatedImage }}
                style={[styles.previewImage, animatedImageStyle]}
                resizeMode="cover"
              />
            </Pressable>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={64} color={colors.grey[300]} />
              <Text style={styles.placeholderText}>Your headshot will appear here</Text>
              <Text style={styles.placeholderSubtext}>Press generate to create</Text>
            </View>
          )}
        </View>

        {error && (
          <Animated.View entering={SlideInDown.duration(300)} style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={20} color={colors.common.white} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </Animated.View>
        )}

        {/* History */}
        {historyImages.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Generation History</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.historyList}>
              {historyImages.map((img, index) => (
                <Pressable
                  key={index}
                  style={styles.historyItem}
                  onPress={() => setGeneratedImage(img)}>
                  <Image source={{ uri: img }} style={styles.historyImage} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {generatedImage ? (
          <View style={styles.actionButtonsRow}>
            <Pressable
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleGenerate}
              disabled={isGenerating}
              android_ripple={{ color: 'rgba(0,0,0,0.1)' }}>
              <Ionicons name="refresh" size={20} color={colors.accent2} />
              <Text style={styles.secondaryButtonText}>New</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handleSaveImage}
              disabled={isGenerating}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}>
              <LinearGradient
                colors={['#6366f1', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBackground}>
                <Ionicons name="share-outline" size={20} color={colors.common.white} />
                <Text style={styles.generateButtonText}>Share</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.generateButton}
            onPress={handleGenerate}
            disabled={isGenerating}
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}>
            <LinearGradient
              colors={['#6366f1', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBackground}>
              {isGenerating ? (
                <ActivityIndicator size="small" color={colors.common.white} />
              ) : (
                <>
                  <Ionicons
                    name="sparkles-outline"
                    size={20}
                    color={colors.common.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.generateButtonText}>Generate Headshot</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileIconContainer: {
    marginRight: 16,
  },
  profileIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.success,
    marginRight: 6,
  },
  profileStatus: {
    fontSize: 14,
    color: colors.status.success,
  },
  previewContainer: {
    aspectRatio: 1,
    backgroundColor: colors.common.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: colors.grey[700],
    fontSize: 16,
    fontWeight: '500',
  },
  loadingSubtext: {
    marginTop: 8,
    color: colors.grey[500],
    fontSize: 14,
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
    fontWeight: '500',
  },
  placeholderSubtext: {
    marginTop: 8,
    color: colors.grey[400],
    fontSize: 14,
  },
  actionContainer: {
    padding: 16,
    marginBottom: 40,
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
  },
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientBackground: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: 8,
  },
  generateButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButton: {
    flex: 2,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.grey[100],
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondaryButtonText: {
    color: colors.accent2,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.grey[600],
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  tryAgainButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.grey[200],
    borderRadius: 8,
  },
  tryAgainText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  errorBanner: {
    backgroundColor: colors.status.error,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorBannerText: {
    color: colors.common.white,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  historySection: {
    marginTop: 8,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  historyList: {
    paddingVertical: 4,
  },
  historyItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.grey[200],
  },
  historyImage: {
    width: '100%',
    height: '100%',
  },
});
