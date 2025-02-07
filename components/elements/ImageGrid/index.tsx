import { colors } from '@/theme';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ImageGridProps {
  images: string[];
  onImageSelect: (uri: string) => void;
  onImageRemove: (index: number) => void;
}

export function ImageGrid({ images, onImageSelect, onImageRemove }: ImageGridProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {images.map((uri, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.imageContainer,
              index % 4 === 0 && styles.largeImage,
              index % 4 === 1 && styles.mediumImage,
              index % 4 === 2 && styles.smallImage,
              index % 4 === 3 && styles.mediumImage,
            ]}
            onPress={() => onImageSelect(uri)}
            onLongPress={() => onImageRemove(index)}
          >
            <Image source={{ uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.accent1,
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
}); 