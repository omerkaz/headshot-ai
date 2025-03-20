import { colors } from '@/theme/colors';
import { HeadshotProfile } from '@/types/database.types';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

interface ProfileCardProps {
  profile: HeadshotProfile;
  deletingId: string | null;
  submittingId: string | null;
  onPress: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onSubmit: (id: string, triggerPhrase: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  deletingId,
  submittingId,
  onPress,
  onDelete,
  onSubmit,
}) => {
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return colors.status.success;
      case 'getting_ready':
        return colors.accent2;
      case 'not_ready':
        return colors.grey[400];
      default:
        return colors.grey[400];
    }
  };

  // Get human-readable status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'getting_ready':
        return 'Processing';
      case 'not_ready':
        return 'Not Ready';
      default:
        return 'Unknown';
    }
  };

  return (
    <Pressable style={styles.card} onPress={() => onPress(profile.id, profile.status)}>
      <View style={styles.cardContent}>
        {/* Status indicator */}
        <View style={styles.statusRow}>
          <View
            style={[styles.statusIndicator, { backgroundColor: getStatusColor(profile.status) }]}
          />
          <Text style={styles.statusText}>{getStatusText(profile.status)}</Text>

          {/* Delete button - moved to status row */}
          <Pressable
            style={styles.deleteButton}
            onPress={e => {
              e.stopPropagation();
              onDelete(profile.id);
            }}>
            {deletingId === profile.id ? (
              <ActivityIndicator size="small" color={colors.status.error} />
            ) : (
              <Ionicons name="trash-outline" size={18} color={colors.status.error} />
            )}
          </Pressable>
        </View>

        {/* Profile info section */}
        <View style={styles.profileInfo}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-circle-outline" size={30} color={colors.text} />
          </View>

          <View style={styles.profileTextContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {profile.name}
            </Text>
            <Text style={styles.cardDate}>
              {format(new Date(profile.created_at), 'MMM d, yyyy')}
            </Text>

            {profile.total_images > 0 && (
              <View style={styles.imageCountContainer}>
                <Ionicons name="images-outline" size={12} color={colors.grey[500]} />
                <Text style={styles.imageCount}>{profile.total_images} images</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action button for not ready profiles */}
        {profile.status === 'not_ready' && profile.total_images >= 10 && (
          <Pressable
            style={styles.submitProfileButton}
            onPress={e => {
              e.stopPropagation();
              onSubmit(profile.id, profile.trigger_phrase);
            }}>
            <LinearGradient
              colors={[colors.text, colors.accent2]}
              start={{ x: 0, y: 1.8 }}
              end={{ x: 1.8, y: 1 }}
              style={styles.submitGradient}>
              {submittingId === profile.id ? (
                <ActivityIndicator size="small" color={colors.common.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={16}
                    color={colors.common.white}
                    style={styles.submitButtonIcon}
                  />
                  <Text style={styles.submitButtonText}>Process Images</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        )}

        {/* View Details hint */}
        <View style={styles.viewDetailsContainer}>
          <Text style={styles.viewDetailsText}>Tap to view details</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.grey[400]} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
    padding: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.grey[600],
    fontWeight: '500',
    flex: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 8,
  },
  profileTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cardDate: {
    fontSize: 12,
    color: colors.grey[500],
    marginTop: 2,
  },
  imageCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  imageCount: {
    fontSize: 12,
    color: colors.grey[500],
    marginLeft: 4,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.grey[100],
  },
  submitProfileButton: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
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
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  viewDetailsText: {
    fontSize: 11,
    color: colors.grey[400],
    marginRight: 2,
  },
});

export default ProfileCard;
