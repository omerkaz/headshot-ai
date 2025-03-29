import ProfileCard from '@/components/ProfileCard';
import { supabase } from '@/services/initSupabase'; // Make sure you have this setup
import prepareProfileToPrepareRequest from '@/services/prepareProfileToPrepareRequest';
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

  useEffect(() => {
    // Fetch profiles immediately since we know user is authenticated
    fetchProfiles();
    // You might want to re-fetch if something external changes,
    // otherwise, fetching only once on mount might be sufficient.
    // Consider adding dependencies if needed.
  }, []); // Runs once when the component mounts

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
    router.push(`/dashboard/generateImage?profileId=${id}`);
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
    try {
      setSubmittingId(profileId);
      console.log('triggerPhrase', triggerPhrase);
      console.log('profileId', profileId);
      const preparedProfile = await prepareProfileToPrepareRequest(
        profileId,
        triggerPhrase,
        (progress: number) => {
          console.log('progress', progress);
        }
      );
      console.log('preparedProfile', preparedProfile);
      return;
    } catch (err) {
      console.error('Error submitting profile:', err);
      Alert.alert('Error', 'Failed to submit profile for processing. Please try again.');
    } finally {
      setSubmittingId(null);
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

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
            android_ripple={{ color: colors.grey[200], borderless: false }}>
            <View style={styles.cardContent}>
              <View style={styles.createIconContainer}>
                <Ionicons name="add-circle" size={40} color={colors.text} />
              </View>
              <Text style={styles.createCardTitle}>Create New Profile</Text>
              <Text style={styles.createCardSubtitle}>Start generating headshots</Text>
            </View>
          </Pressable>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TabButton type="not_ready" label="Not Ready" />
            <TabButton type="getting_ready" label="Getting Ready" />
            <TabButton type="ready" label="Ready" />
          </View>

          {filteredProfiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={60} color={colors.grey[400]} />
              <Text style={styles.emptyStateText}>
                No{' '}
                {activeTab === 'ready'
                  ? 'ready'
                  : activeTab === 'getting_ready'
                    ? 'processing'
                    : 'pending'}{' '}
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
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.grey[600],
    marginTop: 4,
  },
  cardsContainer: {
    padding: 16,
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.common.white,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  cardStatus: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: colors.accent1,
    padding: 4,
    elevation: 2,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: colors.text,
    marginBottom: 4,
  },
  createCardSubtitle: {
    fontSize: 14,
    color: colors.grey[600],
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
  submitProfileButton: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    height: 36,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 12,
  },
  submitButtonText: {
    color: colors.common.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButtonIcon: {
    marginRight: 6,
  },
});

export default Dashboard;
