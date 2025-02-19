import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.accent1,
        },
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
          headerTintColor: colors.text,
          headerLeft: () => (
            <Stack.Screen
              options={{
                headerLeft: () => (
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={colors.text}
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
          headerBackVisible: false,
          headerTintColor: colors.text,
          headerLeft: () => (
            <Stack.Screen
              options={{
                headerLeft: () => (
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={colors.text}
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
