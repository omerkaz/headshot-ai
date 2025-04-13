import useColorScheme from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  const { isDark } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
