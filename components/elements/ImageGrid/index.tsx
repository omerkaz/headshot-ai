import { colors } from '@/theme';
import { ImageOfProfile } from '@/types/imageOfProfile';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ImageGridProps {
  imagesOfProfile: ImageOfProfile[];
  onImageSelect: (uri: string) => void;
  onImageRemove: (profileId: string, imageId: string, imagePath: string) => void;
}

export function ImageGrid({ imagesOfProfile, onImageSelect, onImageRemove }: ImageGridProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>
        {imagesOfProfile.map((image, index) => (
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
              onPress={() => onImageSelect(image.image_url)}>
              <Image source={{ uri: image.image_url }} style={styles.image} />
            </TouchableOpacity>
            <Pressable
              style={styles.deleteButton}
              onPress={() => onImageRemove(image.profile_id, image.id, image.image_url)}>
              <View style={styles.deleteIconContainer}>
                <Ionicons name="close-circle" size={22} color={colors.status.error} />
              </View>
            </Pressable>
          </View>
        ))}
      </View>
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
