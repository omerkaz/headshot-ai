import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

// Import example images - adjust paths/filenames if needed
// @ts-ignore
import ExampleImage1 from '../../../assets/images/examples/good-examples-1.jpeg';
// @ts-ignore
import ExampleImage2 from '../../../assets/images/examples/good-examples-2.jpeg';
// @ts-ignore
import ExampleImage3 from '../../../assets/images/examples/good-examples-3.jpeg';
// @ts-ignore
import ExampleImage4 from '../../../assets/images/examples/good-examples-4.jpeg';
// @ts-ignore
import ExampleImage5 from '../../../assets/images/examples/bad-examples-1.jpeg';
// @ts-ignore
import ExampleImage6 from '../../../assets/images/examples/bad-examples-2.jpeg';
// @ts-ignore
import ExampleImage7 from '../../../assets/images/examples/bad-examples-3.jpeg';

interface NewProfileImageGridProps {
  images: string[];
  onImageSelect: (uri: string) => void;
  onImageRemove: (index: number) => void;
  onAddImage: () => void;
}

export function NewProfileImageGrid({
  images,
  onImageSelect,
  onImageRemove,
  onAddImage,
}: NewProfileImageGridProps) {
  const goodExampleImages = [ExampleImage1, ExampleImage2, ExampleImage3, ExampleImage4]; // Array for easier mapping
  const badExampleImages = [ExampleImage5, ExampleImage6, ExampleImage7]; // Array for easier mapping

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
          <View style={styles.emptyIconContainer}>
            <LinearGradient
              colors={[colors.text, colors.accent2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emptyIconGradient}>
              <Ionicons name="images-outline" size={50} color={colors.common.white} />
            </LinearGradient>
          </View>
          <Text style={styles.emptyTitle}>Your Photo Gallery</Text>
          <Text style={styles.emptySubtitle}>
            Add at least 10 photos of yourself. Clear, well-lit photos work best!
          </Text>

          <View style={styles.examplesSection}>
            <View style={styles.examplesSubSection}>
              <Text style={styles.exampleLabel}>✓ Good Examples</Text>
              <View style={styles.exampleImagesRow}>
                {goodExampleImages.map((imgSrc, index) => (
                  <View key={`good-${index}`} style={styles.exampleImageWrapper}>
                    <Image source={imgSrc} style={styles.exampleImage} />
                    <View style={[styles.exampleIconOverlay, styles.goodIconOverlay]}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.common.white} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.examplesSubSection}>
              <Text style={styles.exampleLabel}>✗ Avoid These</Text>
              <View style={styles.exampleImagesRow}>
                {badExampleImages.map((imgSrc, index) => (
                  <View key={`bad-${index}`} style={styles.exampleImageWrapper}>
                    <Image source={imgSrc} style={styles.exampleImage} />
                    <View style={[styles.exampleIconOverlay, styles.badIconOverlay]}>
                      <Ionicons name="close-circle" size={18} color={colors.common.white} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
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
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyContainer: {
    marginTop: -10,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    opacity: 0.2,
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.grey[600],
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  examplesSection: {
    width: '100%',
    marginBottom: 30,
  },
  examplesSubSection: {
    marginBottom: 20,
  },
  exampleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'left',
    paddingLeft: 5,
  },
  exampleImagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  exampleImageWrapper: {
    position: 'relative',
    marginHorizontal: 5,
  },
  exampleImage: {
    width: 70,
    height: 90,
    borderRadius: 8,
    backgroundColor: colors.grey[200],
  },
  exampleIconOverlay: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  goodIconOverlay: {
    backgroundColor: colors.status.success,
  },
  badIconOverlay: {
    backgroundColor: colors.status.error,
  },
  addPhotoButton: {
    width: '80%',
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 20,
  },
  addPhotoButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addPhotoButtonText: {
    color: colors.common.white,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
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
