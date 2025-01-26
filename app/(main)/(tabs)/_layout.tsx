import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const { isDark } = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarInactiveBackgroundColor: isDark ? colors.common.black : colors.common.white,
        tabBarActiveTintColor: colors.primary.main,
        tabBarActiveBackgroundColor: isDark ? colors.common.black : colors.common.white,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <AntDesign name="profile" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
