import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent', // Must be transparent
        },
        headerBackground: () => (
          <View style={{ flex: 1, opacity: 1.5 }}>
            <LinearGradient
              colors={[colors.text, colors.accent2]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 2, y: 0 }}
            />
          </View>
        ),
        headerTintColor: colors.common.white,
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Headshot Profile',
          headerBackVisible: false,
          headerTintColor: colors.common.white,
          headerLeft: () => (
            <Stack.Screen
              options={{
                headerLeft: () => (
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={colors.common.white}
                    style={{ marginLeft: 16 }}
                    onPress={() => router.back()}
                  />
                ),
              }}
            />
          ),

          presentation: 'card',
        }}
      />

      <Stack.Screen
        name="newHeadshotProfile"
        options={{
          headerTitle: 'New Headshot Profile',
          headerTintColor: colors.common.white,
          headerLeft: () => (
            <Stack.Screen
              options={{
                headerLeft: () => (
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={colors.common.white}
                    style={{ marginLeft: 16 }}
                    onPress={() => router.back()}
                  />
                ),
              }}
            />
          ),
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="[profileId]"
        options={{
          headerTitle: 'Generate Image',
          headerBackVisible: false,
          headerTintColor: colors.common.white,
          headerLeft: () => (
            <Stack.Screen
              options={{
                headerLeft: () => (
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={colors.common.white}
                    style={{ marginLeft: 16 }}
                    onPress={() => router.back()}
                  />
                ),
              }}
            />
          ),
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
