import useColorScheme from '@/hooks/useColorScheme';
import { supabase } from '@/services/initSupabase'; // Adjust path if needed
import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { Session } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Define types for the TabIcon props
type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
};

// Simple tab icon component
const TabIcon: React.FC<TabIconProps> = ({ name, color, size, focused }) => {
  if (focused) {
    return (
      <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
        <MaskedView
          style={{ width: size, height: size }}
          maskElement={<Ionicons name={name} size={size} color="black" />}>
          <LinearGradient
            colors={[colors.text, colors.accent2]}
            start={{ x: 0, y: 1.8 }}
            end={{ x: 1.8, y: 1 }}
            style={{ flex: 1 }}
          />
        </MaskedView>
      </View>
    );
  }

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <MaskedView
        style={{ width: size, height: size }}
        maskElement={<Ionicons name={name} size={size} color="black" />}>
        <LinearGradient
          colors={[colors.text, colors.accent2]}
          start={{ x: 0, y: 1.8 }}
          end={{ x: 1.8, y: 1 }}
          style={{ flex: 1 }}
        />
      </MaskedView>
    </View>
  );
};

export default function TabsLayout() {
  const { isDark } = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check initial session state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // No need to set loading false here, it was set after initial check
      // If the user logs out (_event === 'SIGNED_OUT'), session becomes null
      // and the component will re-render, triggering the Redirect below.
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    // Show loading indicator while checking auth
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (!session) {
    // User is not authenticated, redirect to login
    // Using <Redirect> is recommended over router.push in layouts for initial auth redirects
    return <Redirect href="/login" />;
  }

  // User is authenticated, render the child route (<Slot /> represents the matched child screen)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarInactiveTintColor: colors.accent2,
        tabBarActiveTintColor: colors.text,
        tabBarShowLabel: false,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'grid' : 'grid-outline'}
              size={40}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'person' : 'person-outline'}
              size={40}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 15,
    backgroundColor: colors.background,
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 0,
    paddingBottom: 0,
    paddingHorizontal: 30,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
    borderRadius: 20,
  },
  iconContainerFocused: {
    transform: [{ translateY: -4 }],
  },
  tabLabel: {
    color: colors.text,
    marginBottom: 8,
  },
});
