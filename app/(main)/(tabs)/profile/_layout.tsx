import NavigationHeaderTitle from '@/components/layouts/NavigationHeaderTitle';
import useColorScheme from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  const { isDark } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <NavigationHeaderTitle />,
        }}
      />
    </Stack>
  );
}
