import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface NewProfileImageGridProps {
  images: string[];
  onImageSelect: (uri: string) => void;
  onImageRemove: (index: number) => void;
}

export function NewProfileImageGrid({
  images,
  onImageSelect,
  onImageRemove,
}: NewProfileImageGridProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        images.length === 0 && styles.emptyContentContainer,
      ]}
      showsVerticalScrollIndicator={false}>
      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={64} color={colors.accent1} />
          <Text style={styles.emptyText}>
            Add at least 10 photos of yourself to create a profile
          </Text>
          <Text style={styles.emptySubText}>
            Choose photos with good lighting and clear facial features
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {images.map((imageUri, index) => (
            <View
              key={index}
              style={[
                styles.imageContainer,
                index % 4 === 0 && styles.largeImage,
                index % 4 === 1 && styles.mediumImage,
                index % 4 === 2 && styles.smallImage,
                index % 4 === 3 && styles.mediumImage,
              ]}>
              <TouchableOpacity
                style={styles.imageTouchable}
                onPress={() => onImageSelect(imageUri)}>
                <Image source={{ uri: imageUri }} style={styles.image} />
              </TouchableOpacity>
              <Pressable style={styles.deleteButton} onPress={() => onImageRemove(index)}>
                <View style={styles.deleteIconContainer}>
                  <Ionicons name="close-circle" size={22} color={colors.status.error} />
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.grey[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    margin: 4,
    borderRadius: 8,
    overflow: 'visible',
    backgroundColor: colors.accent1,
    position: 'relative',
  },
  imageTouchable: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  largeImage: {
    width: '48%',
    aspectRatio: 1,
  },
  mediumImage: {
    width: '31%',
    aspectRatio: 1,
  },
  smallImage: {
    width: '23%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
    padding: 4,
  },
  deleteIconContainer: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
