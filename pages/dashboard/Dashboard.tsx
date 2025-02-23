import { supabase } from '@/services/initSupabase'; // Make sure you have this setup
import { colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Enhanced Profile type
type Profile = {
  id: string;
  status: string;
  created_at: string;
  name: string;
  preview_images?: string[];
  total_images?: number;
};

type TabType = 'not_ready' | 'ready' | 'getting_ready';

const Dashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('not_ready');

  useEffect(() => {
    // Check auth state when component mounts
    const checkAuth = async () => {
      // const {
      //   data: { session },
      // } = await supabase.auth.getSession();
      // setIsAuthenticated(!!session);
      // if (session) {
      //   console.log('User is authenticated with token:', session.access_token);
      //   fetchProfiles();
      // } else {
      //   setLoading(false);
      //   router.push('/login');
      //   setError('Please log in to view profiles');
      // }
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchProfiles();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfiles = async () => {
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

  const navigateToProfile = (id: string) => {
    console.log('navigateToProfile', id);
    router.push(`/dashboard/${id}`);
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
      <Text style={[styles.tabButtonText, activeTab === type && styles.activeTabButtonText]}>
        {label}
      </Text>
    </Pressable>
  );

  console.log('profiles', profiles);
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
        <Text style={styles.errorText}>Error: {error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchProfiles}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.cardsContainer}>
          {/* Create New Profile Card */}
          <Pressable style={[styles.card, styles.createCard]} onPress={createNewProfile}>
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
              <Ionicons name="images-outline" size={48} color={colors.grey[500]} />
              <Text style={styles.emptyStateText}>
                No {activeTab === 'ready' ? 'ready' : 'pending'} profiles
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {activeTab === 'ready'
                  ? 'Profiles will appear here when they are ready'
                  : 'Create your first profile to get started'}
              </Text>
            </View>
          ) : (
            filteredProfiles.map(profile => (
              <Pressable
                key={profile.id}
                style={styles.card}
                onPress={() => navigateToProfile(profile.id)}>
                <View style={styles.cardContent}>
                  {/* Delete button */}
                  <Pressable
                    style={styles.deleteButton}
                    onPress={e => {
                      e.stopPropagation();
                      handleDelete(profile.id);
                    }}>
                    {deletingId === profile.id ? (
                      <ActivityIndicator size="small" color={colors.status.error} />
                    ) : (
                      <Ionicons name="trash-outline" size={20} color={colors.status.error} />
                    )}
                  </Pressable>
                  <View style={styles.previewContainer}>
                    {profile.preview_images ? (
                      profile.preview_images
                        .slice(0, 4)
                        .map((uri, index) => (
                          <Image key={index} source={{ uri }} style={styles.previewImage} />
                        ))
                    ) : (
                      <View style={styles.noPreviewContainer}>
                        <Ionicons name="images-outline" size={24} color={colors.grey[500]} />
                      </View>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          profile.status === 'ready'
                            ? colors.status.success
                            : colors.status.warning,
                      },
                    ]}>
                    <Text style={styles.statusText}>{profile.status}</Text>
                  </View>
                  <Text style={styles.cardTitle}>
                    {profile.name || `Profile ${profile.id.slice(0, 4)}`}
                  </Text>
                  <Text style={styles.cardDate}>
                    {format(new Date(profile.created_at), 'MMM d, yyyy')}
                  </Text>
                  {profile.total_images && (
                    <Text style={styles.imageCount}>{profile.total_images} images</Text>
                  )}
                </View>
              </Pressable>
            ))
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
  cardsContainer: {
    padding: 16,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.grey[500],
  },
  createCard: {
    width: '100%',
    marginBottom: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: colors.accent2,
    backgroundColor: colors.accent1,
  },
  createIconContainer: {
    padding: 16,
    borderRadius: 50,
    backgroundColor: colors.common.white,
    marginBottom: 12,
  },
  createCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  createCardSubtitle: {
    fontSize: 14,
    color: colors.grey[500],
  },
  previewContainer: {
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: colors.common.white,
    fontSize: 12,
    fontWeight: '600',
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
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.grey[500],
    marginTop: 8,
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
    marginBottom: 16,
    backgroundColor: colors.common.white,
    borderRadius: 8,
    padding: 4,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeTabButton: {
    backgroundColor: colors.accent1,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey[500],
  },
  activeTabButtonText: {
    color: colors.common.black,
  },
});

export default Dashboard;
