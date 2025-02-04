import { ImageGrid } from '@/components/elements/ImageGrid';
import { ImageModal } from '@/components/elements/ImageModal';
import { ProgressBar } from '@/components/elements/ProgressBar';
import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useProfileImages } from '@/hooks';

export default function ProfileDetail() {
  const { id } = useLocalSearchParams();
  const {
    images,
    isLoading,
    selectedImage,
    modalVisible,
    handleImagePick,
    handleImageRemove,
    handleImageSelect,
    handleModalClose,
    handleClearImages,
    handleSave,
  } = useProfileImages(id as string);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ProgressBar
        imagesCount={images.length}
        onClearImages={handleClearImages}
      />

      <ImageGrid
        images={images}
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
      />

      {images.length < 30 && (
        <TouchableOpacity 
          style={[styles.addButton, images.length >= 30 && styles.addButtonDisabled]}
          onPress={handleImagePick}
        >
          <Ionicons name="add" size={32} color={colors.common.white} />
        </TouchableOpacity>
      )}

      <ImageModal
        visible={modalVisible}
        imageUri={selectedImage}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.common.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text.secondary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonDisabled: {
    backgroundColor: colors.text.disabled,
    shadowOpacity: 0.1,
  },
});
