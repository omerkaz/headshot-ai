import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const TAB_WIDTH = (width - 40 * 2) / 2; // For 2 tabs

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
          maskElement={
            <Ionicons 
              name={name} 
              size={size}
              color="black"
            />
          }
        >
          <LinearGradient
             colors={[colors.accent1, colors.accent3]}
             start={{ x: 1, y: 0 }}
             end={{ x: 2.2, y: 1 }}

            style={{ flex: 1 }}
          />
        </MaskedView>
      </View>
    );
  }

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Ionicons 
        name={name} 
        size={size} 
        color={color}
      />
    </View>
  );
};

export default function TabLayout() {
  const { isDark } = useColorScheme();

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
              name={focused ? "grid" : "grid-outline"}
              size={32}
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
              name={focused ? "person" : "person-outline"}
                size={32}
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
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 15,
    backgroundColor: colors.background,
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 0,
    paddingBottom: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginTop: 7,
    borderRadius: 20,
  },
  iconContainerFocused: {
    transform: [{translateY: -4}],
  },
  tabLabel: {
    color: colors.text,
    marginBottom: 8,
  },
});
