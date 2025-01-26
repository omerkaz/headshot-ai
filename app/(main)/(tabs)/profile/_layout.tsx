import NavigationHeaderTitle from '@/components/layouts/NavigationHeaderTitle';
import useColorScheme from '@/hooks/useColorScheme';
import { colors } from '@/theme';
import { DrawerActions } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';

export default function ProfileStackLayout() {
  const navigation = useNavigation();
  const { isDark } = useColorScheme();
  const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());
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
      <Stack.Screen name="details" options={{ title: 'Details' }} />
    </Stack>
  );
}
