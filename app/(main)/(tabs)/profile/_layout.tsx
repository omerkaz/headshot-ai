import NavigationHeaderTitle from '@/components/layouts/NavigationHeaderTitle';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  const { isDark } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.common.white,
        headerStyle: { backgroundColor: isDark ? colors.common.black : colors.primary.main },
        headerTitleStyle: { fontSize: 18 },
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
