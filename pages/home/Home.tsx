import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    color: colors.primary.main,
    fontSize: 16,
  },
  uploadArea: {
    height: 180,
    margin: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary.main,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main + '10',
  },
  uploadIcon: {
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  selectButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '500',
  },
  previewSection: {
    margin: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.common.black,
  },
  imageCount: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageContainer: {
    width: (Platform.OS === 'web' ? 150 : '30%'),
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  actionButtonText: {
    marginLeft: 8,
    color: colors.primary.main,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default function Home() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Upload Area */}
      <View style={styles.uploadArea}>
        <Ionicons 
          name="camera-outline" 
          size={48} 
          color={colors.primary.main}
          style={styles.uploadIcon}
        />
        <Text style={styles.uploadText}>Tap to upload</Text>
        <TouchableOpacity style={styles.selectButton} onPress={pickImages}>
          <Text style={styles.selectButtonText}>Select Photos</Text>
        </TouchableOpacity>
      </View>

      {/* Preview Section */}
      
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Preview</Text>
            <Text style={styles.imageCount}>{images.length} images</Text>
          </View>
          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={20} color={colors.common.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setImages([])}
        >
          <Ionicons name="trash" size={20} color={colors.primary.main} />
          <Text style={styles.actionButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={[styles.saveButton, { opacity: images.length < 10 ? 0.5 : 1 }]} disabled={images.length < 10}>
        <Text style={styles.saveButtonText}>Save Images</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
