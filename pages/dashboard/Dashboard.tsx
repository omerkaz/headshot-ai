import ProgressModal from '@/components/elements/ProgressModal';
import ProfileCard from '@/components/ProfileCard';
import { supabase } from '@/services/initSupabase';
import sendProfileToWeightTraining from '@/services/sendProfileToWeightTraining';
import { colors } from '@/theme/colors';
import { HeadshotProfile } from '@/types/database.types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
type TabType = 'not_ready' | 'ready' | 'getting_ready';

const Dashboard = () => {
  const [profiles, setProfiles] = useState<HeadshotProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('not_ready');

  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submissionProgress, setSubmissionProgress] = useState<number>(0);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true); // Set loading true when starting fetch
    setError(null); // Clear previous errors
    try {
      const { data, error } = await supabase
        .from('headshot_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const navigateToProfile = (id: string, status: string) => {
    router.push(`/dashboard/${id}?status=${status}`);
  };

  const navigateToGenerateImage = (id: string) => {
    router.push(`/dashboard/generate/${id}`);
  };

  const createNewProfile = () => {
    router.push('/dashboard/newHeadshotProfile');
  };

  const handleDelete = async (profileId: string) => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this profile? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(profileId);
              const { error } = await supabase
                .from('headshot_profiles')
                .delete()
                .eq('id', profileId);

              if (error) throw error;

              // Update the local state to remove the deleted profile
              setProfiles(profiles.filter(profile => profile.id !== profileId));
            } catch (err) {
              console.error('Error deleting profile:', err);
              Alert.alert('Error', 'Failed to delete profile. Please try again.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const submitProfile = async (profileId: string, triggerPhrase: string) => {
    let progressInterval: NodeJS.Timeout | null = null; // Store interval ID
    try {
      console.log('triggerPhrase', triggerPhrase);
      console.log('profileId', profileId);

      setSubmittingId(profileId);
      setSubmissionProgress(0); // Reset progress
      setSubmissionSuccess(false); // Reset success state

      // Start simulating progress
      progressInterval = setInterval(() => {
        // Update progress, ensuring it doesn't exceed 1
        setSubmissionProgress(prevProgress => prevProgress + 0.05);
      }, 1000); // Update progress every 300ms

      console.log('Submitting profile:', profileId, 'with trigger:', triggerPhrase);

      const preparedProfile = await sendProfileToWeightTraining(profileId, triggerPhrase);
      console.log('preparedProfile', preparedProfile);

      // // Mock asynchronous request with a delay
      // const preparedProfile = await new Promise<{ success: boolean }>(resolve => {
      //   setTimeout(() => {
      //     resolve({ success: true }); // Resolve the promise with 'true' after the delay
      //   }, 4000); // Mock delay of 3 seconds
      // });

      if (preparedProfile.success) {
        setSubmissionProgress(1);
        setSubmissionSuccess(true);

        setTimeout(() => {
          setSubmissionSuccess(false);
          setSubmittingId(null);
        }, 3000);

        fetchProfiles();
      } else {
        throw new Error('Profile preparation result was not successful');
      }
    } catch (err) {
      console.error('Error submitting profile:', err);
      Alert.alert('Error', 'Failed to submit profile for processing. Please try again.');
      setSubmissionProgress(0); // Reset progress on error
      setSubmittingId(null);
      setSubmissionSuccess(false);
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval); // Clear the interval
      }
    }
  };

  const filteredProfiles = useMemo(
    () =>
      profiles.filter(profile => {
        if (activeTab === 'ready') {
          return profile.status === 'ready';
        }
        if (activeTab === 'getting_ready') {
          return profile.status === 'getting_ready';
        }
        // if (activeTab === 'failed') {
        //   return profile.status === 'failed';
        // }
        if (activeTab === 'not_ready') {
          return profile.status === 'not_ready';
        }
      }),
    [profiles, activeTab]
  );

  const TabButton = ({ type, label }: { type: TabType; label: string }) => (
    <Pressable
      style={[styles.tabButton, activeTab === type && styles.activeTabButton]}
      onPress={() => setActiveTab(type)}>
      {activeTab === type && (
        <LinearGradient
          colors={
            type === 'ready'
              ? ['#10b981', '#059669']
              : type === 'getting_ready'
                ? ['#8b5cf6', '#ec4899']
                : ['#6366f1', '#3b82f6']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.tabGradient]}
        />
      )}
      <Text
        style={[
          styles.tabButtonText,
          activeTab === type && styles.activeTabButtonText,
          type === 'getting_ready' && styles.tabButtonTextGettingReady,
        ]}>
        {label}
      </Text>
    </Pressable>
  );

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error fetching profiles: {error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchProfiles}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.cardsContainer}>
          {/* Create New Profile Card */}
          <Pressable
            style={[styles.createCard]}
            onPress={createNewProfile}
            android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}>
            <LinearGradient
              colors={[colors.text, colors.accent2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 2, y: 0 }}
              style={styles.createCardGradient}
            />
            <View style={styles.cardContent}>
              <View style={styles.createIconContainer}>
                <Ionicons name="add-circle" size={40} color={colors.text} />
              </View>
              <Text style={styles.createCardTitle}>Create New Profile</Text>
              <Text style={styles.createCardSubtitle}>Upload photos to generate AI headshots</Text>
            </View>
          </Pressable>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TabButton type="not_ready" label="Not Ready" />
            <TabButton type="getting_ready" label="Getting Ready" />
            <TabButton type="ready" label="Ready" />
          </View>

          {loading ? (
            <View style={[styles.container, styles.centerContent]}>
              <ActivityIndicator size="large" color={colors.accent2} />
            </View>
          ) : filteredProfiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={60} color={colors.grey[400]} />
              <Text style={styles.emptyStateText}>
                No{' '}
                {activeTab === 'ready'
                  ? 'ready '
                  : activeTab === 'getting_ready'
                    ? 'processing '
                    : ''}
                profiles
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {activeTab === 'ready'
                  ? 'Profiles will appear here when they are ready'
                  : activeTab === 'getting_ready'
                    ? 'Profiles being processed will appear here'
                    : 'Create your first profile to get started'}
              </Text>
            </View>
          ) : (
            <View style={styles.profilesGrid}>
              {filteredProfiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  deletingId={deletingId}
                  submittingId={submittingId}
                  onPress={navigateToProfile}
                  onDelete={handleDelete}
                  onSubmit={submitProfile}
                  onGenerate={navigateToGenerateImage}
                />
              ))}
            </View>
          )}
          <ProgressModal
            submissionSuccess={submissionSuccess}
            isVisible={submittingId !== null}
            progress={submissionProgress}
            title="Submitting Profile"
            message={`Submitting profile for training...`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  cardsContainer: {
    padding: 16,
  },
  profilesGrid: {
    flexDirection: 'column',
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: colors.accent1,
    borderRadius: 8,
  },
  retryText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.grey[700],
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.grey[600],
    marginTop: 8,
    textAlign: 'center',
  },
  createCard: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  createIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.common.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  createCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.common.white,
    marginBottom: 4,
  },
  createCardSubtitle: {
    fontSize: 14,
    color: colors.common.white,
  },
  addImageIconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
    justifyContent: 'center',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  noPreviewContainer: {
    width: '100%',
    height: 120,
    backgroundColor: colors.accent1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
    color: colors.grey[500],
    marginTop: 4,
  },
  imageCount: {
    fontSize: 12,
    color: colors.grey[500],
    marginTop: 4,
    fontWeight: '500',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.common.white,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    backgroundColor: colors.common.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  activeTabButton: {
    elevation: 3,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  tabGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.12,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey[600],
  },
  tabButtonTextGettingReady: {
    color: colors.grey[400],
  },
  activeTabButtonText: {
    color: colors.text,
    fontWeight: '700',
  },
  createCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Dashboard;
