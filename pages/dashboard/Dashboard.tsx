import { supabase } from '@/services/initSupabase'; // Make sure you have this setup
import { colors } from '@/theme/colors';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Type for our profile
type Profile = {
  id: string;
  status: string;
  created_at: string;
};

const Dashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check auth state when component mounts
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        console.log('User is authenticated with token:', session.access_token);
        fetchProfiles();
      } else {
        setLoading(false);
        router.push('/login');
        setError('Please log in to view profiles');
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
        .from('profiles')
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
    router.push(`/dashboard/${id}`);
  };
  console.log("profiles", profiles);
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
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
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>AI Headshot Generator</Text>
        <Text style={styles.subtitle}>Your Professional Profiles</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.cardsContainer}>
          {profiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No profiles yet</Text>
            </View>
          ) : (
            profiles.map((profile) => (
              <Pressable
                key={profile.id}
                style={styles.card}
                onPress={() => navigateToProfile(profile.id)}
              >
                <View style={styles.cardContent}>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: profile.status === 'ready' ? colors.status.success : colors.status.warning }
                  ]} />
                  <Text style={styles.cardTitle}>Profile {profile.id.slice(0, 4)}</Text>
                  <Text style={styles.cardStatus}>{profile.status}</Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  header: {
    padding: 16,
    backgroundColor: colors.primary.main,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.primary,
    opacity: 0.8,
    marginTop: 4,
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
    color: colors.primary.main,
    marginTop: 8,
  },
  cardStatus: {
    fontSize: 14,
    color: colors.text.secondary,
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
    backgroundColor: colors.primary.main,
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
    color: colors.text.secondary,
  },
});

export default Dashboard; 