import { colors } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet from '../BottomSheet';

interface ProfileNameBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  imagesCount: number;
  isLoading: boolean;
}

export function ProfileNameBottomSheet({
  isOpen,
  onClose,
  onSave,
  imagesCount,
  isLoading,
}: ProfileNameBottomSheetProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a profile name');
      return;
    }
    if (name.trim().length < 3) {
      setError('Profile name must be at least 3 characters');
      return;
    }
    if (name.trim().length > 50) {
      setError('Profile name must be less than 50 characters');
      return;
    }
    onSave(name.trim());
    setName('');
    setError('');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Name Your Profile</Text>
        <Text style={styles.subtitle}>{imagesCount} images selected</Text>

        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="e.g., Professional Headshots"
          value={name}
          onChangeText={text => {
            setName(text);
            setError('');
          }}
          maxLength={50}
          autoFocus
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={!name.trim() || name.trim().length < 3 || name.trim().length > 50}>
          <LinearGradient
            colors={[colors.accent1, colors.accent3]}
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: 0 }}
            style={styles.gradient}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.common.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Profile</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey[600],
    marginBottom: 24,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.grey[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.common.white,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 14,
    marginTop: 8,
  },
  saveButton: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 24,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
